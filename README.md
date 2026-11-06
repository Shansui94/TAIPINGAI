# TAIPINGAI 太平人 × AITAIPING 爱太平 🌧️🏡

> **马来西亚霹雳州太平（Taiping, Perak）社区 AI 水电家居维护与认证匠人公道榜平台（MVP 第一阶段）**
> 核心理念：既是 **AI Taiping（智能太平）**，也是 **爱太平（Love Taiping）**，谐音福建话 **“太平人（Taiping-lang）”**。

---

## 🚀 1. 零配置快速运行（给共同负责人的上手指南）

本项目采用极简、高内聚、免构建（Zero-Build）的现代前端架构（HTML5 + Tailwind CSS + 原生 JavaScript），确保在马来西亚移动网络下秒开，且任何协作者拉取代码后无需安装繁琐依赖即可运行：

- **方式 A（最简单）**：直接在浏览器（Chrome / Edge / Safari）中双击打开 `index.html`。
- **方式 B（本地开发热重载）**：
  - 使用 VS Code / Antigravity 的 **Live Server** 插件一键启动；
  - 或在终端运行：`npx serve .` 或 `python -m http.server 8080`，然后访问 `http://localhost:8080`。

---

## 📂 2. 核心文件结构与分工建议

| 文件名 | 职责说明 | 共同负责人常改配置项 |
| :--- | :--- | :--- |
| `index.html` | 页面五大核心模块骨架、品牌视觉 Hero、预约与评价双弹窗结构 | 页面文案微调、新增区块、SEO 标签 |
| `app.js` | 核心业务数据与交互状态机（AI 估价算法、匠人红榜数据库、WhatsApp 预填生成、游子套餐、3D打印案例） | 修改官方 WhatsApp 号码、增删太平师傅资料、调整 RM 公道价区间 |
| `styles.css` | “太平雨城翠绿 + 暖心琥珀黄”主题配色、雨丝动效、AI 扫描动效、`html.elder-mode` 长辈大字模式规则 | 品牌色彩微调、动画与字体缩放比例 |

---

## 🛠️ 3. 运营数据快速修改指南（在 `app.js` 中）

如果另一位负责人主要负责 **太平本地运营、对接水电师傅或调整报价**，只需打开 `app.js` 修改顶部常量即可：

1. **更换官方调度台 WhatsApp 手机号**（第 6 行）：
   ```javascript
   const OFFICIAL_WHATSAPP_NUMBER = "60125880099"; // 改为你们的官方 WhatsApp 商业号（含马来西亚国码 60）
   ```
2. **调整太平各花园/新村（Aulong / Pokok Assam / Kamunting / Simpang / 市区）信息**（第 11 行 `TAIPING_AREAS`）。
3. **调整 4 大痛点 AI 公道价区间与防砍菜头提醒**（第 50 行 `PAIN_CATEGORIES`）。
4. **新增或修改太平认证匠人（Sifu）卡片资料**（第 179 行 `INITIAL_SIFUS`）。
5. **调整游子孝心套餐与 3D 打印老零件案例**（第 314 行 `LEGACY_3D_ITEMS` 与 `FILIAL_PACKAGES`）。

---

## 🤝 4. 双人协作开发工作流

```bash
# 1. 克隆仓库到本地
git clone <仓库地址>
cd TAIPINGAI

# 2. 每次开始修改前拉取对方最新改动
git pull origin main

# 3. 修改完成后提交并推送到云端
git add .
git commit -m "feat: 更新太平师傅资料与公道价区间"
git push origin main
```
