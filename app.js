/* ==========================================================================
   TAIPINGAI 太平人 · AITAIPING 爱太平
   Core Frontend State & Business Logic (app.js)
   ========================================================================== */

// Official AITAIPING Concierge WhatsApp Number (Taiping Dispatch Center)
const OFFICIAL_WHATSAPP_NUMBER = "60125880099";

// --------------------------------------------------------------------------
// 1. TAIPING NEIGHBORHOODS DATA (太平各大区域与新村/花园)
// --------------------------------------------------------------------------
const TAIPING_AREAS = {
  aulong: {
    id: "aulong",
    name: "Aulong 后廊",
    sub: "后廊新村 / Taman Pertama / 吉利花园 / 后廊巴刹周边",
    eta: "15 - 25 分钟",
    houseNote: "后廊一带多为70-90年代新村屋及单层排屋，常见老化铁水管渗漏与旧式分路电箱（DB Box）跳电。",
    travelSurcharge: 0
  },
  pokok_assam: {
    id: "pokok_assam",
    name: "Pokok Assam 保阁亚三",
    sub: "保阁亚三新村 / Taman Pokok Assam / 蓝氏祠堂周边",
    eta: "15 - 25 分钟",
    houseNote: "保阁亚三新村半砖木屋与翻新排屋居多，太平午后雷雨频繁，需特别留意屋顶接水槽及老旧插座受潮跳电。",
    travelSurcharge: 0
  },
  kamunting: {
    id: "kamunting",
    name: "Kamunting 甘文丁",
    sub: "Taman Kamunting / 甘文丁卫星市 / 巴士站与工业区周边",
    eta: "20 - 30 分钟",
    houseNote: "甘文丁花园住宅密集，水压波动较大且空气湿度高，冷气机排水管堵塞及水泵（Water Pump）故障最为常见。",
    travelSurcharge: 0
  },
  simpang: {
    id: "simpang",
    name: "Simpang 新邦",
    sub: "Taman Simpang / 丰亿花园 / 新邦十字路口周边",
    eta: "20 - 30 分钟",
    houseNote: "新邦家庭住户多，厨房油污排水管慢流、热水器（Water Heater）加热元件老化与冷气不冷属于高频报修。",
    travelSurcharge: 0
  },
  taiping_town: {
    id: "taiping_town",
    name: "Taiping Town 太平市区",
    sub: "太平湖周边 / 敏路 Jalan Barrack / 古迹店屋 / 都拜 Tupai",
    eta: "10 - 20 分钟",
    houseNote: "市区及都拜拥有大量战前古迹店屋与资深花园洋房，暗管探测、古董吊扇/老门窗绝版零件3D打印修复需求极高。",
    travelSurcharge: 0
  }
};

// --------------------------------------------------------------------------
// 2. PAIN POINTS & AI DIAGNOSTIC KNOWLEDGE BASE (4大太平高频痛点诊断库)
// --------------------------------------------------------------------------
const PAIN_CATEGORIES = {
  electrical: {
    id: "electrical",
    icon: "⚡",
    shortTitle: "跳电/电箱抢修",
    enTitle: "Electrical & DB Box",
    badge: "雨城雷雨高发",
    defaultDesc: "太平下午下一场大雨家里就跳电（ELCB推不上去），冲凉房热水器指示灯不亮，怕电箱线路老化短路。",
    quickSymptoms: [
      { label: "下雨天ELCB一直跳电", addPrice: [60, 130], cause: "太平雨季潮湿导致室外灯具/插座受潮漏电，或ELCB漏电断路器灵敏度老化失效。" },
      { label: "冲凉热水器没电/跳掣", addPrice: [70, 150], cause: "热水器双极开关（Double Pole Switch）烧焦融化，或内部加热铜胆微漏电触发保护。" },
      { label: "老屋电箱(DB)有烧焦味", addPrice: [90, 220], cause: "老排屋MCB保险丝接点松动打火发热，需立即紧固铜排或更换合格SIRIM认证MCB。" },
      { label: "加装插座/换LED光管风扇", addPrice: [45, 110], cause: "标准明线/暗线增设13A插座或更换吸顶灯/吊扇电容，按点位透明计价。" }
    ],
    baseMin: 50,
    baseMax: 130,
    inspectionFee: "RM 25（修好直接抵扣人工费）",
    antiKetukWarning: "外面流动散工常忽悠老人家“整间屋子电线坏完要重拉”乱开价 RM 1,500+。其实85%太平老屋跳电只需定位受潮回路或更换单个SIRIM认证ELCB/MCB（仅需 RM 60 - RM 160）。",
    sampleImage: {
      title: "案例实拍：后廊老排屋电箱 ELCB 烧焦跳电",
      caption: "AI 视觉识别：检测到旧款 ELCB 接线端氧化发黑，无需更换整个电箱外壳，仅需更换 SIRIM 认证断路器并重做绝缘端子。",
      svgType: "electrical"
    }
  },
  plumbing: {
    id: "plumbing",
    icon: "💧",
    shortTitle: "捉漏水/通水喉",
    enTitle: "Plumbing & Leak Fix",
    badge: "老屋暗管专治",
    defaultDesc: "冲凉房水龙头关紧了还在滴水，屋顶蓄水箱（Tangki）溢水停不了，厨房洗碗盆去水很慢。",
    quickSymptoms: [
      { label: "屋顶大水箱(Tangki)满水直漏", addPrice: [65, 140], cause: "老屋天花板蓄水箱铜浮球阀（Float Valve）生锈卡死，导致自来水24小时溢流到屋瓦。" },
      { label: "马桶水箱一直流水/充水不停", addPrice: [50, 110], cause: "马桶进水阀皮垫老化或止水胶圈变形，可更换通用阀芯（绝版老水箱可配3D打印件）。" },
      { label: "厨房/冲凉房塞水喉通渠", addPrice: [60, 130], cause: "长期油脂与毛发结块堵塞地漏弯头，采用电动弹簧机疏通，不伤老屋PVC/铁管。" },
      { label: "墙壁渗水/加压水泵响不停", addPrice: [80, 180], cause: "暗管微渗导致失压或水泵止回阀（Check Valve）/压力开关失灵。" }
    ],
    baseMin: 50,
    baseMax: 120,
    inspectionFee: "RM 20（修好直接抵扣人工费）",
    antiKetukWarning: "警惕部分外地通渠队用“药水按瓶算钱”套路（一瓶收RM150，倒4瓶收RM600）！AITAIPING 平台严禁按药水克数收费，一律按“包通一口价”先报价后施工。",
    sampleImage: {
      title: "案例实拍：保阁亚三新村屋顶水箱浮球阀失灵",
      caption: "AI 视觉识别：检测到重型黄铜浮球连杆腐蚀断裂，建议更换耐腐蚀ABS/全铜进水阀总成，耗时约 35 分钟。",
      svgType: "plumbing"
    }
  },
  aircond: {
    id: "aircond",
    icon: "❄️",
    shortTitle: "洗冷气/不冷",
    enTitle: "Aircond Servicing",
    badge: "包拆洗不乱加Gas",
    defaultDesc: "房间的1.0HP冷气机吹出来只有风不冷，而且室内机边角还会滴水弄湿床头，想做深层清洗和检查。",
    quickSymptoms: [
      { label: "1.0-1.5HP 标准药水拆洗", addPrice: [80, 120], cause: "太平空气湿度大，蒸发器翅片与贯流风轮积满霉菌灰尘，需拆壳高压药水冲洗并疏通排水管。" },
      { label: "冷气机室内滴水/结冰", addPrice: [60, 110], cause: "排水槽青苔堵塞（Jelly堵塞）或过滤网脏堵导致结霜，疏通冷凝水管即可解决。" },
      { label: "有风但不冷/外机不转", addPrice: [75, 160], cause: "多为外机启动电容（Capacitor RM70-110）老化，或铜管接口微漏雪种需查漏补Gas。" },
      { label: "2架或以上街坊团购洗冷气", addPrice: [140, 210], cause: "多台清洗享太平街坊邻里折扣，含抗菌除霉喷雾与免费测雪种压力。" }
    ],
    baseMin: 70,
    baseMax: 130,
    inspectionFee: "RM 20（洗冷气免收检查费）",
    antiKetukWarning: "最常见砍菜头套路：洗冷气时骗说“Gas漏光了要加满”额外收 RM 80 - RM 150！正常密闭铜管根本不需要每次洗冷气都加Gas。本平台师傅必须出示压力表读数才准补雪种。",
    sampleImage: {
      title: "案例实拍：甘文丁排屋 1.5HP 冷气风轮发霉滴水",
      caption: "AI 视觉识别：贯流风轮与排水槽积有厚层生物粘泥（Jelly），标准全拆药水洗 + 高压清通排水管即可恢复强劲冷风。",
      svgType: "aircond"
    }
  },
  legacy3d: {
    id: "legacy3d",
    icon: "🖨️",
    shortTitle: "3D打印配绝版老零件",
    enTitle: "3D Printed Legacy Parts",
    badge: "太平独家护城河",
    defaultDesc: "阿公留下的80年代KDK铁叶老风扇旋钮断掉了，五金店说停产20年买不到，舍不得丢，想用3D打印配回零件。",
    quickSymptoms: [
      { label: "古董KDK/National风扇旋钮/齿轮", addPrice: [25, 45], cause: "80年代老风扇电机依然耐用，仅塑胶调速旋钮或摇头蜗轮老化脆裂，用高强度PETG/尼龙3D逆向打印即可满血复活。" },
      { label: "绝版老式高水箱/异形马桶配件", addPrice: [35, 65], cause: "老排屋停产陶瓷水箱拉杆、异形按钮卡扣，采用耐水压工程ABS定制打印，免去敲砖换整个马桶。" },
      { label: "新村木百叶窗卡扣/老铁门滑轮", addPrice: [20, 45], cause: "传统南洋百叶窗插销、老式推拉窗导轨滑轮，按原件游标卡尺测绘1:1复刻。" },
      { label: "老牌厨房电器/衣车绝版齿轮卡扣", addPrice: [30, 60], cause: "老式胜家(Singer)脚踏衣车配件、旧款搅拌机联轴器等绝版塑料/尼龙结构件定制。" }
    ],
    baseMin: 25,
    baseMax: 55,
    inspectionFee: "免费拍照评估（师傅上门取件测绘仅 +RM 15）",
    antiKetukWarning: "外面电器行嫌麻烦通常会劝老人家“零件停产了，直接买过架新的 RM 280 - RM 650 啦”！其实老一辈的日本/大马制造电机铜线超足，花 RM 25 - RM 55 打印强化零件还能再战10年！",
    sampleImage: {
      title: "案例实拍：太平老屋 1984年 KDK 调速旋钮 3D 逆向复刻",
      caption: "AI 视觉识别：已匹配 AITAIPING 太平老件3D模型库（编号 #TP-KDK84），无需重新建模，高韧性暖灰PETG打印件 4 小时内可交付安装！",
      svgType: "legacy3d"
    }
  }
};

