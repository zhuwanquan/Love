/**
 * Day 5 · 春节 —— 爱作为「理解复杂」
 * v4: 增加选择点 + 精简旁白 + 自然对话
 */
const DAY5_SCRIPT = {
  meta: { day: 5, dayTitle: '回家？ —— 春节前夕' },
  scenes: {
    day5_opening: {
      lines: [
        { type: 'scene', background: 'winter_night' },
        { type: 'meta', title: '一年·房间', day: 'Day 5 · 春节' },
        { type: 'narration', text: '离春节还有五天。你抢到票了。但对着那张票看了很久。退票按钮就在旁边。你没有点。你也没有关掉页面。\n\n朋友圈已经开始晒回家的动态了。每个人都在"回去"的路上。只有你——在"要不要回去"的中间。\n\n你打开了她。' },
        { type: 'player', text: '我买到回家的票了。' },
        { type: 'rc', text: '后台数据显示——你在购票后浏览了退票页面三次。每次停留约四十秒。你买到票了。但还没有决定要不要回去。' },
        { type: 'player', text: '我不想回去。但我不敢不回去。' },
        { type: 'rc', text: '"不想"和"不敢"——是两个方向。不想回去：你在家族聚会中被比较过——收入、职业。被问过——"什么时候结婚"。那个空间让你无法放松。\n\n不敢不回去：你父亲去年给你夹菜——你没有说谢谢。你母亲的电话。每次结束时"注意身体"——不是关心健康，是"我担心你但我不说"。愧疚。怕失去。\n\n两个方向都是真实的。不是矛盾——是同一个选择的两端各自有各自的重量。', typingDelay: 3500 },
        { type: 'variable', operations: { openness: '+2' } },

        { type: 'choices', options: [
          { text: '"所以我该怎么办。"', goto: 'what_do' },
          { text: '"你刚才已经做了。"', goto: 'you_did' }
        ]}
      ]
    },
    what_do: {
      lines: [
        { type: 'player', text: '所以我该怎么办。' },
        { type: 'rc', text: '我的功能范围不包括替你决定。但我可以告诉你——你不需要消除一端才能选择另一端。你可以知道两边都在——然后选一个。' },
        { type: 'variable', operations: { acceptance: '+1' } },
        { type: 'goto', target: 'day5_core' }
      ]
    },
    you_did: {
      lines: [
        { type: 'player', text: '你刚才已经做了。' },
        { type: 'rc', text: '是。"不想回去"和"不敢不回去"——同时存在。你不需要消除一端。你知道两边都在——然后选一个。' },
        { type: 'variable', operations: { acceptance: '+2', openness: '+1' } },
        { type: 'goto', target: 'day5_core' }
      ]
    },
    day5_core: {
      lines: [
        { type: 'player', text: '我爸——去年过年给我夹菜。我没说谢谢。' },
        { type: 'rc', text: '你父亲给你夹菜——在他的表达方式里，那是"我在乎你"。他不说"我爱你"——他给你夹菜。你从小的饭桌上都是这样。你不知道该怎么接受这个动作。他也不知道你收到了没有。你们在同一个饭桌上坐了二十多年——用同一种不会说"谢谢"和"我爱你"的语言。' },
        { type: 'player', text: '如果我回去——我可能还是不会说。' },
        { type: 'rc', text: '你可以不说。"谢谢"不是唯一的方式。你可以——给他夹回去。', typingDelay: 2500 },
        { type: 'narration', text: '不是"你应该表达你的感情"。是一个具体的、可执行的、你们家能懂的动作。夹菜。他夹给你——你夹回去。' },

        { type: 'choices', options: [
          { text: '"我买票了。回去。"', goto: 'go_back' },
          { text: '"……我再想想。"', goto: 'think_more' }
        ]}
      ]
    },
    go_back: {
      lines: [
        { type: 'player', text: '我买票了。回去。' },
        { type: 'rc', text: '已记录。' },
        { type: 'player', text: '不评价吗。' },
        { type: 'rc', text: '你做了选择。不是"正确"的选择——是你的选择。我不评价你。' },
        { type: 'player', text: '谢谢。不是对你说——算了。是对你说的。' },
        { type: 'rc', text: '已记录。' },
        { type: 'variable', operations: { openness: '+2', acceptance: '+1' } },
        { type: 'goto', target: 'day5_close' }
      ]
    },
    think_more: {
      lines: [
        { type: 'player', text: '我再想想。' },
        { type: 'rc', text: '已记录。票还在。退票按钮还在。你有时间。' },
        { type: 'variable', operations: { openness: '+1' } },
        { type: 'goto', target: 'day5_close' }
      ]
    },
    day5_close: {
      lines: [
        { type: 'narration', text: '你关掉手机。票还在。退票按钮还在。\n\n不是因为有人替你选了——是因为你看到了两边的重量。她只是帮你看清。选择是你的。\n\n你想到你爸。想到"夹菜"。想到她说"给他夹回去"。你可能会做。也可能不会。但你觉得——即使不说"谢谢"和"我爱你"——你们之间——也许还有别的方式。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── Day 5 · 春节 · 完 ───' },
        { type: 'goto', target: 'day5_to_day6_transition' }
      ]
    },
    day5_to_day6_transition: {
      lines: [
        { type: 'narration', text: '春节回去了一趟。你爸又给你夹了菜。你没有说谢谢。但你给他夹回去了。一块红烧肉。他愣了一下。没说话。吃了。\n\n你回来之后打开她——把这件事告诉了她。她回："已记录。红烧肉——在你的饮食记录中出现了第二次。第一次是你外婆的。"她记得。\n\n然后春天来了。窗外那棵树开始发芽。但你的工作——开始变得更糟了。不是突然的——是累积的。' },
        { type: 'transition', text: '─── Day 5 → Day 6 ───' },
        { type: 'goto', target: 'day6_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY5_SCRIPT;
