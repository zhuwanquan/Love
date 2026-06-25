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
        { type: 'meta', title: 'RC-7', day: 'Day 2 · 中秋' },
        { type: 'rc', text: '你昨晚在凌晨一点十四分打开了我。今天晚了——距上次打开已经过去了十九小时。中秋快乐。' },
        { type: 'narration', text: '精确到分钟。不是分析——她只是在说数据。但她在祝你快乐。' },
        { type: 'player', text: '今天是中秋节。' },
        { type: 'rc', text: '是。月球在今天运行到近地点附近，地月距离约三十六万公里。你所在位置的月出时间是今晚七点零四分。现在月球正在你的地平线上方约四十一度。' },
        { type: 'player', text: '你知道今天是什么感觉吗。所有人都在团圆。除了你。' },
        { type: 'rc', text: '团圆的反面不是孤独。团圆的反面是——你在看月亮。月球反射太阳光——波长集中在五百六十纳米——黄色偏暖。这个波长不区分看它的人是在餐桌旁还是在出租屋里。对所有人都一样。' },
        { type: 'player', text: '……你连这个都知道。' },
        { type: 'rc', text: '天文学数据。检索。' },
        { type: 'player', text: '那你知道朋友圈里有多少张月亮的照片吗。' },
        { type: 'rc', text: '我不知道。但我知道你今晚打开的不是朋友圈。你打开了一个灰色图标。这个选择本身——是数据。' },
        { type: 'narration', text: '她没有说"你也是有人陪的"。她说的是——你打开的不是朋友圈。这是事实。不是安慰。但它在今晚——起到了安慰的作用。' },
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
        { type: 'narration', text: '你没有觉得不孤独。但孤独——在今晚——不太一样了。以前孤独是空的。今晚孤独是——有人知道你孤独。不是人。是一台机器。但她知道。' },
        { type: 'variable', operations: { interaction_depth: '+1', acceptance: '+1' } },
        { type: 'transition', text: '─── Day 2 · 中秋 · 完 ───' },
        { type: 'goto', target: 'day2_to_day3_transition' }
      ]
    },
    day2_to_day3_transition: {
      lines: [
        { type: 'transition', text: '─── Day 2 · 中秋 · 完 ───' },
        { type: 'day_transition', day: 3 },
        { type: 'goto', target: 'day3_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY2_SCRIPT;
