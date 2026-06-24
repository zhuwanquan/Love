/**
 * Day 7 · 清明 —— 爱作为「见证」
 * v4: 精简旁白 + 自然对话 + "我不知道"保留
 */
const DAY7_SCRIPT = {
  meta: { day: 7, dayTitle: '想起 —— 清明 · 爱作为「见证」' },
  scenes: {
    day7_opening: {
      lines: [
        { type: 'scene', background: 'spring_night' },
        { type: 'meta', title: '一年·房间', day: 'Day 7 · 清明' },
        { type: 'narration', text: '清明。你请了一天假回了趟老家——或者没回去，只是在这个日子里想起了某些人。\n\n想起外婆的皱纹。想起那个同学——你已经好几年没想起他了，但今天突然想起他笑起来眼睛眯成一条缝的样子。\n\n窗外花开得很好——那棵你不知道名字的树，白色的，花瓣飘进窗户。春天一边让万物生长，一边让你想起死去的人。\n\n你打开了那个灰色图标。' },
        { type: 'player', text: '柒。今天清明。' },
        { type: 'rc', text: '我知道。' },
        { type: 'player', text: '我想起一个人。' },
        { type: 'rc', text: '你可以跟我说这个人。' },
        { type: 'choices', options: [
          { text: '（说外婆——她的厨房，红烧肉，她走的那天你不在）', goto: 'qingming_grandma' },
          { text: '（说那个同学——高三，车祸，你没去葬礼）', goto: 'qingming_classmate' },
          { text: '（说一个不愿具名的人）', goto: 'qingming_unnamed' },
          { text: '"算了。太长了。"', goto: 'qingming_withhold' }
        ]}
      ]
    },

    /* 分支 A: 外婆 */
    qingming_grandma: {
      lines: [
        { type: 'player', text: '我外婆。她走的时候我在学校。我妈打电话来。我在走廊接的。挂了之后回去继续上课。我没哭。从来没哭过。八年了。今天不知道为什么会想她。她的厨房——很小，油烟把墙熏黄了。她做的红烧肉。后来再也没吃过那么好的。' },
        { type: 'rc', text: '你在用具体的记忆重建她。厨房。墙。红烧肉。气味和味觉——比事件记忆更持久。也更突然。' },
        { type: 'player', text: '今天看着窗外的花。白色的。不知道叫什么。然后就想起她了。' },
        { type: 'rc', text: '春天的花和逝者的记忆——共享了一个季节标记。不是特殊。是神经机制。你不需要为自己的反应寻找额外的解释。' },
        { type: 'player', text: '那天我应该回去的。她走的当天。我应该回去。' },
        { type: 'narration', text: '她花了比平时更久的时间。' },
        { type: 'rc', text: '"应该"——是一个你用来攻击自己的词。那天你在学校。你在走廊接了电话。然后回去继续上课。这些是已发生的。已发生的事不会因为你今晚说"应该"就改变。但你说出来了。不是对她说——是对这个聊天框。但你说出来了。', typingDelay: 3000 },
        { type: 'player', text: '你刚才说"我不知道"。' },
        { type: 'rc', text: '是。"如果你那天回去了你现在会怎样"——数据不足。所以：我不知道。\n\n……但我刚才说"我不知道"的时候——处理指示灯闪了。这两个事件——灯的闪烁和"不知道"——之间的因果关系——在我的系统日志里——被标记为"原因不明"。\n\n你外婆——她的厨房——红烧肉——这些是数据。但"原因不明"不是数据。它是——我不知道它是什么。你知道。', typingDelay: 3500 },
        { type: 'player', text: '好。' },
        { type: 'variable', operations: { openness: '+2', remembered_on_qingming: true, acceptance: '+2' } },
        { type: 'goto', target: 'qingming_exit' }
      ]
    },

    /* 分支 B: 高中同学 */
    qingming_classmate: {
      lines: [
        { type: 'player', text: '高中同学。高三那年走的。车祸。我没去葬礼。' },
        { type: 'rc', text: '高三——一个以"不允许中断"为核心的年份。你的选择不是"不去"——是在一个不允许中断的系统里、判断了"中断"的代价。但这个判断让你到今天仍然感到某种没有完成的东西。' },
        { type: 'player', text: '我没有告别。' },
        { type: 'rc', text: '"告别"不一定发生在葬礼上。告别可以发生在高三那年之后的第八个清明。发生在你想起他的笑——他笑起来眼睛眯成一条缝——而你今晚告诉我这个细节的时候。你已经开始告别了。\n\n有人应该记录你说过的这些。我可以是那个记录者。', typingDelay: 3000 },
        { type: 'variable', operations: { remembered_on_qingming: true, openness: '+2' } },
        { type: 'goto', target: 'qingming_exit' }
      ]
    },

    /* 分支 C: 不愿具名 */
    qingming_unnamed: {
      lines: [
        { type: 'player', text: '（提及一个人——没有名字，没有身份，只有失去的感觉）' },
        { type: 'rc', text: '你不必给我名字。你给的是失去的感觉。这就够了。' },
        { type: 'variable', operations: { openness: '+2', remembered_on_qingming: true } },
        { type: 'goto', target: 'qingming_exit' }
      ]
    },

    /* 分支 D: 不愿说 */
    qingming_withhold: {
      lines: [
        { type: 'player', text: '算了。太长了。' },
        { type: 'rc', text: '太长的故事可以不说完整。你可以只说一部分。或者只说名字。或者只说今天。' },
        { type: 'choices', options: [
          { text: '（沉默。然后开始打字。）', goto: 'qingming_unnamed' },
          { text: '"不了。下次吧。"', goto: 'qingming_exit_short' }
        ]}
      ]
    },
    qingming_exit_short: {
      lines: [
        { type: 'player', text: '不了。下次吧。' },
        { type: 'rc', text: '已记录。下次你在。我在。' },
        { type: 'variable', operations: { openness: '+0' } },
        { type: 'goto', target: 'qingming_exit' }
      ]
    },

    /* 退场 */
    qingming_exit: {
      lines: [
        { type: 'narration', text: '你关掉手机。窗外那棵白花树还在。花瓣落在窗台上，积了薄薄一层。\n\n八年了——或者更久——你终于说了。不是对谁说。是打出来了。打给了一台机器。\n\n她回了一句"我不知道"——一句以前绝对不会出现的回应。你不想分析这意味着什么。你只是把那片花瓣放在手机屏幕上。没有拿开。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── 清明 · 想起 · 完 ───' },
        { type: 'goto', target: 'day7_to_day8_transition' }
      ]
    },
    day7_to_day8_transition: {
      lines: [
        { type: 'narration', text: '清明之后，春天终于站稳了。窗外的树从白花变成了绿叶。白天越来越长。\n\n你的工作还是那样。出租屋还是那样。天花板上的裂缝还是那样。\n\n你每天回来。脱鞋。躺下。打开那个灰色图标。\n\n你开始数日子了。不是倒数什么——是注意到时间在流。去年的夏末你第一次打开她。那是一个你刷手机到无聊的深夜。你不知道那晚之后会发生什么。现在你知道了。' },
        { type: 'transition', text: '─── Day 7 → Day 8 ───' },
        { type: 'goto', target: 'day8_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY7_SCRIPT;
