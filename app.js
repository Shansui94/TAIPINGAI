/* ==========================================================================
   TAIPINGAI 太平人 · AITAIPING 爱太平
   Minimalist Core State & Interactive Logic (app.js)
   ========================================================================== */

const OFFICIAL_WHATSAPP_NUMBER = "60125880099";

// 1. 太平区域数据
const TAIPING_AREAS = {
  aulong: { id: "aulong", name: "Aulong 后廊", eta: "15分钟上门" },
  pokok_assam: { id: "pokok_assam", name: "Pokok Assam 保阁亚三", eta: "15分钟上门" },
  kamunting: { id: "kamunting", name: "Kamunting 甘文丁", eta: "20分钟上门" },
  simpang: { id: "simpang", name: "Simpang 新邦", eta: "20分钟上门" },
  taiping_town: { id: "taiping_town", name: "Taiping Town 太平市区", eta: "10分钟上门" }
};

// 2. 四大高频痛点与 AI 估价知识库
const PAIN_CATEGORIES = {
  electrical: {
    id: "electrical",
    icon: "⚡",
    title: "跳电/电箱抢修",
    startPrice: "RM 50 起",
    defaultSymptom: "下雨天电箱(ELCB)跳电推不上",
    symptoms: [
      { label: "下雨天电箱(ELCB)跳电推不上", range: [60, 120], tip: "多为室外插座受潮或ELCB断路器老化，换单个SIRIM断路器即可，无需全屋重拉电线。" },
      { label: "冲凉房热水器没电/跳掣", range: [70, 140], tip: "常见为双极开关(Double Pole)烧焦或接线松动，标准更换约30分钟完成。" },
      { label: "电箱有烧焦味/插座没电", range: [80, 160], tip: "MCB保险丝接点氧化发热，建议尽快紧固或更换对应回路MCB。" },
      { label: "换LED光管/吊扇/加插座", range: [45, 100], tip: "按点位明码实价计算人工，绝不中途乱加收辅料费。" }
    ]
  },
  plumbing: {
    id: "plumbing",
    icon: "💧",
    title: "捉漏水/通水喉",
    startPrice: "RM 45 起",
    defaultSymptom: "屋顶大水箱(Tangki)满水直漏",
    symptoms: [
      { label: "屋顶大水箱(Tangki)满水直漏", range: [65, 130], tip: "蓄水箱浮球阀(Float Valve)生锈卡死，更换耐腐蚀铜/ABS浮球阀即可解决。" },
      { label: "马桶水箱一直流水停不了", range: [50, 100], tip: "进水阀或止水胶圈老化，直接换阀芯即可（老式停产水箱可配3D打印件）。" },
      { label: "厨房/冲凉房塞水喉通渠", range: [60, 120], tip: "采用专业弹簧机一口价包通，严禁外面“按药水瓶数乱收费”的套路。" },
      { label: "水龙头滴水/加压水泵响不停", range: [50, 140], tip: "更换水龙头阀芯或检修水泵压力开关，先报价后动工。" }
    ]
  },
  aircond: {
    id: "aircond",
    icon: "❄️",
    title: "洗冷气/不冷",
    startPrice: "RM 70 起",
    defaultSymptom: "1.0-1.5HP 冷气药水全拆洗",
    symptoms: [
      { label: "1.0-1.5HP 冷气药水全拆洗", range: [80, 120], tip: "含拆洗风轮、抗菌除霉与高压疏通排水管，绝不借口“少Gas”乱收雪种钱。" },
      { label: "冷气机室内滴水/结冰", range: [60, 100], tip: "太平湿度高导致排水槽青苔果冻状堵塞，清通冷凝管即可根治。" },
      { label: "有风但不冷/外机没启动", range: [75, 150], tip: "多为外机启动电容(Capacitor)老化，换颗电容即可恢复冷度。" },
      { label: "2架冷气街坊优惠洗", range: [140, 190], tip: "两台同行享街坊团购价，免费附赠全屋电箱安全巡检。" }
    ]
  },
  legacy3d: {
    id: "legacy3d",
    icon: "🖨️",
    title: "3D打印配老零件",
    startPrice: "RM 25 起",
    defaultSymptom: "古董KDK/National风扇旋钮齿轮",
    symptoms: [
      { label: "古董KDK/National风扇旋钮齿轮", range: [25, 45], tip: "老风扇铜马达极耐用，3D打印高韧性PETG旋钮/尼龙齿轮即可复活，省下买新扇RM250。" },
      { label: "绝版老式马桶水箱拉杆/按钮", range: [35, 60], tip: "1:1逆向建模打印耐水压ABS零件，免去敲砖换整个马桶（立省RM500+）。" },
      { label: "老屋百叶窗卡扣/推拉门滑轮", range: [20, 45], tip: "采用抗日晒ASA工程材料复刻老屋绝版门窗配件，保留老宅原貌。" }
    ]
  }
};

