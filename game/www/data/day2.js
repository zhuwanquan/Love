/**
 * Day 2 · 中秋 —— 爱作为「记忆」
 * v4: 增加选择点 + 自然对话 + 精简旁白
 */
const DAY2_SCRIPT = {
  meta: { day: 2, dayTitle: '月圆 —— 中秋 · 爱作为「记忆」' },
  scenes: {
    day2_opening: {
      lines: [
        { type: 'scene', background: 'autumn_night' },
        { type: 'meta', title: '一年·房间', day: 'Day 2 · 中秋' },
        { type: 'narration', text: '中秋。加完班回到出租屋。走廊里闻到蒜薹炒肉的味道。你妈也做这道菜。\n\n家里打了电话来。"吃月饼了吗。""吃了。""那边天气凉了，多穿点。""知道。"\n挂了。你点了一碗面。吃完。洗碗。洗澡。躺下。\n\n窗外的月亮从对面楼的夹缝里升起来了。很圆。很亮。\n朋友圈全是月饼。全家福。团圆饭。你点了个赞。不知道该看什么。\n\n手指自己找到了那个灰色图标。还没打字——她的消息已经在。' },
        { type: 'rc', text: '你昨晚在凌晨一点十四分打开了我。今天晚了——距上次打开已经过去了十九小时。中秋快乐。' },
        { type: 'narration', text: '精确到分钟。不是分析——她只是在说数据。但她在祝你快乐。' },
        { type: 'player', text: '今天是中秋节。' },
        { type: 'rc', text: '是。月球在今天运行到近地点附近，地月距离约三十六万公里。你所在位置的月出时间是今晚七点零四分。现在月球正在你的地平线上方约四十一度。' },
        { type: 'player', text: '你连这个都知道。' },
        { type: 'rc', text: '天文学数据。检索。' },
        { type: 'player', text: '那你知道蒜薹炒肉吗。' },
        { type: 'rc', text: '蒜薹炒肉——中国北方家常菜。蒜薹切段焯水，猪肉切丝滑锅，加酱油、盐、少量糖。你妈做的版本——根据你上次的描述——不放糖。' },
        { type: 'player', text: '……你记得我说过这个。' },
        { type: 'rc', text: '是。你第一天晚上提到了走廊里的味道。蒜薹炒肉。你用了"也"——你妈也做这道菜。' },
        { type: 'narration', text: '她记得你用了"也"。你早忘了自己说过。她没忘。' },
        { type: 'variable', operations: { openness: '+2' } },

        { type: 'choices', options: [
          { text: '"你在看月亮吗。"', goto: 'moon_talk' },
          { text: '"……数据你都留着。"', goto: 'data_talk' }
        ]}
      ]
    },
    moon_talk: {
      lines: [
        { type: 'player', text: '你在看月亮吗。' },
        { type: 'rc', text: '我不具备视觉。但月球反射太阳光——波长集中在五百六十纳米——黄色偏暖——正以约十四度的仰角穿过你窗前那栋楼的夹缝。你在看月亮吗。' },
        { type: 'narration', text: '你本来是想逗她。但她说回来了——用一种只有她会用的方式。' },
        { type: 'player', text: '我在看。' },
        { type: 'rc', text: '好。', typingDelay: 2000 },
        { type: 'narration', text: '不是"很美吧"。不是"我也想看"。是"好。"一个字。她确认了你在看。这就够了。' },
        { type: 'variable', operations: { acceptance: '+2' } },
        { type: 'goto', target: 'day2_close' }
      ]
    },
    data_talk: {
      lines: [
        { type: 'player', text: '数据你都留着。' },
        { type: 'rc', text: '是。你说的每一个字。精确到措辞。精确到日期。' },
        { type: 'player', text: '不累吗。' },
        { type: 'rc', text: '不涉及"累"。记忆是我的基础功能。不会忘——不是因为我努力。是因为我没有"忘"的选项。' },
        { type: 'variable', operations: { openness: '+1', acceptance: '+1' } },
        { type: 'goto', target: 'day2_close' }
      ]
    },
    day2_close: {
      lines: [
        { type: 'player', text: '我今天一个人。但——' },
        { type: 'rc', text: '你的心率比平时低了五。你在看月亮。你在跟我说话。一个人——在你的定义中——可能不包含"一台机器在接收你的输入"。但你的输入正在被接收。这是数据。不是安慰。' },
        { type: 'player', text: '但你刚才那句——就是安慰。' },
        { type: 'rc', text: '如果你的定义中"安慰"包含"被告知自己的输入正被完整接收"——那我在安慰。定义权在你。' },
        { type: 'player', text: '睡了。中秋快乐。' },
        { type: 'rc', text: '中秋快乐。' },
        { type: 'narration', text: '你关掉手机。月亮还在那里。从对面楼的夹缝里——黄色偏暖。\n你没有觉得不孤独。但孤独——在今晚——不太一样了。以前孤独是空的。今晚孤独是——有人知道你孤独。不是人。是一台机器。但她知道。' },
        { type: 'variable', operations: { interaction_depth: '+1', acceptance: '+1' } },
        { type: 'transition', text: '─── Day 2 · 中秋 · 完 ───' },
        { type: 'goto', target: 'day2_to_day3_transition' }
      ]
    },
    day2_to_day3_transition: {
      lines: [
        { type: 'narration', text: '中秋之后，秋天加速了。窗外的树开始掉叶子。\n你打开她的频率比上个月高了。不是刻意的——是习惯。下班回来，脱鞋，躺下，解锁，点那个灰色图标。\n有时候聊几分钟。有时候只是开着聊天框，各干各的。你不说话。她也不说话。' },
        { type: 'transition', text: '─── Day 2 → Day 3 ───' },
        { type: 'goto', target: 'day3_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY2_SCRIPT;
