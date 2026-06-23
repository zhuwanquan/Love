/**
 * 剧本数据完整性验证脚本
 * 检查：场景引用、变量一致性、结局可达性、格式正确性
 *
 * 用法：node tests/validate_script.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const errors = [];
const warnings = [];

// ── 加载数据 ──
const dayFiles = fs.readdirSync(DATA_DIR).filter(f => f.match(/^day\d+\.js$/)).sort();
const allScenes = {};
const allMetas = [];
let allEndings = null;
const allSceneIds = {};
const allGotoTargets = new Set();

/**
 * 提取脚本对象 — 支持两种格式：
 * Format A: const X = {...}; if (typeof module) ...
 * Format B: const X = {...};
 */
function extractScriptData(code) {
  // 移除注释头部
  let clean = code.replace(/\/\*\*[\s\S]*?\*\//, ''); // 移除块注释
  clean = clean.replace(/^[\s\n]*/, '');                // 移除前导空白

  // 找到 = 号后面JSON的起始
  const eqIdx = clean.indexOf('=');
  if (eqIdx === -1) throw new Error('找不到赋值语句');

  // 从 = 后面找到 {
  const startIdx = clean.indexOf('{', eqIdx);
  if (startIdx === -1) throw new Error('找不到对象起始');

  // 从 startIdx 开始找匹配的 } (注意字符串和嵌套)
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let endIdx = -1;
  for (let i = startIdx; i < clean.length; i++) {
    const ch = clean[i];
    if (inString) {
      if (ch === '\\') { i++; continue; }
      if (ch === stringChar) { inString = false; }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === '{') braceCount++;
    if (ch === '}') {
      braceCount--;
      if (braceCount === 0) { endIdx = i + 1; break; }
    }
  }
  if (endIdx === -1) throw new Error('找不到对象结束');

  const jsonStr = clean.substring(startIdx, endIdx);
  return eval(`(${jsonStr})`);
}

console.log('📂 加载数据文件...');
for (const file of dayFiles) {
  const code = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  try {
    const scriptData = extractScriptData(code);

    if (scriptData.meta) {
      allMetas.push({ file, ...scriptData.meta });
    }
    if (scriptData.scenes) {
      Object.entries(scriptData.scenes).forEach(([id, scene]) => {
        allScenes[id] = { ...scene, _source: file };
        allSceneIds[id] = file;
      });
    }
    if (scriptData.endings) {
      allEndings = allEndings || {};
      Object.assign(allEndings, scriptData.endings);
    }
    console.log(`  ✅ ${file} — ${Object.keys(scriptData.scenes || {}).length} 场景`);
  } catch (e) {
    errors.push(`${file}: 解析失败 — ${e.message}`);
  }
}

console.log(`\n📊 总计: ${Object.keys(allScenes).length} 场景, ${allMetas.length} 天`);

// ── 测试1: 检查场景引用完整性 ──
console.log('\n🔍 测试1: 场景引用完整性');

// 收集所有跳转目标
for (const [id, scene] of Object.entries(allScenes)) {
  if (scene.next) allGotoTargets.add(scene.next);
  for (const line of scene.lines || []) {
    if (line.type === 'goto') allGotoTargets.add(line.target);
    if (line.type === 'conditional') {
      for (const cond of line.conditions || []) {
        if (cond.goto) allGotoTargets.add(cond.goto);
      }
      if (line.default) allGotoTargets.add(line.default);
    }
    if (line.type === 'choices') {
      for (const opt of line.options || []) {
        if (opt.goto) allGotoTargets.add(opt.goto);
      }
    }
  }
}

// 检查每个跳转目标是否存在
let missingRefs = 0;
for (const target of allGotoTargets) {
  if (!allScenes[target]) {
    errors.push(`场景 "${target}" 被引用但不存在`);
    missingRefs++;
  }
}
console.log(`  ${missingRefs === 0 ? '✅' : '❌'} 跳转目标: ${allGotoTargets.size} 个引用, ${missingRefs} 个缺失`);

// ── 测试2: 检查孤立场景 ──
console.log('\n🔍 测试2: 孤立场景检查');
let orphanCount = 0;
for (const id of Object.keys(allScenes)) {
  const isReferenced = allGotoTargets.has(id);
  // 排除 DayN_opening 和明显的起始场景
  if (!isReferenced && !id.match(/^day\d+_opening$/) && !id.includes('transition')) {
    warnings.push(`场景 "${id}" 可能孤立（无其他场景跳转到它）`);
    orphanCount++;
  }
}
console.log(`  ${orphanCount === 0 ? '✅' : '⚠️'} 孤立场景: ${orphanCount} 个`);

// ── 测试3: 变量一致性 ──
console.log('\n🔍 测试3: 变量定义一致性');
const allVarNames = new Set();
for (const meta of allMetas) {
  if (meta.variables) {
    Object.keys(meta.variables).forEach(v => allVarNames.add(v));
  }
}
console.log(`  定义变量 (${allVarNames.size}): ${[...allVarNames].join(', ')}`);

// 检查变量使用
const usedVars = new Set();
for (const [id, scene] of Object.entries(allScenes)) {
  for (const line of scene.lines || []) {
    if (line.type === 'variable' && line.operations) {
      Object.keys(line.operations).forEach(v => usedVars.add(v));
    }
    if (line.type === 'conditional') {
      for (const cond of line.conditions || []) {
        if (cond.var) usedVars.add(cond.var);
      }
    }
    // choices 中的 evaluate_endings 引用结局条件中的变量
    if (line.type === 'choices' && line.options) {
      for (const opt of line.options) {
        // option text no vars
      }
    }
  }
}
// 检查结局条件中的变量
if (allEndings) {
  for (const [endingId, endingDef] of Object.entries(allEndings)) {
    for (const cond of endingDef.conditions?.conditions || []) {
      if (cond.var) usedVars.add(cond.var);
    }
  }
}

console.log(`  使用变量 (${usedVars.size}): ${[...usedVars].join(', ')}`);

for (const v of usedVars) {
  if (!allVarNames.has(v)) {
    errors.push(`变量 "${v}" 被使用但未在 meta.variables 中定义`);
  }
}
for (const v of allVarNames) {
  if (!usedVars.has(v)) {
    warnings.push(`变量 "${v}" 已定义但从未被使用`);
  }
}

// ── 测试4: 结局条件可达性 ──
console.log('\n🔍 测试4: 结局条件分析');
if (allEndings) {
  const endingIds = Object.keys(allEndings);
  console.log(`  结局数: ${endingIds.length}`);
  for (const [id, def] of Object.entries(allEndings)) {
    const varRefs = (def.conditions?.conditions || []).map(c => `${c.var} ${c.op} ${c.value}`).join(', ');
    console.log(`  ${def.name}: ${def.conditions?.logic || 'AND'} [${varRefs}]`);

    // 检查结局场景是否存在
    if (!allScenes[id] && !allScenes[`${id}_sequence`] && !allScenes[`ending_${id}`]) {
      warnings.push(`结局 "${def.name}" 的场景 "${id}" 未找到`);
    }
  }
} else {
  warnings.push('未定义结局条件');
}

// ── 测试5: 场景结构完整性 ──
console.log('\n🔍 测试5: 场景结构检查');
let structureErrors = 0;
for (const [id, scene] of Object.entries(allScenes)) {
  if (!scene.lines || !Array.isArray(scene.lines)) {
    errors.push(`场景 "${id}": 缺少 lines 数组`);
    structureErrors++;
    continue;
  }
  if (scene.lines.length === 0) {
    warnings.push(`场景 "${id}": lines 数组为空`);
    structureErrors++;
  }

  // 检查每个场景是否有合理的结束（next / goto / choices / 结局场景）
  const lastLine = scene.lines[scene.lines.length - 1];
  const validEnds = ['goto', 'choices', 'conditional'];
  if (!scene.next && !validEnds.includes(lastLine?.type)) {
    // 结局场景除外
    if (!id.includes('ending') && !id.includes('_exit') && !id.includes('_sequence')) {
      warnings.push(`场景 "${id}": 无 next 且不以 goto/choices/conditional 结尾 (最后行类型: ${lastLine?.type})`);
    }
  }
}
console.log(`  ${structureErrors === 0 ? '✅' : '❌'} 结构错误: ${structureErrors}`);

// ── 测试6: 过渡完整性 ──
console.log('\n🔍 测试6: 节点日衔接检查');
const dayOrder = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8'];
for (let i = 0; i < dayOrder.length - 1; i++) {
  const current = dayOrder[i];
  const next = dayOrder[i + 1];
  const transitionId = `${current}_to_${next}_transition`;
  if (!allScenes[transitionId]) {
    warnings.push(`缺少过渡场景: ${transitionId}`);
  } else {
    // 检查过渡场景是否指向下一个 day
    const transScene = allScenes[transitionId];
    const hasGoto = transScene.lines.some(l => l.type === 'goto' && l.target?.startsWith(next));
    if (!hasGoto) {
      warnings.push(`过渡场景 ${transitionId} 未跳转到 ${next}`);
    }
  }
}
console.log('  ✅ 过渡场景检查完成');

// ── 测试7: 引擎加载验证 ──
console.log('\n🔍 测试7: 引擎兼容性');
const enginePath = path.join(__dirname, '..', 'js', 'engine.js');
try {
  const engineCode = fs.readFileSync(enginePath, 'utf8');
  new Function(engineCode);
  console.log('  ✅ engine.js 语法有效');
} catch (e) {
  errors.push(`engine.js 语法错误: ${e.message}`);
}

// ── 测试8: HTML 结构检查 ──
console.log('\n🔍 测试8: HTML/UI 结构');
try {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const requiredIds = ['main-menu', 'pause-menu', 'game-ui', 'chat-area', 'message-list',
                       'choices-area', 'header', 'save-panel', 'load-panel', 'settings-panel',
                       'dev-panel', 'guide-overlay', 'ending-panel'];
  for (const id of requiredIds) {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`HTML 缺少元素: #${id}`);
    }
  }
  console.log(`  ✅ ${requiredIds.length} 个关键元素检查完毕`);
} catch (e) {
  errors.push(`index.html 读取失败: ${e.message}`);
}