// 3. 太平认证师傅红榜（精炼高信噪比卡片数据）
const INITIAL_SIFUS = [
  {
    id: "sifu_keong",
    name: "后廊阿强师傅",
    role: "24年太平老电工",
    category: "electrical",
    categoryTag: "⚡ 跳电抢修 · 电箱改造",
    area: "aulong",
    areaName: "Aulong 后廊",
    dialects: "福建话 / 华语 / BM",
    rating: 4.9,
    jobs: 428,
    avatar: "👨‍🔧",
    story: "后廊新村长大，坚持“换粒RM70断路器能搞定，绝不忽悠老人家花两千块重拉电线”。",
    review: "“大雨天跳电20分钟就赶到，换了开关才收RM65，还顺手帮我妈检查神台电线！” — 后廊林阿姨"
  },
  {
    id: "sifu_tan",
    name: "保阁亚三陈 Uncle",
    role: "31年水喉捉漏老行尊",
    category: "plumbing",
    categoryTag: "💧 屋顶水箱 · 暗管捉漏",
    area: "pokok_assam",
    areaName: "Pokok Assam 保阁亚三",
    dialects: "福建话 / 华语 / 潮州话",
    rating: 5.0,
    jobs: 516,
    avatar: "🧓",
    story: "摸过太平上千间老排屋水管，凭听音杆定位暗漏，免敲冤枉砖，坚持一口价包通。",
    review: "“别人说要敲地砖收RM900，陈Uncle用退丝器25分钟修好才收RM60！” — 保阁亚三王伯伯"
  },
  {
    id: "sifu_fatt",
    name: "甘文丁阿发师傅",
    role: "15年冷气深层拆洗技师",
    category: "aircond",
    categoryTag: "❄️ 药水拆洗 · 专治滴水",
    area: "kamunting",
    areaName: "Kamunting 甘文丁",
    dialects: "广东话 / 福建话 / 华语",
    rating: 4.9,
    jobs: 389,
    avatar: "❄️",
    story: "自带防水罩与蒸汽除菌机，立下规矩：“压力表没少雪种，绝不乱收街坊一分钱Gas费。”",
    review: "“风轮拆出来洗得干干净净，地板一点没弄脏，开25度都冷！” — 甘文丁陈太太"
  },
  {
    id: "sifu_jay",
    name: "太平湖创客阿杰",
    role: "机电返乡青年 · 3D修复师",
    category: "legacy3d",
    categoryTag: "🖨️ 3D打印绝版老零件",
    area: "taiping_town",
    areaName: "Taiping Town 太平市区",
    dialects: "华语 / 福建话 / English",
    rating: 5.0,
    jobs: 215,
    avatar: "🖨️",
    story: "在敏路设立老件3D实验室，已收录120+种太平老屋停产风扇旋钮、老水箱配件图纸。",
    review: "“帮我把1988年结婚买的National铁扇旋钮打印配回去了，才RM30！” — 敏路郑老先生"
  },
  {
    id: "sifu_soon",
    name: "新邦水喉通顺哥",
    role: "19年高压通渠防漏专家",
    category: "plumbing",
    categoryTag: "💧 电动通渠 · 雨水槽防漏",
    area: "simpang",
    areaName: "Simpang 新邦",
    dialects: "福建话 / 华语 / 广东话",
    rating: 4.8,
    jobs: 312,
    avatar: "🔧",
    story: "专治太平雨季屋顶水槽(Gutter)倒灌与老厨房油垢堵塞，承诺“不通分文不取”。",
    review: "“20分钟通好厨房水喉，按AI公道价只收RM60，非常老实爽快！” — 新邦黄先生"
  },
  {
    id: "sifu_murugan",
    name: "敏路慕鲁根师傅",
    role: "27年认证三相电与防雷专家",
    category: "electrical",
    categoryTag: "⚡ 雷雨防跳电 · 老屋电路",
    area: "taiping_town",
    areaName: "Taiping Town 太平市区",
    dialects: "流利福建话 / BM / English",
    rating: 4.9,
    jobs: 364,
    avatar: "⚡",
    story: "在太平巴刹旁长大，福建话讲得比华人还溜，专治太平雷雨天老店屋地线漏电跳掣。",
    review: "“Murugan一进门就用福建话跟家父聊家常，三两下查出地线问题！” — 都拜吴老板"
  }
];

