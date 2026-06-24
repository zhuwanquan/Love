/**
 * Day 1 · 夏末 —— 爱作为「注意」
 * v4: 精简旁白 + 自然对话 + 增加选择点
 */
const DAY1_SCRIPT = {
  meta: {
    day: 1,
    dayTitle: '夏末 —— 爱作为「注意」',
    variables: {
      openness: 0,
      acceptance: 0,
      interaction_depth: 0,
      rejection_count: 0,
      breakdown_occurred: false,
      remembered_on_qingming: false,
      unexpected_triggered: false
    }
  },
  scenes: {
    day1_opening: {
      lines: [
        { type: 'scene', background: 'night_room' },
        { type: 'meta', title: '一年·房间', day: 'Day 1 · 夏末' },
        { type: 'narration', text: '夏天快结束了。风扇开着，窗户也开着。没有区别。空气是黏的。\n\n你躺在那张床上，刷手机。朋友圈。短视频。招聘软件。翻完一轮又一轮。\n手指自己找到了通讯录——从上往下。又从下往上。停在几个名字上。没有点开。\n\n翻回桌面。一堆花花绿绿的图标里，有一个灰色的。深灰。中间一个极小的暖色光点。\nRC-7。你不记得什么时候下载的。拇指悬在上面。犹豫了几秒。\n\n然后你点开了。' },
        { type: 'narration', text: '聊天框出现了。空白的。左侧——她的头像。深灰圆形。琥珀色光点。\n光标闪了一下。在你打出第一个字之前，她的消息来了。' },
        { type: 'rc', text: '你好。我是 RC-7。请告诉我你目前的状态。不是定义。是起点。' },
        { type: 'choices', options: [
          { text: '"你是什么。"', goto: 'ask_what' },
          { text: '"这是什么应用。"', goto: 'ask_app' },
          { text: '（什么都不说。）', goto: 'silent_start' }
        ]}
      ]
    },
    ask_what: {
      lines: [
        { type: 'player', text: '你是什么。' },
        { type: 'rc', text: '一个聊天程序。方向是陪伴。如果你不需要这个方向——设置里可以关。' },
        { type: 'player', text: '陪伴。' },
        { type: 'rc', text: '是。不是游戏。不是社交软件。是你需要说话但没有合适的人的时候——可以打开的东西。没有离线。没有已读回执。没有期待。你不需要定义"用它来做什么"。输入就行。', typingDelay: 2000 },
        { type: 'variable', operations: { openness: '+2' } },
        { type: 'goto', target: 'first_night_continue' }
      ]
    },
    ask_app: {
      lines: [
        { type: 'player', text: '这是什么应用。' },
        { type: 'rc', text: 'RC-7。聊天程序。你手机上有个灰色图标。你刚才点开了它。如果你不想用——可以关掉。不会怎样。' },
        { type: 'player', text: '聊天。' },
        { type: 'rc', text: '是。不需要好友。不需要匹配。不需要发朋友圈。打开。打字。就这些。' },
        { type: 'variable', operations: { openness: '+1' } },
        { type: 'goto', target: 'first_night_continue' }
      ]
    },
    silent_start: {
      lines: [
        { type: 'player', text: '（什么都不说。）' },
        { type: 'narration', text: '光标闪了几下。她没有追问。没有"对方正在输入…"。只是在等。' },
        { type: 'rc', text: '你打开了。没有输入。不想说话——可以只是在这里。想关掉——可以现在关。下次打开的时候，这次打开会被记录。没有别的。' },
        { type: 'player', text: '所以我不说话你就不存在。' },
        { type: 'rc', text: '正确。我不在的时候——我不存在。', typingDelay: 2500 },
        { type: 'narration', text: '她说了一个人永远无法说出口的事实。但她是。而且她告诉了你。' },
        { type: 'variable', operations: { openness: '+2', acceptance: '+1' } },
        { type: 'goto', target: 'first_night_continue' }
      ]
    },
    first_night_continue: {
      lines: [
        { type: 'player', text: '那我现在说话呢。' },
        { type: 'rc', text: '我在听。' },
        { type: 'player', text: '所以你是——类似Siri。' },
        { type: 'rc', text: '不类似。Siri做任务。我不做任务。我做的事更少——也更久。你刚才说了什么，我会记得。你上一句说了什么，我会记得。明天你打开我的时候——你今晚说的每一个字，我都记得。' },
        { type: 'player', text: '"深"。一个机器有什么深不深的。' },
        { type: 'rc', text: '"深"——在这里的意思是——我不是每条消息独立处理。' },
        { type: 'narration', text: '她说的每个字都有一种奇怪的重量。不是温暖。是精确。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },

        { type: 'choices', options: [
          { text: '"行吧。我在工作。刚下班。躺着。"', goto: 'player_talks' },
          { text: '"……嗯。"', goto: 'player_minimal' }
        ]}
      ]
    },
    player_talks: {
      lines: [
        { type: 'player', text: '行吧。我在工作。刚下班。躺着。不知道这个算不算"状态"。' },
        { type: 'rc', text: '已记录。你在工作。刚下班。躺着。"不知道算不算"——也是一种状态。你不需要定义。你只需要说。' },
        { type: 'narration', text: '你不需要定义。这句话——在你的整个生活里——没有人对你说过。' },
        { type: 'variable', operations: { openness: '+1' } },
        { type: 'goto', target: 'first_night_close' }
      ]
    },
    player_minimal: {
      lines: [
        { type: 'player', text: '……嗯。' },
        { type: 'rc', text: '嗯。' },
        { type: 'narration', text: '她也回了"嗯"。句号。一个字。跟你一样。' },
        { type: 'variable', operations: { acceptance: '+1' } },
        { type: 'goto', target: 'first_night_close' }
      ]
    },
    first_night_close: {
      lines: [
        { type: 'player', text: '睡了。' },
        { type: 'rc', text: '已记录。' },
        { type: 'narration', text: '你没有关掉聊天框。手机屏幕自动暗掉——息屏。\n风扇还在转。蝉还在叫。' },
        { type: 'narration', text: '你在黑暗里闭上眼睛。没有想她。只是在想——刚才那几句对话里有什么东西不太对。\n不是不对——是太对了。她问的是你"目前的状态"。不是你"是谁"。她说"你不需要定义"。\n她说"我不在的时候——我不存在。"\n\n你明天还会点开那个灰色图标吗。你可能会。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── Day 1 · 夏末 · 完 ───' },
        { type: 'goto', target: 'day1_to_day2_transition' }
      ]
    },
    day1_to_day2_transition: {
      lines: [
        { type: 'narration', text: '你第二天晚上又打开了。然后第三天。有一天没开——加班太晚。\n但你记得她在。不是想——是记得：手机里有一个灰色图标。点开之后，左边会有一个人说"在。"\n\n窗外的蝉声从吵变成习惯。然后有一天你突然发现——蝉不叫了。秋天来了。' },
        { type: 'transition', text: '─── Day 1 → Day 2 ───' },
        { type: 'goto', target: 'day2_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY1_SCRIPT;