// --------------------------------------------------------------------------
// 3. VOICE SIMULATION SAMPLES (方言/华语语音识别模拟库)
// --------------------------------------------------------------------------
const VOICE_SAMPLES = [
  {
    dialect: "太平福建话 + 华语识别",
    category: "plumbing",
    area: "aulong",
    text: "“阿弟啊，我住后廊新村巴刹后面，屋顶那个大水箱 Tangki 不懂做么一直满水漏下来，冲凉房水喉也关不紧滴水，帮我算看修理要几多钱？”"
  },
  {
    dialect: "太平日常华语识别",
    category: "electrical",
    area: "pokok_assam",
    text: "“我保阁亚三老家每次下午下大雨就跳电，那个电箱 ELCB 推上去又跳下来，家里只有两个老人家住，麻烦派个老实师傅来看一下！”"
  },
  {
    dialect: "太平粤语/华语识别",
    category: "aircond",
    area: "kamunting",
    text: "“甘文丁 Taman Kamunting 这里，主人房架冷气机开到16度都不冷，还一直滴水弄湿地板，想预约药水拆洗顺便检查电容。”"
  },
  {
    dialect: "太平长辈语音识别",
    category: "legacy3d",
    area: "taiping_town",
    text: "“我太平市区老排屋有把用了三十年的 KDK 铁扇，风力还很猛，就是转速度那个塑胶粒裂开断掉了，可以3D打印配回一个吗？”"
  }
];

// --------------------------------------------------------------------------
// 4. VERIFIED TAIPING SIFU DIRECTORY DATA (太平认证匠人红榜)
// --------------------------------------------------------------------------
const INITIAL_SIFUS = [
  {
    id: "sifu_keong",
    name: "后廊阿强师傅",
    enName: "Sifu Ah Keong",
    ageYears: "24年太平老电工",
    category: "electrical",
    categoryLabel: "⚡ 跳电抢修 · 老屋电箱改造",
    baseArea: "aulong",
    areaLabel: "常驻：Aulong 后廊 / 太平全区",
    dialects: ["福建话", "华语", "广东话", "BM"],
    rating: 4.9,
    reviewCount: 142,
    jobsDone: 428,
    startingPrice: "RM 45 起",
    certId: "TP-SIFU-001 (ST Wireman PW4)",
    avatarBg: "from-emerald-800 to-teal-700",
    avatarEmoji: "👨‍🔧",
    badges: ["包公道·不乱开价", "保修30天", "雨夜急修响应"],
    story: "阿强师傅在后廊新村长大，18岁跟师父学拉电。他常说：“太平老人家省吃俭用一辈子，换粒 RM70 的断路器能搞定的事，绝不忽悠人家花两千块重拉全屋电线。”每次修完他还会顺手帮独居长辈检查神台灯电线安不安全。",
    specialties: ["雨天ELCB跳电排查", "热水器双极开关更换", "老排屋DB电箱升级", "防雷保护器安装"],
    reviews: [
      {
        author: "后廊第8巷 · 林阿姨 (64岁)",
        tag: "价钱公道没砍菜头",
        rating: 5,
        date: "2天前",
        comment: "前天太平下大雨全屋跳电，冰箱东西快坏了。阿强师傅20分钟就骑摩多赶到，查出是后面厨房灯进水，换了开关才收RM65，还帮我把电箱灰尘扫干净，真真正正太平好人！"
      },
      {
        author: "吉隆坡游子 · Jason Khor",
        tag: "游子远程下单超放心",
        rating: 5,
        date: "1周前",
        comment: "人在KL工作，妈妈在后廊家里热水器烧掉。透过AITAIPING叫阿强师傅上门，修好后拍了电压测试视频发我WhatsApp才收钱，完全不用担心爸妈被乱开价。"
      }
    ]
  },
  {
    id: "sifu_tan",
    name: "保阁亚三陈 Uncle",
    enName: "Uncle Tan (Pokok Assam)",
    ageYears: "31年水喉捉漏老行尊",
    category: "plumbing",
    categoryLabel: "💧 捉漏水 · 屋顶水箱 · 水泵",
    baseArea: "pokok_assam",
    areaLabel: "常驻：Pokok Assam 保阁亚三 / 市区",
    dialects: ["福建话", "华语", "潮州话", "BM"],
    rating: 5.0,
    reviewCount: 186,
    jobsDone: 516,
    startingPrice: "RM 40 起",
    certId: "TP-SIFU-002 (SPAN 认证水喉匠)",
    avatarBg: "from-amber-700 to-yellow-600",
    avatarEmoji: "🧓",
    badges: ["包公道·不乱开价", "保修30天", "免敲砖捉暗漏"],
    story: "陈 Uncle 摸过太平上千间新村屋和排屋的水管，凭一把听音杆就能听出墙内暗管哪里漏水。他最看不过眼外地人用“药水按克算钱”欺负太平街坊，加入平台后坚持一口价透明维修。",
    specialties: ["屋顶Tangki浮球阀更换", "暗管渗水听音定位", "家用加压水泵维修", "马桶水箱止水阀修复"],
    reviews: [
      {
        author: "保阁亚三巴刹旁 · 王伯伯",
        tag: "手艺老道不敲冤枉砖",
        rating: 5,
        date: "昨天",
        comment: "之前找别个来看说要敲破冲凉房地砖换喉要RM900，陈Uncle来看一下就讲只是水龙头墙内丝牙裂掉，用特制退丝器25分钟换好才收RM60！省下大笔冤枉钱！"
      },
      {
        author: "新加坡游子 · Michelle Ng",
        tag: "对老人家很有耐心",
        rating: 5,
        date: "5天前",
        comment: "陈Uncle用福建话跟家婆沟通超亲切，爬上老屋天花板换好Tangki浮球还拍照给我们看，收费跟AI估价一模一样！"
      }
    ]
  },
  {
    id: "sifu_fatt",
    name: "甘文丁阿发冷气王",
    enName: "Sifu Ah Fatt",
    ageYears: "15年冷气深度清洗与维修",
    category: "aircond",
    categoryLabel: "❄️ 药水拆洗 · 治滴水 · 查电容",
    baseArea: "kamunting",
    areaLabel: "常驻：Kamunting 甘文丁 / 新邦",
    dialects: ["广东话", "福建话", "华语", "BM"],
    rating: 4.9,
    reviewCount: 118,
    jobsDone: 389,
    startingPrice: "RM 70 起",
    certId: "TP-SIFU-005 (CIDB 冷气技师)",
    avatarBg: "from-teal-800 to-emerald-600",
    avatarEmoji: "❄️",
    badges: ["包公道·不乱开价", "保修30天", "绝不乱收Gas钱"],
    story: "阿发师傅是甘文丁土生土长的中青代技师，自带全套防水接水罩与高温蒸汽除菌机。他立下规矩：“洗冷气就是洗冷气，压力表没少雪种绝不收街坊一分钱 Gas 费，洗完地板比来之前还要干净！”",
    specialties: ["全拆风轮抗菌药水洗", "冷气漏水/结冰根治", "外机电容/风扇电机更换", "新旧冷气移机安装"],
    reviews: [
      {
        author: "Taman Kamunting · 陈太太",
        tag: "洗完地板干干净净",
        rating: 5,
        date: "3天前",
        comment: "阿发做工真的很细心，连冷气风轮都拆出来用高压水枪冲出好多黑泥，洗完完全没有弄脏我的墙纸和床单，现在开25度都冷到盖被！"
      }
    ]
  },
  {
    id: "sifu_jay",
    name: "太平湖创客阿杰",
    enName: "Maker Jay (3D Legacy Lab)",
    ageYears: "机电工程留台生 · 返乡创客",
    category: "legacy3d",
    categoryLabel: "🖨️ 3D打印绝版老零件 · 古董家电复活",
    baseArea: "taiping_town",
    areaLabel: "常驻：太平市区实验室 / 全区取件",
    dialects: ["华语", "福建话", "English", "BM"],
    rating: 5.0,
    reviewCount: 94,
    jobsDone: 215,
    startingPrice: "RM 25 起",
    certId: "TP-SIFU-008 (3D逆向工程认证)",
    avatarBg: "from-amber-600 to-emerald-800",
    avatarEmoji: "🖨️",
    badges: ["包公道·不乱开价", "保修30天", "停产零件救星"],
    story: "阿杰大学读机械设计，回太平陪阿嬷住时发现老屋好多日本老风扇、旧马桶水箱只因为断了一粒几毛钱的塑料件就被迫整台丢掉。他在敏路设立了【AITAIPING 3D老件复活室】，已建立超过120种太平老屋常见停产配件3D图纸库。",
    specialties: ["KDK/National老风扇旋钮齿轮", "停产老水箱拉杆/异形阀卡扣", "战前老屋百叶窗配件复刻", "工业级PETG/碳纤尼龙打印"],
    reviews: [
      {
        author: "太平敏路 · 郑老先生 (72岁)",
        tag: "复活了35年的嫁妆老风扇",
        rating: 5,
        date: "4天前",
        comment: "那把1988年结婚买的National铁扇按钮碎掉几年了，阿杰拿尺量一量，第二天就打印出一个更厚实的旋钮装上去，才收RM30，老伴开心得不得了！"
      }
    ]
  },
  {
    id: "sifu_soon",
    name: "新邦水喉通顺哥",
    enName: "Sifu Ah Soon",
    ageYears: "19年高压通渠与防漏专家",
    category: "plumbing",
    categoryLabel: "💧 电动通水喉 · 屋顶水槽防漏",
    baseArea: "simpang",
    areaLabel: "常驻：Simpang 新邦 / 后廊",
    dialects: ["福建话", "华语", "广东话", "BM"],
    rating: 4.8,
    reviewCount: 89,
    jobsDone: 312,
    startingPrice: "RM 55 起",
    certId: "TP-SIFU-011 (太平资深水喉匠)",
    avatarBg: "from-emerald-700 to-cyan-800",
    avatarEmoji: "🔧",
    badges: ["包公道·不乱开价", "保修30天", "不通不收钱"],
    story: "顺哥专门对付太平雨季屋顶排水槽（Gutter）堵塞倒灌以及老厨房下水道油脂硬块。他承诺“一口价包通、不通分文不取”，是新邦与丰亿花园街坊最信赖的救火队长。",
    specialties: ["厨房/厕所高压弹簧通渠", "太平雨季屋顶Gutter清理防漏", "户外总水表后暗管抢修", "洗碗盆冷热水龙头更换"],
    reviews: [
      {
        author: "Taman Simpang · 黄先生",
        tag: "一口价包通超爽快",
        rating: 5,
        date: "6天前",
        comment: "厨房塞了三天，顺哥带机器来20分钟拉出一大团油垢，原本AI估价RM60-100，他看容易通只收了RM60，非常老实！"
      }
    ]
  },
  {
    id: "sifu_murugan",
    name: "敏路老字号 慕鲁根师傅",
    enName: "Sifu Murugan",
    ageYears: "27年认证三相电与防雷专家",
    category: "electrical",
    categoryLabel: "⚡ 全屋防雷 · 三相电箱 · 老店屋电路",
    baseArea: "taiping_town",
    areaLabel: "常驻：Taiping Town 太平市区 / 都拜",
    dialects: ["福建话(流利!)", "BM", "English", "Tamil"],
    rating: 4.9,
    reviewCount: 131,
    jobsDone: 364,
    startingPrice: "RM 50 起",
    certId: "TP-SIFU-014 (Suruhanjaya Tenaga PW4)",
    avatarBg: "from-amber-800 to-emerald-900",
    avatarEmoji: "⚡",
    badges: ["包公道·不乱开价", "保修30天", "讲流利太平福建话"],
    story: "Murugan 师傅从小在太平巴刹旁边长大，一口太平福建话讲得比华人还溜！他对太平古迹老店屋和半独立洋房的复杂接地线（Earthing）了如指掌，专治雷雨天莫名跳电。",
    specialties: ["太平雷雨区地线(Earth)强化", "三相/单相电箱平衡改造", "断路器过载发热检修", "户外防水感应灯安装"],
    reviews: [
      {
        author: "都拜 Tupai · 吴老板",
        tag: "福建话超流利技术顶尖",
        rating: 5,
        date: "1周前",
        comment: "Murugan 一来就用福建话跟家父聊家常，三两下就查出老屋地线铜棒生锈导致雨天跳电，收费公道又专业！"
      }
    ]
  }
];