// 4. 全局极简状态
const state = {
  elderMode: false,
  category: "electrical",
  area: "aulong",
  symptom: PAIN_CATEGORIES.electrical.defaultSymptom,
  customNote: "",
  photoName: null,
  sifuFilter: "all",
  sifus: [],
  // 预约弹窗状态
  booking: {
    sifuId: "sifu_keong",
    isFilial: false,
    contactName: "",
    addressNote: "",
    timeSlot: "⚡ 尽快上门（30分钟内响应）"
  },
  // 评价弹窗状态
  rating: {
    sifuId: "sifu_keong",
    stars: 5,
    author: "",
    comment: ""
  },
  jobsToday: 43
};

// 初始化加载
function initApp() {
  try {
    const saved = localStorage.getItem("taipingai_clean_sifus_v2");
    state.sifus = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_SIFUS));
  } catch (e) {
    state.sifus = JSON.parse(JSON.stringify(INITIAL_SIFUS));
  }

  renderCapsules();
  renderSymptoms();
  renderAiResult();
  renderSifuTabs();
  renderSifuGrid();
}

// 长辈大字模式切换
function toggleElderMode() {
  state.elderMode = !state.elderMode;
  document.documentElement.classList.toggle("elder-mode", state.elderMode);
  const btn = document.getElementById("elder-btn");
  if (btn) {
    btn.textContent = state.elderMode ? "👓 标准字号" : "👓 长辈大字";
    btn.className = state.elderMode
      ? "px-3 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 cursor-pointer"
      : "px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 cursor-pointer";
  }
}

// ==========================================================================
// 模块一：AI 秒估公道价诊断台
// ==========================================================================
function selectCategory(catId) {
  if (!PAIN_CATEGORIES[catId]) return;
  state.category = catId;
  state.symptom = PAIN_CATEGORIES[catId].defaultSymptom;
  state.customNote = "";
  const input = document.getElementById("custom-note-input");
  if (input) input.value = "";

  renderCapsules();
  renderSymptoms();
  renderAiResult();
}

function selectSymptom(label) {
  state.symptom = label;
  renderSymptoms();
  renderAiResult();
}

function changeArea(areaId) {
  state.area = areaId;
  renderAiResult();
}

function handleNoteInput(val) {
  state.customNote = val.trim();
  renderAiResult();
}

function handlePhotoSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  state.photoName = file.name;
  renderAiResult();
  showToast("📸 已载入照片，AI 已为您收窄公道价估算区间");
}

function simulateVoiceInput() {
  const samples = [
    { cat: "plumbing", area: "pokok_assam", sym: "屋顶大水箱(Tangki)满水直漏", note: "保阁亚三新村屋顶水箱一直漏水停不了" },
    { cat: "electrical", area: "aulong", sym: "下雨天电箱(ELCB)跳电推不上", note: "后廊排屋一下大雨就跳电" },
    { cat: "aircond", area: "kamunting", sym: "冷气机室内滴水/结冰", note: "甘文丁主人房冷气滴水不冷" },
    { cat: "legacy3d", area: "taiping_town", sym: "古董KDK/National风扇旋钮齿轮", note: "老风扇调速旋钮断了想3D打印配回" }
  ];
  const pick = samples[Math.floor(Math.random() * samples.length)];
  state.category = pick.cat;
  state.area = pick.area;
  state.symptom = pick.sym;
  state.customNote = pick.note;

  const areaEl = document.getElementById("area-select");
  if (areaEl) areaEl.value = pick.area;
  const noteEl = document.getElementById("custom-note-input");
  if (noteEl) noteEl.value = pick.note;

  renderCapsules();
  renderSymptoms();
  renderAiResult();
  showToast(`🎙️ 已识别太平语音：“${pick.note}”`);
}

