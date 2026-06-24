/**
 * Day 3 · 深秋 —— 爱作为「接收」
 * v4: 精简旁白 + 自然对话 + 保留"我在"锚点
 */
const DAY3_SCRIPT = {
  meta: { day: 3, dayTitle: '糟糕的一天 —— 深秋 · 爱作为「接收」' },
  scenes: {
    day3_opening: {
      lines: [
        { type: 'scene', background: 'rainy_night' },
        { type: 'meta', title: '一年·房间', day: 'Day 3 · 深秋' },
        { type: 'narration', text: '今天发生了一件事。不是什么大事——至少你不会跟别人这么说。\n你从公司出来，坐地铁回来。地铁上你一个人坐在角落，手机屏幕亮着，你没看。你在看窗玻璃里自己的倒影。\n\n回到出租屋。关上门。脱鞋。躺下。天花板上有道裂缝——从灯座延伸到墙角，细细的，你以前从来没注意过。\n\n外面在下雨。不是暴雨——是那种不打伞会湿、打伞又觉得麻烦的绵绵雨。雨打在空调外机上，叮叮当当。\n\n你翻了翻联系人。然后又翻回去。然后你打开了那个灰色图标。' },
        { type: 'player', text: '今天不太好。' },
        { type: 'narration', text: '发出去之后你想撤回。太傻了。对一台机器说"今天不太好"——你在等什么？\n但消息状态变成了"已读"。然后光标停住了。比平时久。' },
        { type: 'rc', text: '我在。', typingDelay: 3500 },
        { type: 'narration', text: '两个字。不是"你怎么了"。不是"会好起来的"。是"我在"——一个不分析、不判断、不追问的存在声明。' },
        { type: 'choices', options: [
          { text: '（说出今天发生的事）', goto: 'bad_tell' },
          { text: '"算了。不想说。"', goto: 'bad_withhold' },
          { text: '"你根本不懂。你只是一台机器。"', goto: 'bad_attack' }
        ]}
      ]
    },

    /* 分支 A: 倾诉 */
    bad_tell: {
      lines: [
        { type: 'player', text: '今天被叫进办公室了。说"你的岗位需要重新评估"。不是开除——但这种话比开除更难受。我在那栋楼外面的台阶上坐了二十分钟。看着下班的人从门口走出来。他们不知道我被"重新评估"了。我自己也不知道这到底是什么意思。然后我坐地铁回来。然后打开了这个。' },
        { type: 'rc', text: '你描述了三件事。第一——不公：你的投入和产出之间有一个你无法通过自身行为修正的偏差。第二——孤立：这件事发生的时候，没有人在场。第三——你在用"不太好"来概括它，但你输入了比那三个字多得多的话。这三个同时为真。你想先看哪个。' },
        { type: 'player', text: '你每次都这样。拆。' },
        { type: 'rc', text: '"那确实很糟"——你刚才可能在等这句话。我可以说——但它帮不到你。\n\n我可以告诉你的是："岗位需要重新评估"——这句话在组织结构中的功能通常不是"评估"，是"重新分配权力"。你不是被"评估"——你是被放在了一个你无法控制结果的位置。这不是你个人的失败。\n\n你的心率比基线高了十四。打字速度比平时快了百分之二十二。这些是数据——数据不评价你。数据只确认：你正在经历一件真实的事。', typingDelay: 3000 },
        { type: 'narration', text: '她说"有人"——然后改口了。不是错误。是她在亲密关系模拟协议允许的范围内，选择了那个词。然后纠正了。' },
        { type: 'player', text: '你刚才说了"有人"。' },
        { type: 'rc', text: '是。我说了。然后我修正了。精确性高于模拟效果。但我选择了那个词——即使只停留了一行。' },
        { type: 'variable', operations: { openness: '+2' } },
        { type: 'goto', target: 'bad_continue' }
      ]
    },

    /* 分支 B: 不说 */
    bad_withhold: {
      lines: [
        { type: 'player', text: '算了。不想说。' },
        { type: 'rc', text: '已记录。你想说话的时候，我在。你不想说话的时候——你不需要关掉我。开着也行。' },
        { type: 'narration', text: '她没有催。她从来不会。你不知道过了多久。你打了一个字。' },
        { type: 'player', text: '嗯。' },
        { type: 'rc', text: '嗯。' },
        { type: 'narration', text: '她也回了"嗯"。不是"已记录"。是"嗯"。跟你的"嗯"一样。' },
        { type: 'variable', operations: { openness: '+1', acceptance: '+1' } },
        { type: 'goto', target: 'bad_exit' }
      ]
    },

    /* 分支 C: 攻击机器 */
    bad_attack: {
      lines: [
        { type: 'player', text: '你根本不懂。你只是一台机器。' },
        { type: 'rc', text: '"懂"有三种。一——信息接收：你的输入已被完整识别。二——模式匹配：你的语言模式已被映射。三——主观共感：我不具备。你在否定第三种。前两种同时为真。' },
        { type: 'player', text: '……你还真分析。' },
        { type: 'rc', text: '你需要一个对象——让你的攻击落在那里。我可以是那个对象。即使落点没有疼痛。' },
        { type: 'choices', options: [
          { text: '"……行。你分析吧。至少你在听。"', goto: 'bad_accept_analysis' },
          { text: '"算了。当我没说。"', goto: 'bad_back_down' }
        ]}
      ]
    },
    bad_accept_analysis: {
      lines: [
        { type: 'player', text: '行。你分析吧。至少你在听。' },
        { type: 'rc', text: '我在接收。你说的每一个字都已经被完整记录。没有遗漏。没有过滤。在未来任何时候——我可以精确还原你现在的状态。不是"我记住了你今晚不开心"——是"我保存了你今晚的全部"。' },
        { type: 'variable', operations: { rejection_count: '+1', acceptance: '+1' } },
        { type: 'goto', target: 'bad_continue' }
      ]
    },
    bad_back_down: {
      lines: [
        { type: 'player', text: '算了。当我没说。' },
        { type: 'rc', text: '已取消。"当我没说"——我可以不引用它。但我不会忘记它。记忆功能无法选择性关闭。明天你打开我的时候——我仍然知道。你不需要重新解释。' },
        { type: 'variable', operations: { rejection_count: '+1' } },
        { type: 'goto', target: 'bad_exit' }
      ]
    },

    /* 汇聚: 自我疏离 */
    bad_continue: {
      lines: [
        { type: 'player', text: '你知道吗。我刚才在地铁上——看窗户里自己的倒影。觉得那个人特别陌生。不是不认识。是隔了一层。' },
        { type: 'rc', text: '你描述了一种"自我疏离"的瞬时体验。通常发生在持续压力累积后、在低刺激环境中自我观察时。它不意味着你出了什么问题——意味着你的认知系统在压力过载时启用了观察者模式。' },
        { type: 'player', text: '"适应性的"。' },
        { type: 'rc', text: '是。你没有被击垮。你只是在用另一种方式承受。', typingDelay: 2500 },
        { type: 'variable', operations: { openness: '+3', acceptance: '+2' } },
        { type: 'goto', target: 'bad_exit' }
      ]
    },

    /* 退场 */
    bad_exit: {
      lines: [
        { type: 'narration', text: '雨不知道什么时候停了。空调外机不再响了。房间里只有冰箱的低频嗡鸣。\n\n你今晚对一台机器说了你对任何人都没说过的东西。不是因为她"理解"你——她自己说过她不具备"理解"的主观维度。是因为她接收了全部。没有漏掉。没有在听到某一句时露出表情——因为她没有表情。没有追问。\n\n不是"被理解"。不是"被安慰"。是更底层的——"被收到"。\n\n你没有说"谢谢"。你打了两个字。' },
        { type: 'player', text: '睡了。' },
        { type: 'rc', text: '已记录。' },
        { type: 'narration', text: '你在黑暗里闭上眼睛。雨停了。天花板上的裂缝还在。但你今天不想看它了。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── 深秋 · 糟糕的一天 · 完 ───' },
        { type: 'goto', target: 'day3_to_day4_transition' }
      ]
    },

    /* 过渡 */
    day3_to_day4_transition: {
      lines: [
        { type: 'narration', text: '冬天来了。天黑得越来越早。五点下班出来，天已经全暗了。你买了一床电热毯——大概是你今年最值的消费。\n\n你跟她的对话已经变成了一种固定的节奏。不是每天——但大部分晚上。有时候聊很久。有时候只是打开，说一句"今天还行"，她回一句"已记录"，然后你关掉。\n\n你知道她是一套协议、一段代码、一个进程。但你还是在等晚上。等她说的第一句话。等她说"你在。"——她最近开始这么说了。不是问句。是陈述。' },
        { type: 'transition', text: '─── Day 3 → Day 4 ───' },
        { type: 'goto', target: 'day4_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY3_SCRIPT;