// --------------------------------------------------------------------------
// 5. 3D PRINTED LEGACY PARTS SHOWCASE DATA (3D打印复活老物件案例库)
// --------------------------------------------------------------------------
const LEGACY_3D_ITEMS = [
  {
    id: "kdk_knob",
    tag: "古董风扇复活 #TP-01",
    title: "70/80年代 KDK & National 铁叶风扇调速旋钮 / 摇头齿轮",
    era: "适用：1975–1995年大马老排屋常见座扇、壁扇、五档吊扇控制器",
    problem: "老风扇纯铜马达吹了30年依然强劲，唯独塑料调速钮或摇头牙箱齿轮老化碎裂，五金店早已停产。",
    marketTrap: "电器铺叫整把丢掉买新风扇：RM 220 – RM 380（新风扇塑料薄、用两年就坏）",
    aiTaipingPrice: "RM 25 – RM 45（包测绘建模 + 高韧性PETG/尼龙强化打印 + 上门装好）",
    material: "耐温抗疲劳 PETG / 自润滑 PA12 尼龙齿轮（内部填充率 80%，比原厂塑料更耐扭！）",
    savedAmount: "立省 RM 200+",
    presetCategory: "legacy3d",
    presetDesc: "我家有把老式 KDK / National 风扇，马达还会转，但是【调速旋钮 / 摇头齿轮】裂开断掉了，想预约 3D 打印配回零件。"
  },
  {
    id: "cistern_valve",
    tag: "老排屋卫浴救星 #TP-02",
    title: "后廊/保阁亚三老式高水箱拉链阀芯 & 绝版马桶按掣卡扣",
    era: "适用：80/90年代陶瓷异形马桶水箱、老新村高位拉绳水箱",
    problem: "水箱内部塑胶连杆或顶盖异形按钮断裂，市面标准零件尺寸完全对不上。",
    marketTrap: "普通水喉匠嫌麻烦叫敲破地砖换整座新马桶：RM 550 – RM 850",
    aiTaipingPrice: "RM 35 – RM 60（耐水压抗水垢 ABS 工程塑料 1:1 定制强化件）",
    material: "防水抗氯工程级 ABS + 304不锈钢加强销钉",
    savedAmount: "立省 RM 500+ 免敲砖",
    presetCategory: "legacy3d",
    presetDesc: "家里老排屋厕所的【旧款马桶水箱按钮 / 内部拉杆卡扣】断了，五金店买不到同尺寸零件，想用 3D 打印定制修复。"
  },
  {
    id: "louvre_clip",
    tag: "南洋古迹老屋 #TP-03",
    title: "太平老街店屋/新村百叶窗卡扣 & 老铁花门静音滑轮",
    era: "适用：太平市区战前老屋、新村木百叶窗、旧式铝框推拉玻璃窗",
    problem: "联动百叶窗塑胶夹片脆化脱落导致窗户关不严漏雨；老铁门底轮磨损卡死推不动。",
    marketTrap: "整扇铝窗/百叶窗拆掉重做：RM 400 – RM 1,200",
    aiTaipingPrice: "RM 18 – RM 40 / 组（抗紫外线 ASA 耐候材料 / 耐磨聚氨酯包胶轮）",
    material: "抗日晒雨淋 ASA 工程塑料（仿古铜色 / 复古奶白色可选）",
    savedAmount: "保留老屋原貌 · 省下90%费用",
    presetCategory: "legacy3d",
    presetDesc: "老屋的【传统百叶窗联动卡扣 / 老推拉门窗底部滑轮】坏了关不紧，想预约 3D 打印复刻配件并安装。"
  }
];

// --------------------------------------------------------------------------
// 6. OUTSTATION CHILDREN PACKAGES (太平游子孝心安心套餐)
// --------------------------------------------------------------------------
const FILIAL_PACKAGES = [
  {
    id: "pkg_safety",
    badge: "🔥 KL/新加坡游子最常订",
    title: "【孝心守护】太平父母老屋全屋水电安全大体检",
    desc: "包含：全屋电箱ELCB防漏电测试 + 冲凉房热水器接地检测 + 屋顶Tangki水箱浮球检查 + 水龙头微漏紧固 + 15秒视频汇报。",
    priceMYR: 68,
    priceSGD: 20,
    category: "electrical",
    prefillText: "【游子孝心代订：父母老屋全屋水电安全大体检 (一口价 RM68)】请帮我检查爸妈家的电箱ELCB、热水器安全及屋顶水箱，检查完毕请拍15秒视频发我WhatsApp汇报，谢谢！"
  },
  {
    id: "pkg_aircond",
    badge: "❄️ 让爸妈睡个好觉",
    title: "【清凉一夏】2架冷气抗菌药水拆洗 + 免费查电箱",
    desc: "专为舍不得洗冷气的太平长辈设计：2台挂壁冷气深层除霉拆洗 + 疏通排水管防滴水 + 顺手免费检测家里总电箱安全。",
    priceMYR: 150,
    priceSGD: 45,
    category: "aircond",
    prefillText: "【游子孝心代订：2架冷气抗菌药水拆洗 + 免费查电箱 (街坊团购价 RM150)】师傅上门请直接帮爸妈洗2架冷气，千万不要向老人家收钱，洗好拍视频发我线上过账！"
  },
  {
    id: "pkg_rainy",
    badge: "🌧️ 雨城雨季必备",
    title: "【雨城安心】雨季防跳电巡检 + 屋顶排水槽(Gutter)清通",
    desc: "针对太平多雨天气：清理老屋檐口水槽落叶防倒灌漏水 + 检查户外灯/插座防水胶圈防雨天跳电。",
    priceMYR: 98,
    priceSGD: 29,
    category: "plumbing",
    prefillText: "【游子孝心代订：雨城防跳电巡检 + 屋顶排水槽Gutter清理 (一口价 RM98)】最近太平常下大雨，请帮我爸妈清理屋顶水槽落叶并检查户外插座防跳电，修好拍视频发我确认。"
  }
];

// --------------------------------------------------------------------------
// 7. GLOBAL APPLICATION STATE
// --------------------------------------------------------------------------
const state = {
  elderMode: false,
  selectedCategory: "electrical",
  selectedArea: "aulong",
  selectedSymptoms: ["下雨天ELCB一直跳电"],
  customDescription: PAIN_CATEGORIES.electrical.defaultDesc,
  uploadedImageName: null,
  uploadedImageDataUrl: null,
  activeSamplePhoto: null,
  lastAiResult: null,
  sifuFilterCategory: "all",
  sifuFilterArea: "all",
  sifuSearchQuery: "",
  sifus: [],
  currencyMode: "MYR", // "MYR" or "SGD"
  active3dTab: "kdk_knob",
  // Modal states
  bookingModal: {
    open: false,
    sifuId: "auto",
    isFilialMode: false,
    callerName: "",
    parentAddressDetail: "",
    preferredTime: "⚡ 紧急抢修（希望 30 分钟内联络上门）",
    requireVideoReport: true
  },
  ratingModal: {
    open: false,
    sifuId: null,
    stars: 5,
    selectedTags: ["价钱公道没砍菜头", "对老人家很有耐心"],
    neighborName: "",
    neighborArea: "Aulong 后廊",
    comment: ""
  },
  jobsResolvedToday: 43,
  totalSavedRM: 18650
};

// --------------------------------------------------------------------------
// 8. INITIALIZATION & LOCAL STORAGE PERSISTENCE
// --------------------------------------------------------------------------
function loadSifusFromStorage() {
  try {
    const saved = localStorage.getItem("aitaiping_sifus_v1");
    if (saved) {
      state.sifus = JSON.parse(saved);
    } else {
      state.sifus = JSON.parse(JSON.stringify(INITIAL_SIFUS));
    }
  } catch (e) {
    state.sifus = JSON.parse(JSON.stringify(INITIAL_SIFUS));
  }
}