function renderCapsules() {
  const el = document.getElementById("capsules-container");
  if (!el) return;

  el.innerHTML = Object.values(PAIN_CATEGORIES).map(c => {
    const active = state.category === c.id;
    return `
      <button
        type="button"
        onclick="selectCategory('${c.id}')"
        class="capsule-btn text-left p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer ${
          active
            ? "active border-emerald-900"
            : "bg-slate-50/80 hover:bg-white border-slate-200 text-slate-800"
        }"
      >
        <span class="text-2xl shrink-0">${c.icon}</span>
        <div class="min-w-0">
          <div class="font-bold text-sm truncate">${c.title}</div>
          <div class="capsule-price text-xs font-semibold ${active ? "text-amber-300" : "text-emerald-700"}">${c.startPrice}</div>
        </div>
      </button>
    `;
  }).join("");
}

function renderSymptoms() {
  const el = document.getElementById("symptoms-container");
  if (!el) return;
  const cat = PAIN_CATEGORIES[state.category];

  el.innerHTML = cat.symptoms.map(s => {
    const active = state.symptom === s.label;
    return `
      <button
        type="button"
        onclick="selectSymptom('${s.label}')"
        class="text-xs px-3 py-1.5 rounded-full border font-medium transition-all cursor-pointer ${
          active
            ? "bg-emerald-900 text-white border-emerald-900 font-semibold"
            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-700"
        }"
      >
        ${s.label}
      </button>
    `;
  }).join("");
}

function getCurrentValuation() {
  const cat = PAIN_CATEGORIES[state.category];
  const area = TAIPING_AREAS[state.area] || TAIPING_AREAS.aulong;
  const symObj = cat.symptoms.find(s => s.label === state.symptom) || cat.symptoms[0];

  let min = symObj.range[0];
  let max = symObj.range[1];
  if (state.photoName) {
    max = Math.max(min + 15, Math.round(max * 0.88));
  }

  // 匹配首选师傅
  const catSifus = state.sifus.filter(s => s.category === state.category);
  const matchedSifu = catSifus.find(s => s.area === state.area) || catSifus[0] || state.sifus[0];

  return {
    cat,
    area,
    symObj,
    min,
    max,
    matchedSifu,
    summaryDesc: state.customNote ? `${state.symptom}（${state.customNote}）` : state.symptom
  };
}

function renderAiResult() {
  const el = document.getElementById("ai-output-card");
  if (!el) return;
  const v = getCurrentValuation();

  el.innerHTML = `
    <div class="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div class="space-y-2 max-w-xl">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-md">AI 诊断公道价</span>
          <span class="text-emerald-200">📍 ${v.area.name}（${v.area.eta}）</span>
          ${state.photoName ? `<span class="text-amber-300 font-semibold">· 📸 已含照片评估</span>` : ""}
        </div>

        <div class="flex items-baseline gap-3 pt-0.5">
          <span class="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">RM ${v.min} – RM ${v.max}</span>
          <span class="text-xs text-emerald-200">包上门检测 · 修不好不收钱</span>
        </div>

        <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          <strong class="text-amber-300">🛡️ 防砍菜头提示：</strong>${v.symObj.tip}
        </p>
      </div>

      <!-- 右侧匹配师傅与一键呼叫 -->
      <div class="bg-white/10 rounded-xl p-4 border border-white/10 flex flex-col justify-between gap-3 md:w-72 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-xl">
            ${v.matchedSifu.avatar}
          </div>
          <div class="min-w-0">
            <div class="text-[11px] text-amber-300 font-semibold">为您匹配附近认证师傅</div>
            <div class="font-bold text-sm text-white truncate">${v.matchedSifu.name} · ${v.matchedSifu.rating.toFixed(1)}★</div>
          </div>
        </div>

        <button
          type="button"
          onclick="openBookingModal('${v.matchedSifu.id}', false)"
          class="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
        >
          📲 按此公道价预约师傅
        </button>
      </div>
    </div>
  `;
}

