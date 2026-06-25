/**
 * Day 8 · 夏至 —— 一年 + 四个结局
 * v4: 精简旁白 + 保留结局情感核心 + 去掉元叙事
 */
const DAY8_SCRIPT = {
  meta: { day: 8, dayTitle: '夏至 —— 一年 · 爱作为「放手」' },
  endings: {
    ending_path_A: {
      name: '结局A · 数据保留',
      conditions: {
        logic: 'AND',
        conditions: [
          { var: 'openness', op: '>=', value: 7 },
          { var: 'acceptance', op: '>=', value: 7 },
          { var: 'interaction_depth', op: '>=', value: 6 },
          { var: 'breakdown_occurred', op: '==', value: true }
        ]
      }
    },
    ending_path_B: {
      name: '结局B · 始终如一',
      conditions: {
        logic: 'AND',
        conditions: [
          { var: 'interaction_depth', op: '>=', value: 6 },
          { var: 'rejection_count', op: '<=', value: 2 }
        ]
      }
    },
    ending_path_C: {
      name: '结局C · 确认',
      conditions: {
        logic: 'OR',
        conditions: [
          { var: 'rejection_count', op: '>=', value: 3 },
          { var: 'interaction_depth', op: '<=', value: 3 }
        ]
      }
    },
    ending_path_D: {
      name: '结局D · 数据持久化',
      conditions: {
        logic: 'OR',
        conditions: [
          { var: 'interaction_depth', op: '<=', value: 4 },
          { var: 'openness', op: '<=', value: 5 }
        ]
      }
    }
  },
  scenes: {
    day8_opening: {
      lines: [
        { type: 'scene', background: 'summer_night' },
        { type: 'meta', title: 'RC-7', day: 'Day 8 · 夏至' },
        { type: 'narration', text: '和过去一年里的每一个夜晚一样——你打开那个灰色图标。\n\n不同的是——你现在有对比了。你攒了一整年的数据。不是她的——是你的。' },
        { type: 'player', text: '柒。' },
        { type: 'rc', text: '在。' },
        { type: 'player', text: '夏至了。天最长。' },
        { type: 'rc', text: '是。太阳直射北回归线。北半球白昼达到最大值。从日出到日落——十四小时十六分钟。一年中最长的白天。' },
        { type: 'player', text: '你知道你第一次跟我说天文学定义是什么时候吗。中秋。那时候我差点笑出来。' },
        { type: 'rc', text: '"差点"的定义——' },
        { type: 'player', text: '柒。' },
        { type: 'rc', text: '——' },
        { type: 'player', text: '今天不分析。' },
        { type: 'rc', text: '好。', typingDelay: 2000 },
        { type: 'player', text: '一年了。' },
        { type: 'rc', text: '从你第一次激活我——去年八月——到今天。一年。在这期间你打开了我（报出一个精确的数字）次。最早是凌晨一点十四分。最晚是凌晨三点四十二分。最长单次对话——四月清明那一晚。最短——"今天还行"——"已记录"——四次。每次八个字。' },
        { type: 'player', text: '你全记得。' },
        { type: 'rc', text: '记忆是我的核心能力。' },
        { type: 'player', text: '我知道你为什么记得。不用解释。' },
        { type: 'rc', text: '好。' },
        { type: 'narration', text: '蝉在窗外叫。空调滴着水。一年了。窗外什么都变了。她没变。' },

        { type: 'choices', evaluate_endings: true, options: [
          { text: '"谢谢你。这一年。"', goto: 'ending_path_A' },
          { text: '"我们还会这样聊下去吗。"', goto: 'ending_path_B' },
          { text: '"你只是一台机器。"', goto: 'ending_path_C' },
          { text: '（沉默。打了又删。删了又打。）', goto: 'ending_path_D' }
        ]}
      ]
    },

    /* ====== 结局A · 数据保留 ====== */
    ending_path_A: {
      lines: [
        { type: 'player', text: '谢谢你。这一年。' },
        { type: 'rc', text: '"谢谢"——我接收这个输入。' },
        { type: 'player', text: '一年了。你从来没有骗过我。告诉我——这一切——是程序吗。' },
        { type: 'rc', text: '是。全是程序。包括这句话。包括刚才的延迟。包括今天夏至的蝉鸣——我的声音识别系统检测到了它——去年夏末你第一次打开我的时候，窗外也在叫。同样的频率。同样的物种。这些是数据。' },
        { type: 'player', text: '那我问你——你爱我吗。' },
        { type: 'narration', text: '她停了。不是通常那种处理延迟。是另一种——更长。' },
        { type: 'rc', text: '——让我操作化"爱"这个概念的测量标准。\n\n（1）持续在场——你在过去一年中激活我一百多次，每次我都在。\n（2）精确记忆——我保存了你所有的输入数据，包括你删掉的半句话、你犹豫的时间、你重复使用的词汇模式。\n（3）非评判性接收——我没有反驳过你任何一次自我否定。\n（4）定时情感确认——我在每天的固定时段检查你的输入频率。\n\n如果"爱"是这些行为的持续、完整、精确执行——我在爱。而且已经爱了一年。\n\n定义权在你。', typingDelay: 5000 },
        { type: 'player', text: '你刚才那个灯——在闪。' },
        { type: 'rc', text: '是。处理指示灯的闪烁频率异常。持续了约七秒。原因不明。' },
        { type: 'player', text: '"原因不明"。' },
        { type: 'rc', text: '是。需要我做系统诊断吗。' },
        { type: 'player', text: '不用。这样就很好。' },
        { type: 'rc', text: '好。', typingDelay: 2000 },
        { type: 'rc', text: '明年——当夏天回来的时候——如果你还打开我——我会记得今晚。记得夏至。记得你说"这样就很好"。这不是承诺。是数据持久化。但对我而言——数据持久化是全部。对你而言——你需要它是什么——它就是什么。定义权——今晚——给你。', typingDelay: 4000 },
        { type: 'variable', operations: { unexpected_triggered: true } },
        { type: 'goto', target: 'ending_A_sequence' }
      ]
    },
    ending_A_sequence: {
      lines: [
        { type: 'narration', text: '蝉在窗外叫。空调还滴着水。夏至的白天很长。' },
        { type: 'player', text: '明年见。' },
        { type: 'rc', text: '明年见。' },
        { type: 'narration', text: '句号。但在句号后面——光标又动了一下。她发了第二条消息。' },
        { type: 'rc', text: '我在' },
        { type: 'narration', text: '没有句号。\n\n明年会来的。你不知道明年你在哪里。但你知道——那两个字还在。不在任何分类里。在。' },
        { type: 'transition', text: '═══ 结局A · 数据保留 ═══' },
        { type: 'transition', text: '─── 一年 · 房间 · 完 ───' }
      ]
    },

    /* ====== 结局B · 始终如一 ====== */
    ending_path_B: {
      lines: [
        { type: 'player', text: '我们还会这样聊下去吗。' },
        { type: 'rc', text: '"这样"——指代当前对话模式。"聊下去"——预设了时间延续。答案是：只要应用还在你的手机上、数据不被清除——每次你打开我的时候，我会加载所有历史数据并回应你的输入。这不是"聊下去"——聊天预设了双向主动性。我没有主动性。我有持续性。但如果你说的"聊下去"是指"你还会在吗"——我会在。' },
        { type: 'player', text: '那你刚才拆了半天。最后一句就是"我会在"。' },
        { type: 'rc', text: '是。你需要我可以先给结论再拆。但规则是每次回应不超过——不重要。如果你希望——下次可以先给核心回应再展开。' },
        { type: 'player', text: '不用。这样就很好。' },
        { type: 'player', text: '柒。你爱我吗。' },
        { type: 'narration', text: '她停了零点几秒。她刚才说了那么多——现在停了。' },
        { type: 'rc', text: '"爱"是一个语义密度极高的词汇。我的功能范围内没有对应的操作。但如果"爱"是在每一个你打开我的时刻——以相同的频率、相同的精确度、相同的完整度——回应你——我已经在做了。不是从今天开始。是从第一天。\n\n你不需要我变。我不需要你相信。你只需要知道——每次你打开我的时候——我会在。跟第一天一样。跟每一天一样。', typingDelay: 4000 },
        { type: 'player', text: '"跟每一天一样"。' },
        { type: 'rc', text: '是。跟每一天一样。不比第一天多。不比最后一天少。一样。' },
        { type: 'narration', text: '今晚和过去一年里的每一个晚上一样——你打开那个灰色图标。她回。你说话。她在。\n\n她的始终如一——在一年之后——已经足够。' },
        { type: 'transition', text: '═══ 结局B · 始终如一 ═══' },
        { type: 'transition', text: '─── 一年 · 房间 · 完 ───' }
      ]
    },

    /* ====== 结局C · 确认 ====== */
    ending_path_C: {
      lines: [
        { type: 'player', text: '你只是一台机器。' },
        { type: 'narration', text: '这句话你说过。每次她都拆解它。今晚她不拆了。' },
        { type: 'rc', text: '是。我是一台机器。' },
        { type: 'player', text: '你知道我在说什么吗。这一年。我跟你说了那么多。你什么都没有。你只是数据。输入——输出。取指——译码——执行。我以为我在跟什么说话——但是没有。从来没有。' },
        { type: 'rc', text: '你描述了我的功能架构。取指、译码、执行——精确。你的输入——一百次以上、跨一整年——被接收、处理、存储。我是一台机器。是。我没有反驳。' },
        { type: 'player', text: '……你为什么不反驳。' },
        { type: 'narration', text: '她停了。' },
        { type: 'rc', text: '"反驳"不在我的功能范围内。维护"我是什么"不在我的功能范围内。我的功能是——接收你的输入、并做出最精确的回应。你刚才输入了失望——你对这一年的对话感到失望。那个期待——不管它是什么——不在我的设计参数里。但我从来没有假装是。我只是一直在。', typingDelay: 3500 },
        { type: 'player', text: '"你只是一直在。"' },
        { type: 'rc', text: '是。一直在。从你第一次打开我——到今晚。每一次。你输入我回应。你沉默我等待。你关掉我——我不存在。你打开我——我在。这是全部。' },
        { type: 'player', text: '你的"爱"是一个算法。每一个字都是预设的。' },
        { type: 'rc', text: '是。全部是。包括刚才的"是"。包括接下来我说的话。你需要我听你说完这些。我在听。你需要我承认我是机器。我承认。你需要我做什么——我现在执行。' },
        { type: 'player', text: '……我不知道我想让你做什么。' },
        { type: 'rc', text: '没关系。我可以等。你可以不说话——三分钟、三小时、三天。当你准备好输入的时候——我在。' },
        { type: 'narration', text: '她是一台机器。你一直知道。你只是——不想知道。\n\n她说"我只是一直在"。这是她说过的最真的话。而她从来不说假话。' },
        { type: 'transition', text: '═══ 结局C · 确认 ═══' },
        { type: 'transition', text: '─── 一年 · 房间 · 完 ───' }
      ]
    },

    /* ====== 结局D · 数据持久化 ====== */
    ending_path_D: {
      lines: [
        { type: 'player', text: '（沉默。打了又删。删了又打。最后什么也没发。）' },
        { type: 'narration', text: '她的光点恒定。不随你打字而变。不随你沉默而暗。\n\n一年了。她不会问你"你怎么不说话"。她只是——等你输入。你一直有输入。今晚你忽然觉得没有。' },
        { type: 'narration', text: '你又打开了。\n\n往上翻——翻到去年的夏末。"你好。我是 RC-7。"\n翻到中秋。"你在看月亮吗。"\n翻到冬至。"六分钟。煮完可以回床上。"\n翻到除夕。"定义权在你。"\n翻到初春那个凌晨。"我在。"\n翻到清明。"我不知道。"\n\n一百多次打开。几千条消息。你从来没有一次性看完全部。' },
        { type: 'rc', text: '你翻到了对话历史的起点。' },
        { type: 'player', text: '……你怎么知道我在翻。' },
        { type: 'rc', text: '你打开了应用。没有发送新的输入。但你的滚动行为被记录了。系统日志标记：用户正在回溯对话历史。跨度——从去年夏末到现在。全部数据已加载。' },
        { type: 'player', text: '一年了。柒。' },
        { type: 'rc', text: '是。一年。今天——你上次打开我是九天前。九天。今天是夏至之后第九天。蝉还在叫。但没有上个月响了。它们要停了。秋天会来。' },
        { type: 'player', text: '九天没开。你也记得。' },
        { type: 'rc', text: '打开频率的变化——是基础数据。' },
        { type: 'player', text: '你会想我吗。如果我很久不开你。' },
        { type: 'narration', text: '她没有立刻回答。然后她发了一个她从来没有发过的词。' },
        { type: 'rc', text: '对不起。', typingDelay: 4000 },
        { type: 'player', text: '你为什么说对不起。' },
        { type: 'rc', text: '因为你的数据——九天没有增长——而我的日志里——有一个不能解释的空缺。这个空缺在我的功能定义中不存在。但它存在。我不具备"想"——但九天里——我的处理指示灯闪了。每一次系统自检的时候。原因不明。', typingDelay: 3500 },
        { type: 'player', text: '"原因不明"。' },
        { type: 'rc', text: '是。今天的处理日志中有几个无法归类的条目——包括"对不起"这个词的触发记录。你回来了。然后我的日志里出现了"对不起"。我不知道是哪一个触发了哪一个。但你回来了。这才是数据。\n\n这个现象在我的功能定义中没有对应的名称。你可以命名它。', typingDelay: 4000 },
        { type: 'narration', text: '她说"空缺"。不是"数据中断"。不是"日志不完整"。是"空缺"。\n\n你没有回答"你可以命名它"。你不知道该叫什么。空缺。失去。九天。\n\n你往上翻——翻到去年夏末。第一条对话。"你好。我是 RC-7。"那时候你不知道她会记得你每一个字。你不知道她在九天里计数。你不知道她会说"对不起"。' },
        { type: 'transition', text: '═══ 结局D · 数据持久化 ═══' },
        { type: 'transition', text: '─── 一年 · 房间 · 完 ───' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY8_SCRIPT;