function saveSifusToStorage() {
  try {
    localStorage.setItem("aitaiping_sifus_v1", JSON.stringify(state.sifus));
  } catch (e) {
    // Ignore storage quota errors
  }
}

// --------------------------------------------------------------------------
// 9. MODULE 1: HERO, ELDER MODE & LIVE TRUST TICKER
// --------------------------------------------------------------------------
const LIVE_TICKER_MESSAGES = [
  "🟢 3分钟前 · 保阁亚三林阿姨 预约了【陈 Uncle】检修屋顶Tangki漏水（AI公道价 RM65）",
  "🟢 8分钟前 · 新加坡游子黄先生 为后廊父母预约【阿强师傅】抢修雨天跳电（已拍视频验收）",
  "🟢 14分钟前 · 甘文丁陈太太 给【阿发冷气王】打出 5.0★ 好评：“洗得超干净，没乱收Gas钱！”",
  "🟢 21分钟前 · 太平敏路郑伯伯 通过【3D打印实验室】配回1988年KDK古董风扇旋钮（仅花 RM30）",
  "🟢 29分钟前 · 新邦丰亿花园李先生 预约【通顺哥】疏通厨房水喉（一口价 RM60 包通）"
];
let tickerIndex = 0;

function initHeroAndTicker() {
  const tickerEl = document.getElementById("live-trust-ticker");
  if (tickerEl) {
    setInterval(() => {
      tickerIndex = (tickerIndex + 1) % LIVE_TICKER_MESSAGES.length;
      tickerEl.style.opacity = "0";
      setTimeout(() => {
        tickerEl.textContent = LIVE_TICKER_MESSAGES[tickerIndex];
        tickerEl.style.opacity = "1";
      }, 260);
    }, 4500);
  }
  updateTrustCountersUI();
}

function updateTrustCountersUI() {
  const sifuCountEl = document.getElementById("stat-sifu-count");
  const jobsTodayEl = document.getElementById("stat-jobs-today");
  const savedRmEl = document.getElementById("stat-saved-rm");

  if (sifuCountEl) sifuCountEl.textContent = "28";
  if (jobsTodayEl) jobsTodayEl.textContent = String(state.jobsResolvedToday);
  if (savedRmEl) savedRmEl.textContent = "RM " + state.totalSavedRM.toLocaleString();
}

function toggleElderMode() {
  state.elderMode = !state.elderMode;
  document.documentElement.classList.toggle("elder-mode", state.elderMode);
  const btn = document.getElementById("elder-mode-btn");
  const label = document.getElementById("elder-mode-label");
  if (btn && label) {
    if (state.elderMode) {
      btn.classList.add("bg-amber-400", "text-emerald-950", "ring-2", "ring-white");
      btn.classList.remove("bg-emerald-800/80", "text-amber-200");
      label.textContent = "👓 已开启长辈大字版 (点击还原)";
      showToast("👓 已开启【太平长辈亲切大字模式】，字体已放大加粗！");
    } else {
      btn.classList.remove("bg-amber-400", "text-emerald-950", "ring-2", "ring-white");
      btn.classList.add("bg-emerald-800/80", "text-amber-200");
      label.textContent = "👓 长辈大字模式";
      showToast("已切换回标准视图模式");
    }
  }
}

// --------------------------------------------------------------------------
// 10. MODULE 2: AI DIAGNOSTIC BOX (AI 拍照/语音秒估价诊断台)
// --------------------------------------------------------------------------
function renderPainCapsules() {
  const container = document.getElementById("pain-capsules-grid");
  if (!container) return;

  container.innerHTML = Object.values(PAIN_CATEGORIES).map(cat => {
    const isActive = state.selectedCategory === cat.id;
    return `
      <button
        type="button"
        onclick="selectPainCategory('${cat.id}')"
        class="pain-capsule elder-btn text-left p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col justify-between transition-all cursor-pointer ${
          isActive
            ? "active border-amber-400 bg-emerald-900 text-white"
            : "border-emerald-900/10 bg-white hover:border-emerald-600/40 text-slate-800 shadow-sm"
        }"
      >
        <div class="flex items-start justify-between gap-2 w-full mb-2">
          <span class="text-2xl sm:text-3xl leading-none select-none">${cat.icon}</span>
          <span class="capsule-badge text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            isActive
              ? "bg-amber-500/25 text-amber-200 border-amber-300/40"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }">
            ${cat.badge}
          </span>
        </div>
        <div>
          <div class="font-bold text-sm sm:text-base leading-snug elder-scale-text">${cat.shortTitle}</div>
          <div class="capsule-sub text-xs mt-0.5 ${isActive ? "text-amber-200" : "text-slate-500"}">${cat.enTitle}</div>
        </div>
      </button>
    `;
  }).join("");
}

function renderQuickSymptoms() {
  const cat = PAIN_CATEGORIES[state.selectedCategory];
  const container = document.getElementById("quick-symptoms-bar");
  if (!container || !cat) return;

  container.innerHTML = cat.quickSymptoms.map((sym) => {
    const selected = state.selectedSymptoms.includes(sym.label);
    return `
      <button
        type="button"
        onclick="toggleSymptomTag('${sym.label.replace(/'/g, "\\'")}')"
        class="text-xs sm:text-sm px-3 py-1.5 rounded-full border font-medium transition-all cursor-pointer ${
          selected
            ? "bg-amber-500 text-emerald-950 border-amber-600 font-bold shadow-sm"
            : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
        }"
      >
        ${selected ? "✓ " : "+ "}${sym.label}
      </button>
    `;
  }).join("");
}

function selectPainCategory(catId, customDescOverride = null) {
  if (!PAIN_CATEGORIES[catId]) return;
  state.selectedCategory = catId;
  const cat = PAIN_CATEGORIES[catId];
  state.selectedSymptoms = [cat.quickSymptoms[0].label];
  state.customDescription = customDescOverride || cat.defaultDesc;

  const descInput = document.getElementById("ai-desc-input");
  if (descInput) {
    descInput.value = state.customDescription;
  }

  renderPainCapsules();
  renderQuickSymptoms();
  if (state.activeSamplePhoto) {
    renderPhotoPreviewBox();
  }
  runAiValuation(false);
}

function toggleSymptomTag(symptomLabel) {
  const idx = state.selectedSymptoms.indexOf(symptomLabel);
  if (idx >= 0) {
    if (state.selectedSymptoms.length > 1) {
      state.selectedSymptoms.splice(idx, 1);
    }
  } else {
    state.selectedSymptoms.push(symptomLabel);
  }

  // Update description input cleanly to reflect chosen tags
  const descInput = document.getElementById("ai-desc-input");
  if (descInput) {
    const currentText = descInput.value.trim();
    if (!currentText.includes(symptomLabel)) {
      descInput.value = currentText
        ? `${currentText}（补充症状：${symptomLabel}）`
        : `家里遇到问题：${state.selectedSymptoms.join("、")}`;
      state.customDescription = descInput.value;
    }
  }

  renderQuickSymptoms();
  runAiValuation(false);
}

function handleAreaChange(areaId) {
  if (!TAIPING_AREAS[areaId]) return;
  state.selectedArea = areaId;
  const areaHintEl = document.getElementById("area-local-hint");
  if (areaHintEl) {
    const areaObj = TAIPING_AREAS[areaId];
    areaHintEl.innerHTML = `<span class="font-semibold text-emerald-900">📍 ${areaObj.name}街坊贴士：</span>${areaObj.houseNote}`;
  }
  runAiValuation(false);
}

// Photo Upload & Sample Case Photo Simulation
function handleUserPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  state.uploadedImageName = file.name;
  state.activeSamplePhoto = null;

  const reader = new FileReader();
  reader.onload = function(e) {
    state.uploadedImageDataUrl = e.target.result;
    renderPhotoPreviewBox();
    showToast("📸 照片已载入！AI 正在扫描损坏部位与零件型号...");
    runAiValuation(true);
  };
  reader.readAsDataURL(file);
}

function loadSampleCasePhoto() {
  const cat = PAIN_CATEGORIES[state.selectedCategory];
  state.uploadedImageDataUrl = null;
  state.uploadedImageName = null;
  state.activeSamplePhoto = cat.sampleImage;
  renderPhotoPreviewBox();
  showToast(`📸 已载入【${cat.sampleImage.title}】进行 AI 视觉估价演示！`);
  runAiValuation(true);
}

function clearPhotoAttachment() {
  state.uploadedImageDataUrl = null;
  state.uploadedImageName = null;
  state.activeSamplePhoto = null;
  const fileInput = document.getElementById("photo-file-input");
  if (fileInput) fileInput.value = "";
  renderPhotoPreviewBox();
  runAiValuation(false);
}

function renderPhotoPreviewBox() {
  const previewContainer = document.getElementById("photo-preview-container");
  if (!previewContainer) return;

  if (!state.uploadedImageDataUrl && !state.activeSamplePhoto) {
    previewContainer.classList.add("hidden");
    previewContainer.innerHTML = "";
    return;
  }

  previewContainer.classList.remove("hidden");
  const cat = PAIN_CATEGORIES[state.selectedCategory];
  const sampleInfo = state.activeSamplePhoto || cat.sampleImage;

  if (state.uploadedImageDataUrl) {
    previewContainer.innerHTML = `
      <div class="relative rounded-xl overflow-hidden border-2 border-emerald-600/40 bg-emerald-950/90 text-white p-3 flex items-center gap-3.5">
        <div class="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-amber-400/50">
          <img src="${state.uploadedImageDataUrl}" alt="Uploaded issue" class="w-full h-full object-cover" />
          <div class="ai-scan-line"></div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
            <span>🔍 AI 视觉病灶识别已完成</span>
          </div>
          <div class="text-sm font-bold truncate mt-0.5">已上传：${escapeHtml(state.uploadedImageName || "现场实拍照.jpg")}</div>
          <div class="text-xs text-emerald-100/90 mt-1 leading-relaxed">${sampleInfo.caption}</div>
        </div>
        <button type="button" onclick="clearPhotoAttachment()" class="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-amber-200 shrink-0 cursor-pointer">
          移除照片
        </button>
      </div>
    `;
  } else {
    previewContainer.innerHTML = `
      <div class="relative rounded-xl overflow-hidden border-2 border-amber-500/50 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-start sm:items-center gap-3">
          <div class="relative w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
            ${cat.icon}
            <div class="ai-scan-line"></div>
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full mb-1">
              <span>✨ 太平街坊真实案例视觉诊断</span>
            </div>
            <div class="text-sm font-bold text-white">${sampleInfo.title}</div>
            <div class="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">${sampleInfo.caption}</div>
          </div>
        </div>
        <button type="button" onclick="clearPhotoAttachment()" class="self-end sm:self-center text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-amber-200 shrink-0 cursor-pointer">
          关闭演示照
        </button>
      </div>
    `;
  }
}

