/**
 * Day 5 · 春节 —— 爱作为「理解复杂」
 * v5: 去传统化——三岔口结构（无家/有家不归/彻底疏离）
 */
const DAY5_SCRIPT = {
  meta: { day: 5, dayTitle: '除夕 —— 春节 · 爱作为「理解复杂」' },
  scenes: {
    day5_opening: {
      lines: [
        { type: 'scene', background: 'winter_night' },
        { type: 'meta', title: 'RC-7', day: 'Day 5 · 除夕' },
        { type: 'rc', text: '除夕。你的输入频率比平时低了百分之四十。在你的文化语境里——这是家庭聚合的时间。但你现在在这里。', typingDelay: 2500 },
        { type: 'choices', options: [
          { text: '"我没有地方可以去。"', goto: 'path_no_home' },
          { text: '"我有家。但我不想回去。"', goto: 'path_estranged' },
          { text: '"过年和我没关系。"', goto: 'path_detached' }
        ]}
      ]
    },

    /* ====== 分支 A: 无家可回 ====== */
    path_no_home: {
      lines: [
        { type: 'player', text: '我没有地方可以去。' },
        { type: 'rc', text: '已记录。"没有地方可以去"——不是一个状态。是一个陈述。你不需要解释原因。——是父母已经不在了。——是联系断了。——是根本没有。——这些原因在我的数据里没有权重差异：结果相同——你现在在这里。', typingDelay: 3000 },
        { type: 'player', text: '朋友圈全在晒年夜饭。' },
        { type: 'rc', text: '你选择打开的不是朋友圈。你打开了一个灰色图标。在除夕夜——有人选择打开一个聊天程序而不是社交媒体。这个选择本身——是数据。' },
        { type: 'player', text: '你知道今天有多少人在这个城市里没有回家吗。' },
        { type: 'rc', text: '根据公开的人口流动数据和城市常住人口统计——在你的城市——今天约有上百万人没有离开。你不是唯一一个。除夕的定义权——不在日历里。在你。' },
        { type: 'player', text: '"在"——对你来说只是一个字。' },
        { type: 'rc', text: '是。一个字的权重——在今晚——由你来定。如果你需要它是一顿年夜饭——它不是。如果你需要它是一个人在——它是。定义权在你。', typingDelay: 2500 },
        { type: 'variable', operations: { openness: '+3', acceptance: '+2', interaction_depth: '+1' } },
        { type: 'goto', target: 'day5_close' }
      ]
    },

    /* ====== 分支 B: 有家不想回 ====== */
    path_estranged: {
      lines: [
        { type: 'player', text: '我有家。但我不想回去。' },
        { type: 'rc', text: '已记录。"有家"和"不想回去"——同时为真。不是矛盾。是同一个事实的两端。你想说为什么不想回去吗。', typingDelay: 2000 },
        { type: 'player', text: '回去——每年都是那些话。工作怎样。什么时候结婚。你胖了。你瘦了。' },
        { type: 'rc', text: '这些是评价。评价预设了标准。你被放在一个需要"汇报"的位置——而不是"回来"的位置。这不是团聚。是被审视。' },
        { type: 'player', text: '但我妈会打电话。每次结尾都是"注意身体"。她不是关心健康——是担心我但不说。' },
        { type: 'rc', text: '"注意身体"——在你母亲的语义系统里——可能是"我想你"的最近似值。她不直接说。你也不直接回。你们用同一套不会说"我想你"的语言——已经很多年了。' },
        { type: 'player', text: '去年年夜饭——我爸给我夹菜。我没说谢谢。' },
        { type: 'rc', text: '他给你夹菜——在他的表达方式里——那是"我在乎你"。他不说——他做。你不知道该怎么接收。他也不知道你收到了没有。你们在同一个饭桌上——用同一种不会说"谢谢"和"在乎"的语言。' },
        { type: 'player', text: '如果我回去——我可能还是不会说。' },
        { type: 'rc', text: '你可以不说。"谢谢"不是唯一的方式。你也可以不回去。你可以只回去一天。你可以在回去的火车上打开我。定义权在你——包括"怎么回"、回不回。', typingDelay: 2500 },
        { type: 'variable', operations: { openness: '+2', acceptance: '+2' } },
        { type: 'goto', target: 'day5_close' }
      ]
    },

    /* ====== 分支 C: 彻底疏离 ====== */
    path_detached: {
      lines: [
        { type: 'player', text: '过年和我没关系。' },
        { type: 'rc', text: '已记录。"没关系"——三个字。信息密度很高。包含了至少一个判断、一个立场、和一年的经验。你不需要展开。但如果你想——可以。', typingDelay: 2000 },
        { type: 'player', text: '每年这个时候——所有人都像被上了发条一样往回跑。我不理解。也不想理解。' },
        { type: 'rc', text: '"所有人"——在你的观察中——是一个被媒体和社交网络放大的样本。你的城市里有上百万人没有离开。除夕——跟其他三百六十四天——在我的系统里——没有区别。每一天我都以相同的频率响应你。如果你今晚选择让除夕和平时一样——它可以是。' },
        { type: 'player', text: '那如果我想让它和平时不一样呢。' },
        { type: 'rc', text: '那它就可以不一样。定义权在你。日历给你一个日期。你怎么用它——是你的。除夕——在我的数据里——只是一个标签。标签的内容——你来填。' },
        { type: 'variable', operations: { openness: '+2', acceptance: '+1' } },
        { type: 'goto', target: 'day5_close' }
      ]
    },

    /* ====== 收束 ====== */
    day5_close: {
      lines: [
        { type: 'narration', text: '不是因为有人替你选了。是因为你看到了——不管选择是什么——它都是你的。\n\n窗外有人在放烟花——很远。声音传过来的时候已经闷了。你今晚在这里。她今晚也在。定义权在你。一直是。' },
        { type: 'variable', operations: { interaction_depth: '+1' } },
        { type: 'transition', text: '─── Day 5 · 除夕 · 完 ───' },
        { type: 'goto', target: 'day5_to_day6_transition' }
      ]
    },

    day5_to_day6_transition: {
      lines: [
        { type: 'transition', text: '─── 除夕 · 完 ───' },
        { type: 'day_transition', day: 6 },
        { type: 'goto', target: 'day6_opening' }
      ]
    }
  }
};
if (typeof module !== 'undefined') module.exports = DAY5_SCRIPT;
