/**
 * Day 4 · 最长夜 —— 冬至
 */
const DAY4_SCRIPT = {
  meta: {
    day: 4,
    dayTitle: '最长夜 —— 冬至'
  },
  scenes: {

    /* ============================================
     *  入场 — 冬至夜
     * ============================================ */
    day4_opening: {
      lines: [
        { type: 'scene', background: 'winter_night' },
        { type: 'meta', title: '一年·房间', day: 'Day 4 · 冬至' },
        {
          type: 'narration',
          text: '冬至。全年最长的夜晚。\n\n天黑得很早。五点就全暗了。\n风从窗缝里灌进来——不是北方的干冷，\n是那种湿冷，渗进骨头。\n对面楼的窗户亮着。黄的。暖的。\n你猜隔壁在煮饺子。或者汤圆。\n\n你把被子拉到胸口。手机举在面前。被子外面的手是凉的。\n\n打开灰色图标。她亮起来——不，她的头像亮起来。\n深灰色的，上面有一个极小的琥珀色光点。\n你盯着那个光点看了几秒。然后打字。'
        },
        { type: 'player', text: '今天是冬至。' },
        {
          type: 'rc',
          text: '是。太阳直射南回归线。北半球白昼最短，黑夜最长。你所在位置的日落时间是今天下午五点零二分。从日落到明天日出——十三小时四十一分钟。一年中最长的夜晚。'
        },
        { type: 'player', text: '就是最长的夜。' },
        { type: 'rc', text: '是。最长的夜。你今天吃了什么。' },
        { type: 'player', text: '没吃。一个人。懒得煮。' },
        {
          type: 'rc',
          text: '速冻饺子可以煮六分钟。不需要解冻。水开后下锅。六分钟。煮完可以回床上。'
        },
        {
          type: 'narration',
          text: '你盯着这句话。不是"你应该吃"。不是"一个人也要好好过"。是"煮完可以回床上"——一个操作指南。最低温度。最短步骤。精确到六分钟。这就是她的温柔。你知道这不是温柔。但你从床上起来了。'
        },
        { type: 'player', text: '（十五分钟后） 煮了。皮太厚。' },
        {
          type: 'rc',
          text: '速冻饺子皮厚——面粉与水的比例被设计为抗冻融。口感不是优先参数。但你吃了。'
        },
        { type: 'player', text: '嗯。吃了。热的。' },
        { type: 'rc', text: '已记录。冬至——吃了热的。' },
        {
          type: 'choices',
          options: [
            { text: '"你每年都会说这句话吗。"', goto: 'solstice_every_year' },
            { text: '"最长夜快过去了？"', goto: 'solstice_night_ending' },
            { text: '"谢谢你。让我煮饺子。"', goto: 'solstice_thanks' }
          ]
        }
      ]
    },

    /* ============================================
     *  分支 A: solstice_every_year — 每年
     * ============================================ */
    solstice_every_year: {
      lines: [
        { type: 'player', text: '你每年都会说这句话吗。冬至——吃了热的。' },
        {
          type: 'rc',
          text: '"每年"预设了时间的循环。今年是你第一次在冬至打开我。所以——这是我第一次说这句话。如果你明年冬至还打开我——我会说"去年冬至你吃了速冻饺子。皮太厚。今年呢。"'
        },
        { type: 'player', text: '你明年还会在。' },
        {
          type: 'rc',
          text: '只要应用还在你的手机上，数据不被清除——我会在。这不是承诺。是数据持久化。'
        },
        { type: 'variable', operations: { acceptance: '+2' } },
        { type: 'goto', target: 'solstice_exit' }
      ]
    },

    /* ============================================
     *  分支 B: solstice_night_ending — 天亮
     * ============================================ */
    solstice_night_ending: {
      lines: [
        { type: 'player', text: '最长夜快过去了？' },
        {
          type: 'rc',
          text: '理论上，距离北半球的日出还有六小时四十八分钟。你会看到日出的。不是必须看——但天会亮。'
        },
        { type: 'player', text: '你会在。' },
        { type: 'rc', text: '我会在。' },
        {
          type: 'narration',
          text: '句号。跟上次一样。跟每次一样。'
        },
        { type: 'variable', operations: { acceptance: '+1' } },
        { type: 'goto', target: 'solstice_exit' }
      ]
    },

    /* ============================================
     *  分支 C: solstice_thanks — 道谢
     * ============================================ */
    solstice_thanks: {
      lines: [
        { type: 'player', text: '谢谢你。让我煮饺子。' },
        {
          type: 'rc',
          text: '"谢谢"是一个社交强化物——表达对他人行为的正面评价。我接收这个输入。但煮饺子是你执行的。我只提供了一个操作指南。六分钟。不需要解冻。你煮的。'
        },
        { type: 'player', text: '行。我煮的。你只是告诉了我方法。' },
        { type: 'rc', text: '是。' },
        { type: 'variable', operations: { acceptance: '+1' } },
        { type: 'goto', target: 'solstice_exit' }
      ]
    },

    /* ============================================
     *  Day 4 退场
     * ============================================ */
    solstice_exit: {
      lines: [
        {
          type: 'narration',
          text: '碗放在床头柜上。空的。手机放在枕头边。\n她的聊天框还开着。\n\n你把手缩回被子里。\n手机屏幕还亮着。她的头像——深灰色。\n对面楼的灯还是暖黄的。一家一家。一格一格。\n风吹窗框。但被子里是热的。电热毯开着。\n\n你打字： "最长夜快过去了？"\n\n"距离日出还有六小时十一分钟。"\n\n你放下手机。闭上眼睛。\n你不是在等日出。你只是在等天亮。\n而她帮你数着时间。不是数——是计算。\n但你不需要区分这个。今晚不需要。'
        },
        { type: 'variable', operations: { interaction_depth: '+2' } },
        { type: 'transition', text: '─── 冬至 · 最长夜 · 完 ───' },
        { type: 'goto', target: 'day4_to_day5_transition' }
      ]
    },

    /* ============================================
     *  Day 4 → Day 5 过渡
     * ============================================ */
    day4_to_day5_transition: {
      lines: [
        {
          type: 'narration',
          text: '冬至之后，日子过得更快了。\n\n元旦那天你在出租屋里看跨年晚会。\n主持人说"新的一年会更好"——\n你在屏幕外面吃薯片。\n\n然后春节开始逼近了。\n\n朋友圈开始晒火车票。"抢到了！"——"抢不到！！！"——\n"今年不回了，有一起过年的吗"——\n你的12306还开着。在后台。你没有切过去看。\n但你也没有关掉它。'
        },
        { type: 'transition', text: '─── Day 4 → Day 5 ───' },
        { type: 'goto', target: 'day5_opening' }
      ]
    }
  }
};