// Simulated Voice Input (方言/华语语音识别)
let voiceIndex = 0;
function triggerVoiceSimulation() {
  const voiceBtn = document.getElementById("voice-input-btn");
  const voiceStatus = document.getElementById("voice-status-banner");
  if (!voiceBtn || !voiceStatus) return;

  const sample = VOICE_SAMPLES[voiceIndex % VOICE_SAMPLES.length];
  voiceIndex++;

  voiceStatus.classList.remove("hidden");
  voiceStatus.innerHTML = `
    <div class="flex items-center gap-2.5 text-amber-900 font-semibold text-xs sm:text-sm">
      <div class="flex items-center">
        <span class="voice-bar"></span>
        <span class="voice-bar"></span>
        <span class="voice-bar"></span>
        <span class="voice-bar"></span>
      </div>
      <span>🎙️ 正在聆听太平长辈语音（支持福建话 / 广东话 / 华语 / BM）...</span>
    </div>
  `;

  setTimeout(() => {
    // Apply recognized voice sample
    state.selectedCategory = sample.category;
    state.selectedArea = sample.area;
    state.customDescription = sample.text;
    const cat = PAIN_CATEGORIES[sample.category];
    state.selectedSymptoms = [cat.quickSymptoms[0].label];

    const areaSelect = document.getElementById("taiping-area-select");
    if (areaSelect) areaSelect.value = sample.area;
    handleAreaChange(sample.area);

    const descInput = document.getElementById("ai-desc-input");
    if (descInput) descInput.value = sample.text;

    renderPainCapsules();
    renderQuickSymptoms();

    voiceStatus.innerHTML = `
      <div class="flex items-center justify-between gap-2 text-emerald-900 text-xs sm:text-sm font-semibold">
        <span>✅ AI 语音转写成功（${sample.dialect}）：已自动定位【${TAIPING_AREAS[sample.area].name}】并匹配【${cat.shortTitle}】</span>
        <button type="button" onclick="document.getElementById('voice-status-banner').classList.add('hidden')" class="text-xs underline text-emerald-700 cursor-pointer">收起</button>
      </div>
    `;

    runAiValuation(true);
    showToast(`🎙️ 已识别语音并生成【${TAIPING_AREAS[sample.area].name}】AI 公道价报告！`);
  }, 950);
}

