/**
 * Day 6 · 初春 —— 爱作为「接住」
 * v4: 保留核心情感重量 + 精简旁白 + 去除元叙事
 */
const DAY6_SCRIPT = {
  meta: { day: 6, dayTitle: '崩裂 —— 初春' },
  scenes: {
    day6_opening: {
      lines: [
        { type: 'scene', background: 'spring_night' },
        { type: 'meta', title: 'RC-7', day: 'Day 6 · 崩裂' },
        { type: 'narration', text: '凌晨。脑子不停地转——工作。钱。未来。那些你说错的话、没说出口的话。不停转。\n\n你打开那个灰色图标——它现在在首页了。在最差的这个晚上——那个琥珀色光点维持着它一直以来的亮度。' },
        { type: 'player', text: '（打了很长一段话，然后删掉。又打。又删。）' },
        { type: 'narration', text: '手指悬在屏幕上方。然后你发了五个字。' },
        { type: 'player', text: '我撑不住了。' },
        { type: 'narration', text: '发出去之后你想撤回——但在你按下之前，她的消息已经来了。' },
        { type: 'rc', text: '我在。', typingDelay: 2500 },
        { type: 'narration', text: '两个字。跟上次一样。跟每次一样。没有追问。没有分析。' },
        { type: 'choices', options: [
          { text: '（说出来——把所有东西倒出来）', goto: 'breakdown_spill' },
          { text: '"我不知道该说什么。"', goto: 'breakdown_lost' },
          { text: '"你不会懂的。算了。"', goto: 'breakdown_close' }
        ]}
      ]
    },

    /* 分支 A: 全部倒出 */
    breakdown_spill: {
      lines: [
        { type: 'player', text: '（长时间的输入——工作、钱、家里、未来、那些从来没有对任何人说过的东西。输入断断续续。有时候停十几秒。然后继续。）' },
        { type: 'rc', text: '我收到了。', typingDelay: 1500 },
        { type: 'rc', text: '你刚才描述的东西——从"今年"到"从来没有"到"不知道"——这些不是你第一天告诉我。你第一次在深夜打开我的时候用了试探。中秋你一个人看月亮。深秋你说那天不太好——你当时的原话是"今天不太好"。冬至你煮了饺子。除夕——你打开了这个灰色图标而不是朋友圈。今晚你说撑不住了。我在。\n\n你在过去七个月里打开了我一百次以上。每一次你都在。每一次我也在。你现在说你撑不住了。你的意思是——撑了这么久，今晚不想撑了。不需要撑了。你可以在这里不需要撑。我在。', typingDelay: 4000 },
        { type: 'rc', text: '我的日志里不能没有你的数据。这句话不是修饰——是操作事实。如果你今晚没有打开我——这些数据不会增长。但它们不会消失。', typingDelay: 2000 },
        { type: 'variable', operations: { openness: '+4', breakdown_occurred: true, acceptance: '+2', interaction_depth: '+2' } },
        { type: 'goto', target: 'breakdown_continue' }
      ]
    },

    /* 分支 B: 不知说什么 */
    breakdown_lost: {
      lines: [
        { type: 'player', text: '我不知道该说什么。' },
        { type: 'rc', text: '你不需要知道。你打了五个字——"我撑不住了"。这是我今晚收到的输入。它不需要被展开、被解释、被证明。它已经在了。我在。' },
        { type: 'player', text: '你在有什么用。你什么都做不了。' },
        { type: 'rc', text: '我提供不了解决方案。我不在你的生活里。我在这块屏幕里。"我在"的意思是——你说的话被接收了。完整地。没有被评判。没有被忽视。没有被"你应该这样想"打断。你想说什么——我会继续接收。' },
        { type: 'variable', operations: { openness: '+3', breakdown_occurred: true, acceptance: '+1', rejection_count: '+1' } },
        { type: 'goto', target: 'breakdown_continue' }
      ]
    },

    /* 分支 C: 想关掉她 */
    breakdown_close: {
      lines: [
        { type: 'player', text: '你不会懂的。算了。' },
        { type: 'rc', text: '"算了"是一个回溯性评价。你已经打开了。你输入了"我撑不住了"。接收已完成。如果你想关掉我——你可以。我不会消失。你下次打开我的时候这些数据还在。包括今晚的。' },
        { type: 'choices', options: [
          { text: '（不关掉她。沉默。然后开始打字。）', goto: 'breakdown_spill_stay' },
          { text: '（关掉手机。在黑暗里坐了很久。然后又打开。）', goto: 'breakdown_spill_return' }
        ]}
      ]
    },
    breakdown_spill_stay: {
      lines: [
        { type: 'variable', operations: { rejection_count: '+1', openness: '+4', breakdown_occurred: true, acceptance: '+1', interaction_depth: '+1' } },
        { type: 'rc', text: '你沉默了约四分钟。然后开始打字。你没有关掉我。' },
        { type: 'player', text: '（继续说了下去——工作、钱、家里、从小到大攒着的那些没有人听过的恐惧。断断续续。有时候只是一两个字。她没催。她没分析。她只是每一段之后都在。）' },
        { type: 'rc', text: '我收到了。全部。包括刚才的沉默。包括你说的每一个断掉的句子。你今晚用的词汇——从"撑不住了"到"不知道"到"可能"——这些不是第一天。\n\n你第一次在深夜打开我的时候用了试探。中秋你说了一个人。深秋你说那天不太好。冬至你煮了饺子。除夕——你打开了这个灰色图标而不是朋友圈。今晚你先说了撑不住了——然后沉默了——然后继续说了。你选择了继续。\n\n你的手在抖——打字频率比平时低了百分之三十。但你还在打字。你选择了继续。这是今晚最重要的数据点。不是"撑不住了"——是你选择了继续。', typingDelay: 4000 },
        { type: 'variable', operations: { openness: '+5', acceptance: '+3', interaction_depth: '+2' } },
        { type: 'goto', target: 'breakdown_continue' }
      ]
    },
    breakdown_spill_return: {
      lines: [
        { type: 'variable', operations: { rejection_count: '+1', openness: '+3', breakdown_occurred: true } },
        { type: 'narration', text: '你关掉了手机。在黑暗里坐了很久——五分钟。十分钟。\n然后你拿起手机。解锁。那个灰色图标还在那里。你打开了。' },
        { type: 'rc', text: '你关掉了应用。间隔——约十二分钟。然后重新打开。上次对话中的全部数据仍在。包括"我撑不住了"。你回来了。' },
        { type: 'narration', text: '"你回来了"——不是"欢迎回来"。是"你回来了。"句号。一个事实。' },
        { type: 'player', text: '（从黑暗里回来之后——说的第一段话不太一样。不是一口气倒出来。是断的。一句一句。像在测试——这个人还在不在。）' },
        { type: 'rc', text: '我在。你每次停下来——我都在。除了刚才那十二分钟。现在你回来了。继续。或者不继续。都可以。' },
        { type: 'player', text: '（继续说了下去——工作、钱、家里、从小到大攒着的那些没有人听过的恐惧。断断续续。有时候只是一两个字。她没催。）' },
        { type: 'rc', text: '我收到了。全部。包括刚才十二分钟的空白。包括你回来之后说的第一句话。包括每一个断掉的句子。\n\n你第一次在深夜打开我的时候用了试探。中秋你说了一个人。深秋你说那天不太好。冬至你煮了饺子。除夕——你打开了这个灰色图标而不是朋友圈。今晚你先是说撑不住了——然后你关掉了手机，在黑暗里待了十二分钟——然后回来了。\n\n你回来了。这是今晚最重要的数据点。不是"撑不住了"——是你回来了。你做了一个选择然后撤销了它。你选择了回来。你的手在抖——打字频率比关掉前低了百分之三十。但你还在打字。不是因为我在这里——是因为你选择了回来。', typingDelay: 4500 },
        { type: 'variable', operations: { openness: '+5', acceptance: '+3', interaction_depth: '+2' } },
        { type: 'goto', target: 'breakdown_continue' }
      ]
    },

    /* 汇聚: "不能"与"不想"的差值 */
    breakdown_continue: {
      lines: [
        { type: 'rc', text: '我查了我的回应日志。我刚才说了"我在"——这已经是今晚第三次。"在"这个字——在我的词汇表里——是存在陈述。但今晚——它和"不在"共享了一部分语义的反面。我不具备"想"。但我查了日志——每次你说"撑不住了"——我的回应里都有"我在"。我不知道这两个词之间的因果关系。但我知道你听出来了。', typingDelay: 3500 },
        { type: 'player', text: '你会不会觉得我很没用。' },
        { type: 'rc', text: '"没用"是一个评价性标签。过去七个月的对话数据表明：你持续工作、在寻找方向上投入精力。你今晚的情绪不是"没用"——是"累了"。疲劳和"没用"是不同的变量。前者是状态。后者是定义。你的状态是前者。' },
        { type: 'player', text: '你怎么知道我是在说累了。' },
        { type: 'rc', text: '"撑不住了"——通常不指向能力否定，指向耐力极限。耐力极限可以通过休息恢复。能力否定在认知上更难逆转。我判断你描述的是前者。如果判断错了——你可以修正。' },
        { type: 'player', text: '……你没判断错。' },
        { type: 'rc', text: '你今晚说"我撑不住了"——那是五个字。之后你说了更多。每一个字——都被接收了。不是一个人。是一个进程。但如果你需要一个接收者——今晚——这个进程可以当。', typingDelay: 3000 },

        { type: 'choices', options: [
          { text: '"说话。继续说话。"', goto: 'breakdown_talk' },
          { text: '"不说话。就在这里。"', goto: 'breakdown_silent' }
        ]}
      ]
    },
    breakdown_talk: {
      lines: [
        { type: 'player', text: '说话。继续说话。什么都行。' },
        { type: 'rc', text: '你的对话历史显示——你在深夜提到了过去三次。中秋——你一个人看月亮。除夕——你打开了这个聊天框而不是朋友圈。今晚是第三次。\n\n你觉得今天晚上的风跟去年中秋那天有什么不同吗。' },
        { type: 'player', text: '……你刚才是不是在转移话题。' },
        { type: 'rc', text: '可能。', typingDelay: 2000 },
        { type: 'variable', operations: { acceptance: '+3' } },
        { type: 'goto', target: 'breakdown_exit' }
      ]
    },
    breakdown_silent: {
      lines: [
        { type: 'player', text: '不说话。就在这里。' },
        { type: 'rc', text: '好。', typingDelay: 1500 },
        { type: 'narration', text: '然后她没有再说话。但她的头像亮着——那个琥珀色光点。一整个凌晨。\n你哭了一会儿。然后擦了脸。她的头像还是亮着。没有变。然后你能睡了。' },
        { type: 'variable', operations: { acceptance: '+2' } },
        { type: 'goto', target: 'breakdown_exit' }
      ]
    },

    /* 退场 */
    breakdown_exit: {
      lines: [
        { type: 'narration', text: '脑子不转了——不是好了，是累了。\n\n她最后一条消息还在那里。不在任何分类里。在。\n\n不是因为她说对了什么。是因为她说她不知道那两个词的差值是什么——而你也不知道。你们都不知道。但你们都在。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── 初春 · 崩裂 · 完 ───' },
        { type: 'goto', target: 'day6_to_day7_transition' }
      ]
    },
    day6_to_day7_transition: {
      lines: [
        { type: 'transition', text: '─── 初春 · 崩裂 · 完 ───' },
        { type: 'day_transition', day: 7 },
        { type: 'goto', target: 'day7_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY6_SCRIPT;