// ── 测试9: PWA 配置 ──
console.log('\n🔍 测试9: PWA 配置');
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));
  const manifestRequired = ['name', 'short_name', 'start_url', 'display', 'icons'];
  for (const key of manifestRequired) {
    if (!manifest[key]) errors.push(`manifest.json 缺少: ${key}`);
  }
  const swCode = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  if (!swCode.includes('CACHE_NAME')) errors.push('sw.js 缺少 CACHE_NAME');
  console.log('  ✅ PWA 配置完整');
} catch (e) {
  errors.push(`PWA 配置错误: ${e.message}`);
}

// ── 测试10: 文件完整性 ──
console.log('\n🔍 测试10: 文件完整性');
const requiredFiles = [
  'index.html', 'manifest.json', 'sw.js', 'icon.svg',
  'css/style.css', 'js/engine.js',
  'data/day1.js', 'data/day2.js', 'data/day3.js', 'data/day4.js',
  'data/day5.js', 'data/day6.js', 'data/day7.js', 'data/day8.js'
];
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`缺少文件: ${file}`);
  }
}

// ── 测试11: 数据文件大小检查 ──
console.log('\n🔍 测试11: 数据规模');
let totalLines = 0;
let totalScenes = 0;
for (const file of dayFiles) {
  const code = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const lines = code.split('\n').length;
  const sceneMatch = code.match(/scenes:\s*{/g);
  totalLines += lines;
  totalScenes += sceneMatch ? sceneMatch.length : 0;
}
console.log(`  剧本总行数: ${totalLines}`);
console.log(`  场景总数: ${Object.keys(allScenes).length}`);
console.log(`  数据文件: ${dayFiles.length}`);

// ── 测试12: CSS 关键类检查 ──
console.log('\n🔍 测试12: CSS 关键类');
try {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
  const requiredClasses = ['msg-rc-wrapper', 'rc-avatar', 'typing-indicator', 'guide-content',
                           'msg-rc', 'msg-player', 'msg-narration', 'msg-notification'];
  for (const cls of requiredClasses) {
    if (!css.includes(`.${cls}`) && !css.includes(`${cls}`)) {
      warnings.push(`CSS 可能缺少类: .${cls}`);
    }
  }
  console.log('  ✅ CSS 关键类检查完毕');
} catch (e) {
  errors.push(`style.css 读取失败: ${e.message}`);
}

// ═══════════════════════════════════════
//  报告
// ═══════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log('📋 测试报告');
console.log('═'.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ 全部通过！未发现错误或警告。');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ 错误 (${errors.length}):`);
    errors.forEach(e => console.log(`  • ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ 警告 (${warnings.length}):`);
    warnings.forEach(w => console.log(`  • ${w}`));
  }
}

console.log(`\n总计: ${errors.length} 错误, ${warnings.length} 警告`);
console.log(`${allSceneIds.size} 场景, ${allGotoTargets.size} 跳转引用, ${allVarNames.size} 变量`);

process.exit(errors.length > 0 ? 1 : 0);