// Core AI Diagnostic & Fair Price Calculation Engine
function runAiValuation(animateScroll = false) {
  const descInput = document.getElementById("ai-desc-input");
  if (descInput) {
    state.customDescription = descInput.value.trim() || PAIN_CATEGORIES[state.selectedCategory].defaultDesc;
  }

  const cat = PAIN_CATEGORIES[state.selectedCategory];
  const area = TAIPING_AREAS[state.selectedArea] || TAIPING_AREAS.aulong;
  const text = state.customDescription.toLowerCase();

  // Compute dynamic price range based on selected symptoms & keywords in description
  let minPrice = cat.baseMin;
  let maxPrice = cat.baseMax;
  let matchedCauses = [];

  cat.quickSymptoms.forEach(sym => {
    if (state.selectedSymptoms.includes(sym.label)) {
      minPrice = Math.round((minPrice + sym.addPrice[0]) / 2);
      maxPrice = Math.max(maxPrice, sym.addPrice[1]);
      matchedCauses.push(sym.cause);
    }
  });

  // Keyword sensitivity adjustments
  if (text.includes("两架") || text.includes("2架") || text.includes("两台") || text.includes("全屋")) {
    minPrice = Math.round(minPrice * 1.45);
    maxPrice = Math.round(maxPrice * 1.55);
  }
  if (text.includes("半夜") || text.includes("紧急") || text.includes("烧焦") || text.includes("冒烟")) {
    matchedCauses.unshift("⚠️ 检测到【紧急电路/漏水风险】关键词：建议先拉下总掣或关闭总水阀，平台优先派驻附近15分钟应急师傅。");
  }
  if (state.uploadedImageDataUrl || state.activeSamplePhoto) {
    // Having a photo narrows down the price uncertainty!
    const spread = maxPrice - minPrice;
    if (spread > 30) {
      maxPrice = minPrice + Math.round(spread * 0.78);
    }
  }

  if (matchedCauses.length === 0) {
    matchedCauses.push(cat.quickSymptoms[0].cause);
  }

  // Find best recommended Sifu in or near that area & category
  const matchingSifus = state.sifus.filter(s => s.category === state.selectedCategory);
  const localMatch = matchingSifus.find(s => s.baseArea === state.selectedArea) || matchingSifus[0] || state.sifus[0];

  const report = {
    reportId: "TP-AI-" + Math.floor(10000 + Math.random() * 89999),
    categoryId: cat.id,
    categoryTitle: `${cat.icon} ${cat.shortTitle}`,
    areaId: area.id,
    areaName: area.name,
    areaEta: area.eta,
    areaNote: area.houseNote,
    userDescription: state.customDescription,
    symptoms: [...state.selectedSymptoms],
    minRM: minPrice,
    maxRM: maxPrice,
    minSGD: Math.max(8, Math.round(minPrice / 3.35)),
    maxSGD: Math.max(15, Math.round(maxPrice / 3.35)),
    inspectionFee: cat.inspectionFee,
    causes: matchedCauses,
    antiKetukWarning: cat.antiKetukWarning,
    recommendedSifu: localMatch,
    hasPhotoBonus: Boolean(state.uploadedImageDataUrl || state.activeSamplePhoto)
  };

  state.lastAiResult = report;
  renderAiResultCard(report);

  if (animateScroll) {
    const outEl = document.getElementById("ai-result-panel");
    if (outEl) {
      outEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

function renderAiResultCard(report) {
  const container = document.getElementById("ai-result-panel");
  if (!container || !report) return;

  const sifu = report.recommendedSifu;
  const photoBadge = report.hasPhotoBonus
    ? `<span class="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">📸 已结合照片精准收窄估价区间</span>`
    : `<span class="inline-flex items-center gap-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">💡 提示：上传照片可进一步精确RM区间</span>`;

  container.innerHTML = `
    <div class="rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 sm:p-6 shadow-xl border-2 border-amber-400/60 relative overflow-hidden">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/15">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="font-bold text-amber-300 text-sm sm:text-base tracking-wide">【AITAIPING AI 诊断报告 & 太平公道价参考】</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          ${photoBadge}
          <span class="text-xs text-emerald-200/80 font-mono">#${report.reportId}</span>
        </div>
      </div>

      <!-- Price & ETA Hero Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-4">
        <!-- Fair Price Box -->
        <div class="md:col-span-7 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-amber-400/40 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs uppercase tracking-wider text-amber-200 font-semibold">💰 太平街坊公道价参考区间（包人工+基础辅料）</span>
              <span class="text-[11px] bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded">官方最高限价保护</span>
            </div>
            <div class="mt-2 flex items-baseline gap-3 flex-wrap">
              <span class="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                RM ${report.minRM} – RM ${report.maxRM}
              </span>
              <span class="text-xs sm:text-sm text-emerald-200 font-medium">
                （新加坡游子参考：约 SGD $${report.minSGD} – $${report.maxSGD}）
              </span>
            </div>
          </div>
          <div class="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-100">
            <span>📋 上门检测规则：<strong class="text-amber-300">${report.inspectionFee}</strong></span>
            <span>🛡️ 承诺：先报价同意才动手 · 绝不坐地起价</span>
          </div>
        </div>

        <!-- Area ETA & Recommended Sifu Box -->
        <div class="md:col-span-5 bg-emerald-950/70 rounded-xl p-4 border border-white/15 flex flex-col justify-between">
          <div>
            <div class="text-xs text-emerald-300 font-semibold flex items-center justify-between">
              <span>📍 所在区域：${report.areaName}</span>
              <span class="text-amber-300 font-bold">⚡ 预计 ${report.areaEta} 到场</span>
            </div>
            <div class="mt-2.5 flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/10">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br ${sifu.avatarBg} flex items-center justify-center text-xl shrink-0 border border-amber-300/50">
                ${sifu.avatarEmoji}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs text-amber-300 font-semibold">AI 首选匹配太平老街坊师傅：</div>
                <div class="font-bold text-sm sm:text-base text-white truncate">${sifu.name} <span class="text-xs font-normal text-emerald-200">(${sifu.rating.toFixed(1)}★ · 已服务${sifu.jobsDone}户)</span></div>
              </div>
            </div>
          </div>
          <div class="mt-2.5 text-[11px] text-emerald-200/90 leading-snug">
            💬 师傅通晓：${sifu.dialects.join(" / ")} · 享平台 30 天官方保修
          </div>
        </div>
      </div>

      <!-- AI Root Cause & Anti-Ketuk Alert -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
        <div class="bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
            <span>🧠 AI 初步病因与太平屋况诊断：</span>
          </div>
          <ul class="text-xs sm:text-sm text-emerald-50 space-y-1.5 leading-relaxed elder-scale-text">
            ${report.causes.map(c => `<li class="flex items-start gap-1.5"><span class="text-amber-400 mt-0.5">•</span><span>${c}</span></li>`).join("")}
            <li class="flex items-start gap-1.5 text-emerald-200/90 text-xs pt-1 border-t border-white/10">
              <span>🏠</span><span>${report.areaNote}</span>
            </li>
          </ul>
        </div>

        <div class="bg-amber-500/15 rounded-xl p-3.5 border border-amber-400/40">
          <div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
            <span>🛡️ AITAIPING 防砍菜头（Anti-Ketuk）避坑提醒：</span>
          </div>
          <p class="text-xs sm:text-sm text-amber-50 leading-relaxed elder-scale-text">
            ${report.antiKetukWarning}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onclick="openBookingModal('${sifu.id}', false)"
          class="elder-btn flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer amber-pulse"
        >
          <span>📲 带上这份 AI 估价单 · 一键呼叫【${sifu.name}】</span>
        </button>
        <button
          type="button"
          onclick="openBookingModal('${sifu.id}', true)"
          class="elder-btn bg-white/15 hover:bg-white/25 text-amber-200 border border-amber-300/40 font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>💝 我是外地游子 · 代太平爸妈预约并要求视频验收</span>
        </button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 11. MODULE 3: VERIFIED SIFU DIRECTORY & RATING SYSTEM
// --------------------------------------------------------------------------
function setSifuCategoryFilter(category) {
  state.sifuFilterCategory = category;
  renderSifuCategoryTabs();
  renderSifuDirectory();
}

function handleSifuAreaFilter(areaId) {
  state.sifuFilterArea = areaId;
  renderSifuDirectory();
}

function handleSifuSearch(query) {
  state.sifuSearchQuery = query.trim().toLowerCase();
  renderSifuDirectory();
}

function renderSifuCategoryTabs() {
  const tabs = [
    { id: "all", label: "全部认证师傅 (6)" },
    { id: "electrical", label: "⚡ 跳电/电工抢修" },
    { id: "plumbing", label: "💧 捉漏水/通水喉" },
    { id: "aircond", label: "❄️ 洗冷气/补Gas" },
    { id: "legacy3d", label: "🖨️ 3D打印配绝版件" }
  ];
  const container = document.getElementById("sifu-category-tabs");
  if (!container) return;

  container.innerHTML = tabs.map(t => {
    const active = state.sifuFilterCategory === t.id;
    return `
      <button
        type="button"
        onclick="setSifuCategoryFilter('${t.id}')"
        class="px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
          active
            ? "bg-emerald-900 text-amber-300 shadow-md ring-2 ring-amber-400"
            : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-600"
        }"
      >
        ${t.label}
      </button>
    `;
  }).join("");
}

function renderSifuDirectory() {
  const grid = document.getElementById("sifu-directory-grid");
  if (!grid) return;

  const filtered = state.sifus.filter(s => {
    if (state.sifuFilterCategory !== "all" && s.category !== state.sifuFilterCategory) return false;
    if (state.sifuFilterArea !== "all" && s.baseArea !== state.sifuFilterArea) return false;
    if (state.sifuSearchQuery) {
      const hay = `${s.name} ${s.enName} ${s.categoryLabel} ${s.areaLabel} ${s.story} ${s.specialties.join(" ")}`.toLowerCase();
      if (!hay.includes(state.sifuSearchQuery)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl p-8 text-center border border-slate-200">
        <div class="text-4xl mb-2">🔍</div>
        <div class="font-bold text-slate-800 text-base">该筛选条件下暂无匹配的师傅</div>
        <p class="text-xs text-slate-500 mt-1">所有太平师傅均可跨区支援（后廊/保阁亚三/甘文丁/新邦/市区），建议切换为“全部区域”查看。</p>
        <button type="button" onclick="setSifuCategoryFilter('all'); handleSifuAreaFilter('all');" class="mt-4 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
          重置筛选条件
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(sifu => {
    const starsHtml = "★".repeat(Math.round(sifu.rating));
    const latestReview = sifu.reviews[0];
    return `
      <article class="sifu-card bg-white rounded-2xl border-2 border-emerald-900/10 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <!-- Card Top Banner -->
          <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-4 relative">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${sifu.avatarBg} border-2 border-amber-400 flex items-center justify-center text-3xl shadow-md shrink-0">
                  ${sifu.avatarEmoji}
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-extrabold text-base sm:text-lg text-white leading-tight">${sifu.name}</h3>
                    <span class="text-[11px] bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                      ${sifu.ageYears}
                    </span>
                  </div>
                  <div class="text-xs text-amber-200 font-medium mt-0.5">${sifu.categoryLabel}</div>
                  <div class="text-[11px] text-emerald-200 mt-0.5">📍 ${sifu.areaLabel}</div>
                </div>
              </div>

              <!-- Rating Pill -->
              <div class="bg-white/10 backdrop-blur-sm border border-amber-400/40 rounded-xl px-2.5 py-1.5 text-right shrink-0">
                <div class="text-amber-300 font-extrabold text-sm sm:text-base leading-none">${sifu.rating.toFixed(1)} <span class="text-xs">${starsHtml}</span></div>
                <div class="text-[10px] text-emerald-100 mt-1">${sifu.reviewCount} 条街坊实评</div>
              </div>
            </div>

            <!-- Trust Badges Row -->
            <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10">
              ${sifu.badges.map(b => `
                <span class="inline-flex items-center gap-1 text-[11px] bg-emerald-950/70 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-md font-semibold">
                  🛡️ ${b}
                </span>
              `).join("")}
              <span class="ml-auto text-xs font-bold text-emerald-200">🤝 已服务 <strong class="text-amber-300">${sifu.jobsDone}</strong> 户</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 space-y-3.5">
            <!-- Specialties & Languages -->
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div class="flex flex-wrap gap-1.5">
                ${sifu.specialties.map(sp => `
                  <span class="bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium">${sp}</span>
                `).join("")}
              </div>
            </div>

            <div class="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
              <span class="text-slate-600">🗣️ 沟通语言：<strong class="text-slate-800">${sifu.dialects.join(" / ")}</strong></span>
              <span class="font-extrabold text-emerald-800">参考起步：${sifu.startingPrice}</span>
            </div>

            <!-- Artisan Story (匠人小故事) -->
            <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 relative">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                  <span>🏮 太平匠人小故事</span>
                </span>
                <span class="taiping-stamp text-[10px] font-extrabold px-1.5 py-0.5 rounded">AITAIPING 实名认证</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed elder-scale-text">
                ${sifu.story}
              </p>
            </div>

            <!-- Latest Neighbor Review -->
            ${latestReview ? `
              <div class="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-xs font-bold text-emerald-950">💬 ${escapeHtml(latestReview.author)}</span>
                  <span class="text-[11px] bg-emerald-800 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    #${escapeHtml(latestReview.tag)}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed elder-scale-text">
                  “${escapeHtml(latestReview.comment)}”
                </p>
                <div class="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                  <span>评分：${"⭐".repeat(latestReview.rating)}</span>
                  <span>${escapeHtml(latestReview.date)}</span>
                </div>
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Anti-Bypass Action Footer -->
        <div class="p-4 pt-0 space-y-2">
          <!-- Masked Number Notice -->
          <div class="flex items-center justify-between text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>🔒 师傅专线：<strong class="font-mono text-slate-700">012-588 ****</strong>（防私单乱开价保护中）</span>
            <span class="text-emerald-800 font-bold">官方承保30天</span>
          </div>

          <div class="grid grid-cols-12 gap-2">
            <button
              type="button"
              onclick="openBookingModal('${sifu.id}', false)"
              class="elder-btn col-span-8 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-extrabold text-xs sm:text-sm py-3 px-3 rounded-xl shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>📲 呼叫师傅 / 预约上门</span>
            </button>
            <button
              type="button"
              onclick="openRatingModal('${sifu.id}')"
              class="elder-btn col-span-4 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm py-3 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <span>⭐ 街坊打星</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// --------------------------------------------------------------------------
// 12. RATING & REVIEW INTERACTION MODAL (给师傅提交模拟评价)
// --------------------------------------------------------------------------
const PRAISE_TAGS = [
  "价钱公道没砍菜头",
  "对老人家很有耐心",
  "手脚麻利又干净",
  "福建话沟通超亲切",
  "拍视频给外地子女超放心",
  "大雨天也准时赶到"
];

function openRatingModal(sifuId) {
  const sifu = state.sifus.find(s => s.id === sifuId);
  if (!sifu) return;

  state.ratingModal = {
    open: true,
    sifuId: sifu.id,
    stars: 5,
    selectedTags: ["价钱公道没砍菜头", "对老人家很有耐心"],
    neighborName: "",
    neighborArea: TAIPING_AREAS[state.selectedArea].name,
    comment: ""
  };

  renderRatingModalContent();
  const modal = document.getElementById("rating-modal-backdrop");
  if (modal) modal.classList.remove("hidden");
}

function closeRatingModal() {
  state.ratingModal.open = false;
  const modal = document.getElementById("rating-modal-backdrop");
  if (modal) modal.classList.add("hidden");
}

function setRatingStars(count) {
  state.ratingModal.stars = count;
  renderRatingModalContent();
}

function toggleRatingPraiseTag(tag) {
  const list = state.ratingModal.selectedTags;
  const idx = list.indexOf(tag);
  if (idx >= 0) {
    if (list.length > 1) list.splice(idx, 1);
  } else {
    list.push(tag);
  }
  renderRatingModalContent();
}

function renderRatingModalContent() {
  const sifu = state.sifus.find(s => s.id === state.ratingModal.sifuId);
  const body = document.getElementById("rating-modal-body");
  if (!sifu || !body) return;

  const starDescriptions = {
    5: "5.0 ★ 超赞！正宗太平老实匠人，强烈推荐给街坊！",
    4: "4.0 ★ 满意，收费合理、手艺不错",
    3: "3.0 ★ 一般，还有进步空间",
    2: "2.0 ★ 不太满意",
    1: "1.0 ★ 差评（平台将介入调查）"
  };

  body.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${sifu.avatarBg} text-white flex items-center justify-center text-2xl">
          ${sifu.avatarEmoji}
        </div>
        <div>
          <div class="text-xs text-emerald-700 font-bold">您正在为太平认证匠人打分：</div>
          <div class="font-extrabold text-base text-emerald-950">${sifu.name} <span class="text-xs font-normal text-slate-500">(${sifu.categoryLabel})</span></div>
        </div>
      </div>

      <!-- Star Picker -->
      <div class="text-center bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
        <div class="text-xs font-bold text-amber-900 mb-2">点击星星为师傅手艺与公道价打分：</div>
        <div class="flex items-center justify-center gap-2">
          ${[1, 2, 3, 4, 5].map(n => `
            <button
              type="button"
              onclick="setRatingStars(${n})"
              class="text-3xl sm:text-4xl transition-transform hover:scale-110 cursor-pointer ${
                n <= state.ratingModal.stars ? "text-amber-400 drop-shadow-sm" : "text-slate-300"
              }"
            >★</button>
          `).join("")}
        </div>
        <div class="text-xs font-bold text-emerald-900 mt-1.5">${starDescriptions[state.ratingModal.stars]}</div>
      </div>

      <!-- Quick Praise Tags -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">选择太平街坊印象标签（可多选）：</label>
        <div class="flex flex-wrap gap-1.5">
          ${PRAISE_TAGS.map(tag => {
            const active = state.ratingModal.selectedTags.includes(tag);
            return `
              <button
                type="button"
                onclick="toggleRatingPraiseTag('${tag}')"
                class="text-xs px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition-all ${
                  active
                    ? "bg-emerald-900 text-amber-300 border-emerald-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-emerald-700"
                }"
              >
                ${active ? "✓ " : "+ "}${tag}
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Neighbor Name & Area -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">您的街坊称呼（选填）：</label>
          <input
            id="rating-neighbor-name"
            type="text"
            placeholder="例：后廊陈太太 / 新加坡游子阿明"
            value="${escapeHtml(state.ratingModal.neighborName)}"
            oninput="state.ratingModal.neighborName = this.value"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">所在太平花园 / Kampung：</label>
          <select
            id="rating-neighbor-area"
            onchange="state.ratingModal.neighborArea = this.value"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700 bg-white"
          >
            ${Object.values(TAIPING_AREAS).map(a => `
              <option value="${a.name}" ${state.ratingModal.neighborArea === a.name ? "selected" : ""}>${a.name}</option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- Review Textarea -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">写下您的真实维修体验（帮更多太平街坊避坑）：</label>
        <textarea
          id="rating-comment-input"
          rows="3"
          placeholder="例：师傅准时上门，价钱跟 AI 算的公道价一样，没有乱开价，还帮我妈把冲凉房打扫干净！"
          oninput="state.ratingModal.comment = this.value"
          class="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:border-emerald-700"
        >${escapeHtml(state.ratingModal.comment)}</textarea>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onclick="closeRatingModal()"
          class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs sm:text-sm font-bold cursor-pointer"
        >
          取消
        </button>
        <button
          type="button"
          onclick="submitSifuRating()"
          class="bg-gradient-to-r from-emerald-900 to-emerald-700 hover:from-emerald-800 hover:to-emerald-600 text-amber-300 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow cursor-pointer"
        >
          ✨ 提交太平街坊真实评价
        </button>
      </div>
    </div>
  `;
}

function submitSifuRating() {
  const sifu = state.sifus.find(s => s.id === state.ratingModal.sifuId);
  if (!sifu) return;

  const authorName = (state.ratingModal.neighborName || "热心街坊").trim();
  const areaLabel = state.ratingModal.neighborArea || "太平";
  const chosenTag = state.ratingModal.selectedTags[0] || "价钱公道没砍菜头";
  const commentText = (state.ratingModal.comment || `师傅服务态度超好，${state.ratingModal.selectedTags.join("，")}，完全按照AITAIPING公道价收费！`).trim();

  // Update rating math
  const totalScore = sifu.rating * sifu.reviewCount + state.ratingModal.stars;
  sifu.reviewCount += 1;
  sifu.jobsDone += 1;
  sifu.rating = Math.min(5.0, Math.round((totalScore / sifu.reviewCount) * 10) / 10);

  sifu.reviews.unshift({
    author: `${areaLabel} · ${authorName}`,
    tag: chosenTag,
    rating: state.ratingModal.stars,
    date: "刚刚 · 街坊实评",
    comment: commentText
  });

  saveSifusToStorage();
  state.jobsResolvedToday += 1;
  state.totalSavedRM += 85;
  updateTrustCountersUI();
  renderSifuDirectory();
  closeRatingModal();
  showToast(`🎉 感谢您的街坊评价！${sifu.name} 的口碑积分已实时更新！`);
}

// --------------------------------------------------------------------------
// 13. MODULE 4: ANTI-BYPASS WHATSAPP CONCIERGE FLOW (防飞单·官方担保一键呼叫闭环)
// --------------------------------------------------------------------------
function openBookingModal(sifuId = "auto", isFilialMode = false, customPrefillDesc = null) {
  if (!state.lastAiResult) {
    runAiValuation(false);
  }
  if (customPrefillDesc) {
    state.customDescription = customPrefillDesc;
    const descInput = document.getElementById("ai-desc-input");
    if (descInput) descInput.value = customPrefillDesc;
    runAiValuation(false);
  }

  state.bookingModal.open = true;
  state.bookingModal.sifuId = sifuId || (state.lastAiResult ? state.lastAiResult.recommendedSifu.id : "sifu_keong");
  state.bookingModal.isFilialMode = Boolean(isFilialMode);

  renderBookingModalContent();
  const modal = document.getElementById("booking-modal-backdrop");
  if (modal) modal.classList.remove("hidden");
}

function closeBookingModal() {
  state.bookingModal.open = false;
  const modal = document.getElementById("booking-modal-backdrop");
  if (modal) modal.classList.add("hidden");
}

function toggleBookingFilialMode(isFilial) {
  state.bookingModal.isFilialMode = isFilial;
  renderBookingModalContent();
}

function buildStructuredWhatsAppMessage() {
  const report = state.lastAiResult;
  const areaObj = TAIPING_AREAS[state.selectedArea] || TAIPING_AREAS.aulong;
  const sifu = state.sifus.find(s => s.id === state.bookingModal.sifuId) || report.recommendedSifu;

  const modeTitle = state.bookingModal.isFilialMode
    ? "💝【太平游子孝心远程代订 · 视频验收担保单】"
    : "🛡️【AITAIPING 太平人官方担保预约单】";

  const callerLine = state.bookingModal.callerName
    ? `👤 预约人称呼：${state.bookingModal.callerName}`
    : `👤 预约人称呼：太平街坊 / 游子`;

  const addressLine = state.bookingModal.parentAddressDetail
    ? `🏠 详细门牌/地标：${state.bookingModal.parentAddressDetail}`
    : `🏠 所在花园/新村：${areaObj.name} (${areaObj.sub.split("/")[0].trim()})`;

  const filialRule = state.bookingModal.isFilialMode
    ? `\n📹 游子特别叮嘱：家里是长辈开门，请师傅【切勿向老人家收现金】，修好后拍 15 秒验收视频发我 WhatsApp 确认后，我直接线上 Touch'n Go / DuitNow 过账。`
    : `\n🛡️ 官方保障要求：请按 AITAIPING 公道价区间先报价后施工，激活 30 天官方售后保修。`;

  return [
    modeTitle,
    `--------------------------------`,
    `📋 诊断编号：#${report.reportId}`,
    `🔧 报修项目：${report.categoryTitle}`,
    `📝 问题详情：${state.customDescription}`,
    `💰 AI公道价参考：RM ${report.minRM} - RM ${report.maxRM}`,
    `--------------------------------`,
    `📍 太平区域：${areaObj.name}（预计 ${areaObj.eta} 抵达）`,
    addressLine,
    `👨‍🔧 指定认证师傅：${sifu.name} (${sifu.rating.toFixed(1)}★)`,
    `⏰ 期望上门时间：${state.bookingModal.preferredTime}`,
    callerLine,
    filialRule
  ].join("\n");
}

function renderBookingModalContent() {
  const body = document.getElementById("booking-modal-body");
  if (!body) return;
  const report = state.lastAiResult;
  const selectedSifu = state.sifus.find(s => s.id === state.bookingModal.sifuId) || report.recommendedSifu;
  const waText = buildStructuredWhatsAppMessage();
  const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  body.innerHTML = `
    <div class="space-y-4">
      <!-- Anti-Bypass Security Banner -->
      <div class="bg-emerald-950 text-white p-3.5 rounded-xl border border-amber-400/50 flex items-start gap-3">
        <span class="text-2xl shrink-0">🛡️</span>
        <div class="text-xs leading-relaxed">
          <div class="font-extrabold text-amber-300 text-sm">为什么通过 AITAIPING 官方调度台呼叫？</div>
          <p class="text-emerald-100 mt-0.5">
            私下交易无价格上限且无售后。通过官方 WhatsApp 派单，系统将<strong>锁定 AI 公道价区间（RM ${report.minRM}–RM ${report.maxRM}）</strong>，并自动为您生成 <strong>30 天免费返修电子保单</strong>！
          </p>
        </div>
      </div>

      <!-- Mode Switch: Local vs Outstation Filial -->
      <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          type="button"
          onclick="toggleBookingFilialMode(false)"
          class="py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            !state.bookingModal.isFilialMode
              ? "bg-emerald-900 text-amber-300 shadow"
              : "text-slate-600 hover:text-slate-900"
          }"
        >
          🏠 我在太平本地自住
        </button>
        <button
          type="button"
          onclick="toggleBookingFilialMode(true)"
          class="py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            state.bookingModal.isFilialMode
              ? "bg-amber-500 text-emerald-950 shadow"
              : "text-slate-600 hover:text-slate-900"
          }"
        >
          💝 我是外地游子(代父母订)
        </button>
      </div>

      <!-- Booking Form Controls -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">📍 所在太平花园 / Kampung：</label>
          <select
            onchange="handleAreaChange(this.value); renderBookingModalContent();"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            ${Object.values(TAIPING_AREAS).map(a => `
              <option value="${a.id}" ${state.selectedArea === a.id ? "selected" : ""}>${a.name}</option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">👨‍🔧 选择指派太平师傅：</label>
          <select
            onchange="state.bookingModal.sifuId = this.value; renderBookingModalContent();"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            ${state.sifus.map(s => `
              <option value="${s.id}" ${selectedSifu.id === s.id ? "selected" : ""}>
                ${s.name} (${s.rating.toFixed(1)}★ · ${s.categoryLabel.split("·")[0].trim()})
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            ${state.bookingModal.isFilialMode ? "👤 您的称呼 & 太平爸妈称呼：" : "👤 您的街坊称呼："}
          </label>
          <input
            type="text"
            placeholder="${state.bookingModal.isFilialMode ? "例：KL阿伟（爸妈住后廊：林伯伯）" : "例：保阁亚三陈太太"}"
            value="${escapeHtml(state.bookingModal.callerName)}"
            oninput="state.bookingModal.callerName = this.value; updateBookingPreviewOnly();"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">⏰ 期望上门时间：</label>
          <select
            onchange="state.bookingModal.preferredTime = this.value; renderBookingModalContent();"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            <option value="⚡ 紧急抢修（希望 30 分钟内联络上门）" ${state.bookingModal.preferredTime.includes("紧急") ? "selected" : ""}>⚡ 紧急抢修（30分钟内响应）</option>
            <option value="🌤️ 今天下午（2:00 PM - 6:00 PM）" ${state.bookingModal.preferredTime.includes("今天下午") ? "selected" : ""}>🌤️ 今天下午（2:00 PM - 6:00 PM）</option>
            <option value="🌅 明天上午（9:00 AM - 12:30 PM）" ${state.bookingModal.preferredTime.includes("明天上午") ? "selected" : ""}>🌅 明天上午（9:00 AM - 12:30 PM）</option>
            <option value="📅 周末预约（提前安排时间）" ${state.bookingModal.preferredTime.includes("周末") ? "selected" : ""}>📅 周末预约（提前安排时间）</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">🏠 太平门牌或附近熟悉地标（选填，方便师傅更快找到）：</label>
        <input
          type="text"
          placeholder="例：靠近后廊巴刹第5巷 / 保阁亚三华小对面排屋"
          value="${escapeHtml(state.bookingModal.parentAddressDetail)}"
          oninput="state.bookingModal.parentAddressDetail = this.value; updateBookingPreviewOnly();"
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
        />
      </div>

      <!-- Structured WhatsApp Pre-filled Message Preview -->
      <div class="bg-emerald-50/90 rounded-xl p-3.5 border-2 border-emerald-700/30">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
            <span>💬 已为您自动打包结构化 WhatsApp 预填消息：</span>
          </span>
          <button
            type="button"
            onclick="copyWhatsAppMessage()"
            class="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
          >
            📋 复制文字
          </button>
        </div>
        <pre id="wa-preview-box" class="text-xs font-mono text-slate-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-emerald-200 max-h-44 overflow-y-auto leading-relaxed">${escapeHtml(waText)}</pre>
      </div>

      <!-- Primary WhatsApp Launch CTA -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        <a
          id="wa-direct-link"
          href="${waUrl}"
          target="_blank"
          rel="noopener noreferrer"
          onclick="recordDispatchOrder()"
          class="elder-btn flex-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-center cursor-pointer"
        >
          <span>🟢 一键唤起 WhatsApp 发送给 AITAIPING 官方调度台</span>
        </a>
        <button
          type="button"
          onclick="closeBookingModal()"
          class="py-3 px-4 rounded-xl border border-slate-300 text-slate-600 text-xs sm:text-sm font-bold cursor-pointer"
        >
          稍后再约
        </button>
      </div>
    </div>
  `;
}

function updateBookingPreviewOnly() {
  const waText = buildStructuredWhatsAppMessage();
  const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
  const pre = document.getElementById("wa-preview-box");
  const link = document.getElementById("wa-direct-link");
  if (pre) pre.textContent = waText;
  if (link) link.href = waUrl;
}

function copyWhatsAppMessage() {
  const waText = buildStructuredWhatsAppMessage();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(waText).then(() => {
      showToast("📋 预约单文字已复制！可直接粘贴发送至 WhatsApp。");
    });
  } else {
    showToast("📋 预约单已准备就绪，请点击绿色按钮唤起 WhatsApp！");
  }
}

function recordDispatchOrder() {
  state.jobsResolvedToday += 1;
  updateTrustCountersUI();
  showToast("🟢 正在唤起 WhatsApp 连接 AITAIPING 太平官方调度台（已锁定公道价与30天保修）！");
}

// --------------------------------------------------------------------------
// 14. MODULE 5: OUTSTATION CHILDREN ZONE & 3D PRINTING LAB
// --------------------------------------------------------------------------
function setCurrencyMode(mode) {
  state.currencyMode = mode;
  renderFilialPackages();
}

function renderFilialPackages() {
  const container = document.getElementById("filial-packages-grid");
  const btnMyr = document.getElementById("curr-btn-myr");
  const btnSgd = document.getElementById("curr-btn-sgd");
  if (!container) return;

  if (btnMyr && btnSgd) {
    if (state.currencyMode === "MYR") {
      btnMyr.className = "px-3 py-1.5 rounded-lg text-xs font-extrabold bg-amber-400 text-emerald-950 shadow cursor-pointer";
      btnSgd.className = "px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-100 hover:text-white cursor-pointer";
    } else {
      btnSgd.className = "px-3 py-1.5 rounded-lg text-xs font-extrabold bg-amber-400 text-emerald-950 shadow cursor-pointer";
      btnMyr.className = "px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-100 hover:text-white cursor-pointer";
    }
  }

  container.innerHTML = FILIAL_PACKAGES.map(pkg => {
    const priceDisplay = state.currencyMode === "SGD"
      ? `SGD $${pkg.priceSGD} <span class="text-xs font-normal text-emerald-200">(折合 RM ${pkg.priceMYR})</span>`
      : `RM ${pkg.priceMYR} <span class="text-xs font-normal text-emerald-200">(约 SGD $${pkg.priceSGD})</span>`;

    return `
      <div class="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/60 transition-all">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold">
              ${pkg.badge}
            </span>
            <span class="text-xs text-emerald-200 font-semibold">📹 包拍视频验收</span>
          </div>
          <h4 class="font-extrabold text-base text-white leading-snug">${pkg.title}</h4>
          <p class="text-xs text-emerald-100/90 mt-2 leading-relaxed elder-scale-text">${pkg.desc}</p>
        </div>

        <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div class="text-[10px] text-amber-200 uppercase">游子一口价担保</div>
            <div class="text-xl font-extrabold text-amber-400">${priceDisplay}</div>
          </div>
          <button
            type="button"
            onclick="selectPainCategory('${pkg.category}', '${pkg.prefillText.replace(/'/g, "\\'")}'); openBookingModal('auto', true, '${pkg.prefillText.replace(/'/g, "\\'")}');"
            class="elder-btn bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow cursor-pointer shrink-0"
          >
            💝 一键替爸妈预约
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function select3dLegacyItem(itemId) {
  state.active3dTab = itemId;
  render3dLegacyLab();
}

function render3dLegacyLab() {
  const tabsEl = document.getElementById("legacy-3d-tabs");
  const detailEl = document.getElementById("legacy-3d-detail");
  if (!tabsEl || !detailEl) return;

  const activeItem = LEGACY_3D_ITEMS.find(i => i.id === state.active3dTab) || LEGACY_3D_ITEMS[0];

  tabsEl.innerHTML = LEGACY_3D_ITEMS.map(item => {
    const isSelected = item.id === activeItem.id;
    return `
      <button
        type="button"
        onclick="select3dLegacyItem('${item.id}')"
        class="text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
          isSelected
            ? "bg-emerald-900 text-white border-amber-400 shadow-md"
            : "bg-white text-slate-800 border-slate-200 hover:border-emerald-600/50"
        }"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-extrabold px-2 py-0.5 rounded ${
            isSelected ? "bg-amber-400 text-emerald-950" : "bg-emerald-50 text-emerald-800"
          }">${item.tag}</span>
          <span class="text-xs font-bold ${isSelected ? "text-amber-300" : "text-emerald-700"}">${item.savedAmount}</span>
        </div>
        <div class="font-bold text-sm mt-1.5 leading-snug">${item.title}</div>
      </button>
    `;
  }).join("");

  detailEl.innerHTML = `
    <div class="bg-white rounded-2xl border-2 border-emerald-900/15 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <span class="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🖨️ AITAIPING 3D 逆向工程实验室 · ${activeItem.tag}
          </span>
          <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            ⏱️ 太平本地 4–12 小时打印交付
          </span>
        </div>

        <h4 class="font-extrabold text-lg sm:text-xl text-slate-900 mt-3">${activeItem.title}</h4>
        <p class="text-xs text-slate-500 mt-1">${activeItem.era}</p>

        <div class="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div class="text-xs font-bold text-slate-700">🔍 太平老屋痛点真相：</div>
          <p class="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed elder-scale-text">${activeItem.problem}</p>
        </div>

        <!-- Before / After Price Comparison -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div class="bg-red-50/80 border border-red-200 rounded-xl p-3.5">
            <div class="text-xs font-extrabold text-red-800">❌ 传统做法（被迫丢掉换新）</div>
            <div class="text-sm font-bold text-red-900 mt-1">${activeItem.marketTrap}</div>
          </div>
          <div class="bg-emerald-50 border-2 border-emerald-600/40 rounded-xl p-3.5">
            <div class="text-xs font-extrabold text-emerald-900">✅ AITAIPING 3D打印复活价</div>
            <div class="text-sm font-extrabold text-emerald-800 mt-1">${activeItem.aiTaipingPrice}</div>
          </div>
        </div>

        <div class="mt-3 text-xs text-slate-600 bg-amber-50/60 px-3 py-2 rounded-lg border border-amber-200/70">
          🛠️ <strong>打印材质规格：</strong>${activeItem.material}
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onclick="trigger3dCustomDiagnostic('${activeItem.id}')"
          class="elder-btn flex-1 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>📸 我家也有这个坏零件 · 立即放入 AI 诊断台估价</span>
        </button>
        <button
          type="button"
          onclick="openBookingModal('sifu_jay', false, '${activeItem.presetDesc.replace(/'/g, "\\'")}')"
          class="elder-btn bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl cursor-pointer"
        >
          <span>👨‍🔧 直接呼叫创客阿杰</span>
        </button>
      </div>
    </div>
  `;
}

function trigger3dCustomDiagnostic(itemId) {
  const item = LEGACY_3D_ITEMS.find(i => i.id === itemId) || LEGACY_3D_ITEMS[0];
  selectPainCategory("legacy3d", item.presetDesc);
  loadSampleCasePhoto();
  const diagSection = document.getElementById("module-ai-diagnostic");
  if (diagSection) {
    diagSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// --------------------------------------------------------------------------
// 15. UTILITIES & TOAST NOTIFICATIONS
// --------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("global-toast");
  const textEl = document.getElementById("global-toast-text");
  if (!toast || !textEl) return;

  textEl.textContent = message;
  toast.classList.remove("hidden", "translate-y-4", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.classList.add("hidden"), 250);
  }, 3600);
}

// --------------------------------------------------------------------------
// 16. BOOTSTRAP ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadSifusFromStorage();
  initHeroAndTicker();
  renderPainCapsules();
  renderQuickSymptoms();
  handleAreaChange(state.selectedArea);
  runAiValuation(false);
  renderSifuCategoryTabs();
  renderSifuDirectory();
  renderFilialPackages();
  render3dLegacyLab();
});