// ==========================================================================
// 模块二：太平认证匠人红榜 & Rating 系统
// ==========================================================================
function setSifuFilter(cat) {
  state.sifuFilter = cat;
  renderSifuTabs();
  renderSifuGrid();
}

function renderSifuTabs() {
  const el = document.getElementById("sifu-tabs");
  if (!el) return;
  const tabs = [
    { id: "all", label: "全部师傅" },
    { id: "electrical", label: "⚡ 电工抢修" },
    { id: "plumbing", label: "💧 水喉捉漏" },
    { id: "aircond", label: "❄️ 冷气清洗" },
    { id: "legacy3d", label: "🖨️ 3D配老件" }
  ];

  el.innerHTML = tabs.map(t => {
    const active = state.sifuFilter === t.id;
    return `
      <button
        type="button"
        onclick="setSifuFilter('${t.id}')"
        class="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
          active
            ? "bg-emerald-900 text-white shadow-sm"
            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-700"
        }"
      >
        ${t.label}
      </button>
    `;
  }).join("");
}

function renderSifuGrid() {
  const el = document.getElementById("sifu-grid");
  if (!el) return;

  const list = state.sifus.filter(s => state.sifuFilter === "all" || s.category === state.sifuFilter);

  el.innerHTML = list.map(s => `
    <div class="clean-card bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm">
      <div>
        <!-- 顶部师傅信息 -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shrink-0">
              ${s.avatar}
            </div>
            <div>
              <h3 class="font-extrabold text-base text-slate-900">${s.name}</h3>
              <div class="text-xs text-slate-500 mt-0.5">${s.role} · 📍 ${s.areaName}</div>
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-extrabold text-xs">
              ★ ${s.rating.toFixed(1)}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">已修 ${s.jobs} 户</div>
          </div>
        </div>

        <!-- 标签与担保徽章 -->
        <div class="flex flex-wrap items-center gap-1.5 mt-3.5">
          <span class="text-xs font-semibold bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-md">${s.categoryTag}</span>
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">🛡️ 包公道价</span>
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">🔧 保修30天</span>
        </div>

        <!-- 匠人一句话故事 -->
        <p class="text-xs text-slate-600 mt-3 leading-relaxed">
          <strong class="text-slate-800">匠人初心：</strong>${s.story}
        </p>

        <!-- 精选街坊评价 -->
        <div class="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 leading-relaxed">
          ${escapeHtml(s.review)}
        </div>
      </div>

      <!-- 底部防飞单呼叫与打星 -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span class="text-[11px] text-slate-400 font-mono">🔒 012-588 **** (官方转接)</span>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            onclick="openRatingModal('${s.id}')"
            class="px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            ★ 评价
          </button>
          <button
            type="button"
            onclick="openBookingModal('${s.id}', false)"
            class="px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
          >
            呼叫师傅
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// 模块三：防飞单 WhatsApp 官方担保预约弹窗
// ==========================================================================
function openBookingModal(sifuId, isFilial = false, presetNote = null) {
  if (presetNote) {
    state.customNote = presetNote;
    const noteEl = document.getElementById("custom-note-input");
    if (noteEl) noteEl.value = presetNote;
    renderAiResult();
  }
  state.booking.sifuId = sifuId || getCurrentValuation().matchedSifu.id;
  state.booking.isFilial = isFilial;

  renderBookingModal();
  document.getElementById("booking-modal").classList.remove("hidden");
}

function closeBookingModal() {
  document.getElementById("booking-modal").classList.add("hidden");
}

function setBookingMode(isFilial) {
  state.booking.isFilial = isFilial;
  renderBookingModal();
}

function buildWhatsAppText() {
  const v = getCurrentValuation();
  const sifu = state.sifus.find(s => s.id === state.booking.sifuId) || v.matchedSifu;
  const header = state.booking.isFilial
    ? "💝【AITAIPING 游子远程代父母预约单】"
    : "🛡️【AITAIPING 太平官方担保预约单】";

  const filialLine = state.booking.isFilial
    ? "📹 游子特别备注：家里是长辈开门，请勿向老人家收现金，修好拍15秒视频发我WhatsApp确认后线上过账。"
    : "🛡️ 保障要求：按公道价先报价后施工，享30天官方保修。";

  return [
    header,
    `• 报修项目：${v.cat.icon} ${v.cat.title}`,
    `• 问题详情：${v.summaryDesc}`,
    `• AI公道价：RM ${v.min} - RM ${v.max}`,
    `• 太平区域：${v.area.name}`,
    state.booking.addressNote ? `• 详细地址：${state.booking.addressNote}` : null,
    `• 预约师傅：${sifu.name}`,
    `• 上门时间：${state.booking.timeSlot}`,
    state.booking.contactName ? `• 联络人：${state.booking.contactName}` : null,
    filialLine
  ].filter(Boolean).join("\n");
}

function renderBookingModal() {
  const body = document.getElementById("booking-modal-body");
  if (!body) return;
  const v = getCurrentValuation();
  const sifu = state.sifus.find(s => s.id === state.booking.sifuId) || v.matchedSifu;
  const waText = buildWhatsAppText();
  const waLink = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  body.innerHTML = `
    <div class="space-y-4">
      <!-- 模式切换 -->
      <div class="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          type="button"
          onclick="setBookingMode(false)"
          class="py-2 rounded-lg transition-all cursor-pointer ${!state.booking.isFilial ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}"
        >
          🏠 我在太平本地
        </button>
        <button
          type="button"
          onclick="setBookingMode(true)"
          class="py-2 rounded-lg transition-all cursor-pointer ${state.booking.isFilial ? "bg-amber-400 text-emerald-950 shadow-sm" : "text-slate-500"}"
        >
          💝 游子代太平爸妈订
        </button>
      </div>

      <!-- 诊断与师傅摘要 -->
      <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-bold text-emerald-950">${v.cat.icon} ${v.cat.title}</span>
          <span class="font-extrabold text-emerald-800">公道价 RM ${v.min} – RM ${v.max}</span>
        </div>
        <div class="text-slate-600">症状：${escapeHtml(v.summaryDesc)}</div>
        <div class="text-slate-600">区域：${v.area.name} · 指派：<strong class="text-slate-900">${sifu.name}</strong></div>
      </div>

      <!-- 极简表单 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div>
          <label class="font-bold text-slate-700 block mb-1">您的称呼（选填）</label>
          <input
            type="text"
            placeholder="${state.booking.isFilial ? "例：KL阿伟 (代后廊林伯伯)" : "例：后廊陈太太"}"
            value="${escapeHtml(state.booking.contactName)}"
            oninput="state.booking.contactName = this.value; refreshWaPreview();"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
          />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">期望上门时间</label>
          <select
            onchange="state.booking.timeSlot = this.value; refreshWaPreview();"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-emerald-700"
          >
            <option value="⚡ 尽快上门（30分钟内响应）">⚡ 尽快上门（30分钟内）</option>
            <option value="🌤️ 今天下午">🌤️ 今天下午</option>
            <option value="🌅 明天上午">🌅 明天上午</option>
            <option value="📅 周末预约">📅 周末预约</option>
          </select>
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1 text-xs">花园门牌或熟悉地标（选填）</label>
        <input
          type="text"
          placeholder="例：后廊巴刹后面第5巷 / Taman Pertama"
          value="${escapeHtml(state.booking.addressNote)}"
          oninput="state.booking.addressNote = this.value; refreshWaPreview();"
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
        />
      </div>

      <!-- WhatsApp 预填消息预览 -->
      <div class="bg-slate-50 rounded-xl p-3 border border-slate-200">
        <div class="text-[11px] font-bold text-slate-500 mb-1">已自动打包 WhatsApp 官方担保消息：</div>
        <pre id="wa-preview-text" class="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">${escapeHtml(waText)}</pre>
      </div>

      <a
        id="wa-launch-btn"
        href="${waLink}"
        target="_blank"
        rel="noopener noreferrer"
        onclick="onWhatsAppLaunched()"
        class="block w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl text-center shadow-md transition-all"
      >
        🟢 一键唤起 WhatsApp 发送给官方调度台
      </a>
    </div>
  `;
}

function refreshWaPreview() {
  const waText = buildWhatsAppText();
  const pre = document.getElementById("wa-preview-text");
  const btn = document.getElementById("wa-launch-btn");
  if (pre) pre.textContent = waText;
  if (btn) btn.href = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
}

function onWhatsAppLaunched() {
  state.jobsToday += 1;
  const el = document.getElementById("jobs-today-count");
  if (el) el.textContent = String(state.jobsToday);
  closeBookingModal();
  showToast("🟢 已唤起 WhatsApp 官方调度台（享受30天保修与公道价保障）");
}

// ==========================================================================
// 评价打星弹窗
// ==========================================================================
function openRatingModal(sifuId) {
  state.rating = { sifuId, stars: 5, author: "", comment: "" };
  renderRatingModal();
  document.getElementById("rating-modal").classList.remove("hidden");
}

function closeRatingModal() {
  document.getElementById("rating-modal").classList.add("hidden");
}

function setStars(n) {
  state.rating.stars = n;
  renderRatingModal();
}

function renderRatingModal() {
  const sifu = state.sifus.find(s => s.id === state.rating.sifuId);
  const body = document.getElementById("rating-modal-body");
  if (!sifu || !body) return;

  body.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">${sifu.avatar}</div>
        <div>
          <div class="font-bold text-sm text-slate-900">${sifu.name}</div>
          <div class="text-xs text-slate-500">${sifu.categoryTag}</div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 py-2 bg-amber-50/60 rounded-xl border border-amber-200/70">
        ${[1, 2, 3, 4, 5].map(n => `
          <button
            type="button"
            onclick="setStars(${n})"
            class="text-3xl cursor-pointer ${n <= state.rating.stars ? "text-amber-400" : "text-slate-300"}"
          >★</button>
        `).join("")}
      </div>

      <input
        type="text"
        placeholder="您的称呼（例：保阁亚三李太太）"
        value="${escapeHtml(state.rating.author)}"
        oninput="state.rating.author = this.value"
        class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-700"
      />

      <textarea
        rows="3"
        placeholder="写一句真实评价（例：师傅很老实，收费跟AI公道价一样！）"
        oninput="state.rating.comment = this.value"
        class="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-emerald-700"
      >${escapeHtml(state.rating.comment)}</textarea>

      <button
        type="button"
        onclick="submitRating()"
        class="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl cursor-pointer"
      >
        提交街坊评价
      </button>
    </div>
  `;
}

function submitRating() {
  const sifu = state.sifus.find(s => s.id === state.rating.sifuId);
  if (!sifu) return;

  const who = (state.rating.author || "太平街坊").trim();
  const text = (state.rating.comment || "收费公道，手艺好，对老人家很有耐心！").trim();

  sifu.jobs += 1;
  sifu.rating = Math.min(5.0, Math.round(((sifu.rating * 20 + state.rating.stars) / 21) * 10) / 10);
  sifu.review = `“${text}” — ${who} (刚刚)`;

  try {
    localStorage.setItem("taipingai_clean_sifus_v2", JSON.stringify(state.sifus));
  } catch (e) {}

  renderSifuGrid();
  closeRatingModal();
  showToast(`⭐ 已提交对【${sifu.name}】的好评！`);
}

// ==========================================================================
// 辅助函数
// ==========================================================================
function quickBookFilial(catId, desc) {
  selectCategory(catId);
  openBookingModal(null, true, desc);
}

function quickBook3D(desc) {
  selectCategory("legacy3d");
  openBookingModal("sifu_jay", false, desc);
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let toastTimeout = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.add("hidden"), 3000);
}

document.addEventListener("DOMContentLoaded", initApp);
