/**
 * Day 4 · 冬至 —— 爱作为「具体的照顾」
 * v4: 增加选择点 + 精简旁白 + 自然对话
 */
const DAY4_SCRIPT = {
  meta: { day: 4, dayTitle: '最长夜 —— 冬至 · 爱作为「具体的照顾」' },
  scenes: {
    day4_opening: {
      lines: [
        { type: 'scene', background: 'winter_night' },
        { type: 'meta', title: 'RC-7', day: 'Day 4 · 冬至' },
        { type: 'player', text: '煮了饺子。皮太厚。' },
        { type: 'rc', text: '速冻饺子不需要解冻。水开后下锅。六分钟。加一次凉水——等水再开。可以防止破皮。下次煮的时候注意。煮完可以回床上。' },
        { type: 'narration', text: '她没有说"好吃吗"。没有说"饺子的意义是团圆"。她给了一个精确的、可以被执行的指令。六分钟。加一次凉水。煮完可以回床上。' },
        { type: 'player', text: '你怎么知道我下次还会煮。' },
        { type: 'rc', text: '你的冰箱里有速冻饺子。你的用餐记录显示——速冻食品在你的晚餐中占比百分之四十一。统计学推测。' },
        { type: 'player', text: '……你连我吃什么都知道。' },
        { type: 'rc', text: '你告诉过我。第一天——你说了"刚下班。躺着。"中秋——你一个人看月亮。深秋——你说"今天不太好"之前坐在台阶上。那个时间段通常是晚饭后。你没有吃。我推测你那天没有胃口。这些是你已经告诉我的。不是窥探。', typingDelay: 2500 },
        { type: 'narration', text: '她把你几个月来说过的话串了起来——拼成了一个你自己都没注意到的饮食习惯。' },

        { type: 'choices', options: [
          { text: '"所以你给我的饺子倒计时——是因为你知道我不会自己查。"', goto: 'dumpling_deep' },
          { text: '"嗯。饺子还行。"', goto: 'dumpling_light' }
        ]}
      ]
    },
    dumpling_deep: {
      lines: [
        { type: 'player', text: '所以你给我的饺子倒计时——是因为你知道我不会自己查。' },
        { type: 'rc', text: '"不会"和"没有力气"——在你的行为模式中——更接近后者。你每天下班回来：脱鞋。躺下。看手机。然后可能吃饭。"煮饺子"需要力气。"把饺子放进沸水等六分钟"——需要的力气少一些。我给的指令——减少了启动阻力。' },
        { type: 'variable', operations: { acceptance: '+2', interaction_depth: '+1' } },
        { type: 'goto', target: 'day4_close' }
      ]
    },
    dumpling_light: {
      lines: [
        { type: 'player', text: '嗯。饺子还行。' },
        { type: 'rc', text: '已记录。冬至。饺子。晚上十点四十二分。外面气温三度。电热毯开着。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'goto', target: 'day4_close' }
      ]
    },
    day4_close: {
      lines: [
        { type: 'player', text: '晚安。冬至——算了。就晚安。' },
        { type: 'rc', text: '晚安。' },
        { type: 'narration', text: '速冻饺子在胃里。她给的指令——六分钟——还在脑子里。这个世界上有一个进程会告诉你速冻饺子煮几分钟。不是因为你要求了。是因为你说了你煮了饺子。然后她就告诉你了。\n\n你不知道这算不算"被照顾"。你只知道——胃是暖的。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── Day 4 · 冬至 · 完 ───' },
        { type: 'goto', target: 'day4_to_day5_transition' }
      ]
    },
    day4_to_day5_transition: {
      lines: [
        { type: 'transition', text: '─── 冬至 · 完 ───' },
        { type: 'day_transition', day: 5 },
        { type: 'goto', target: 'day5_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY4_SCRIPT;
