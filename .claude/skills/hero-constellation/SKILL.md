---
name: hero-constellation
description: 维护博客首页的「知识星图」SVG Hero（标签为星、共现关系为线、鼠标可交互）。当用户要求修改首页 Hero 大图、标签云/星图、调整节点位置/大小/密度、改动效（漂浮/脉冲/流星/鼠标引力）、换配色、加新标签的固定位置、排查星图渲染或交互问题时使用。全部实现集中在 src/components/HeroConstellation.astro 一个文件里。
---

# 知识星图 Hero 维护指南

首页 Hero 是一个可交互的「知识星图」：标签 = 星（文章越多越大越亮），
同一篇文章里共现的标签用细线相连，鼠标是引力体，点击星球跳转标签页。

## 架构总览（改之前先读这段）

所有代码集中在 **`src/components/HeroConstellation.astro`**，分四段：

| 段落 | 内容 | 何时动它 |
|---|---|---|
| frontmatter（`---` 内） | 可调参数、PIN 坐标表、标签计数 + 共现计算、布局 | 加标签位置、调密度/大小 |
| 模板（HTML/SVG） | defs 渐变、网格、连线层、节点层、氛围层 | 改视觉结构 |
| `<script define:vars>` | 交互 + 动效（纯 JS，无依赖） | 调交互、动效节奏 |
| `<style>` | 主题着色、hover 聚焦的淡出规则 | 调颜色、透明度 |

其他相关文件：

- `src/pages/[lang]/[...page].astro` —— 只在第 1 页渲染 `<HeroConstellation lang={lang} />`
- `src/i18n/ui.ts` —— `home.heroTitle` / `home.heroHint` 星图文案（中英两份，结构必须一致，TS 会检查）
- `src/utils/posts.ts` —— `getPosts` / `tagSlug`（标签 URL 会把空格和 `/` 换成 `-`）

## 数据流（重要：标签和连线不需要手工维护）

1. 构建时扫描当前语言全部已发布文章的 frontmatter `tags:`
2. 按文章数取 **Top `MAX_NODES`（16）** 个标签作为节点
3. 同一篇文章里共现的标签生成连线，按共现次数取 **Top `MAX_EDGES`（34）**
4. 发新文章 → 重新构建 → 星图自动更新，**零维护**

## 常见修改任务（按配方执行）

### 1. 给某个标签固定位置 / 调整构图

编辑 frontmatter 里的 `PIN` 表，坐标是 0-100 归一化值（原点在左上）：

```ts
const PIN: Record<string, [number, number]> = {
	Blocklet: [50, 47],
	// 新加一行：标签名必须和 frontmatter 里的写法完全一致（区分大小写）
	新标签: [x, y],
};
```

- 不在 PIN 里的标签自动按黄金角落在椭圆环上，一般不需要管
- 构图原则：大标签（文章多的）放中心区域，关联多的放近一点，避免文字重叠
- 调完必须截图验证（见下方「验证」）

### 2. 调整密度 / 大小

frontmatter「可调参数」区：

- `MAX_NODES` —— 星图上最多几个标签（默认 16，超过 20 会显挤）
- `MAX_EDGES` —— 最多几条连线（默认 34）
- `VB_W` / `VB_H` —— 画布比例（默认 1200×560；**改了这个要同步改 script 里的 `VB_W`/`VB_H` 常量**，两处是独立的）

节点半径公式 `r = 6 + sqrt(count) * 4.2`、字号公式 `fs = 12 + sqrt(count) * 3.2`（上限 30），
在 frontmatter 的 `nodes` 映射里调。

### 3. 调动效强度

全部在 `<script define:vars>` 顶部的常量区：

| 常量 | 含义 | 默认 |
|---|---|---|
| `R` | 鼠标引力场半径（viewBox 单位） | 170 |
| `PUSH` | 最大推离距离 | 34 |
| `s.speed` / `s.amp` | 节点漂浮速度 / 幅度 | 0.25-0.6 / 5-13 |
| `nextPulse` 间隔 | 数据脉冲频率 | 每 2.5-6s |
| `nextMeteor` 间隔 | 流星频率 | 每 8-16s |
| `0.07`（lerp 系数） | 弹簧回弹的"软硬度"，越小越软 | 0.07 |

关掉某个动效：直接删掉对应的 fire/advance 代码块即可（pulse、meteor、巡航各自独立）。

### 4. 换配色

不要写死颜色！所有颜色都走 CSS 变量，在 `<style>` 段：

- `stop-color: var(--accent)` / `var(--accent2)` —— defs 渐变 stop 靠 class 着色（这是 SVG 渐变能跟随明暗主题的关键技巧）
- 节点 `.ring` / `.core` / `.lbl`、连线 `.lk` 的颜色也都在 style 段
- 亮色 / 暗色效果差异大时，在 `src/styles/global.css` 的 `:root[data-theme='dark']` 加 hero 专用变量，不要分支写两套

### 5. 改文案

`src/i18n/ui.ts` 的 `home` 节，中英两份同时改（TS 会强制字段一致）。

## 实现约束（踩过的坑，别踩第二次）

1. **`<script define:vars>` 是原样内联的纯 JS**：不能写 TS 类型、不能 import，
   `nodeData` / `edges` 由 Astro 自动注入为全局常量
2. **hover 聚焦的淡出用 CSS 类切换**，不是 JS 改 style：
   `.hc.focus .nd { opacity: .15 }` + `.nd.on` / `.lk.on` 白名单；
   连线的基础 `stroke-opacity` 是行内 attribute，所以 CSS 覆盖要用 `!important`
3. **`prefers-reduced-motion` 时在动效初始化前 `return`**，
   但点击跳转和 hover 聚焦绑定在这个 return 之前——加新交互时注意放在 return 前还是后
4. 连线端点每帧跟随节点当前位置更新（`cur[]` 数组），
   节点位移 = 正弦漂浮 + 鼠标斥力的弹簧位移，两层叠加
5. 无鼠标设备（触屏）3 秒无 pointermove 自动进入巡航模式
   （虚拟引力点走李萨如曲线），不要删掉这段，移动端靠它"活"起来
6. 滚出视口用 IntersectionObserver 暂停 rAF，省电

## 验证流程（每次修改后必做）

```bash
npx astro build                              # 1. 构建必须过
npx astro preview --port 4321 &              # 2. 起预览
# 3. 截图验证（明暗主题 + hover 聚焦至少三张）
```

截图工具：系统 Chrome headless 拍亮色：

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --hide-scrollbars --window-size=1280,1100 \
  --virtual-time-budget=5000 --screenshot=/tmp/hero.png http://localhost:4321/zh/
```

暗色 / hover 交互用 playwright（全局没装，用 npx 缓存 + 已下载的 chromium 1243）：

```js
// /tmp/shot.cjs —— executablePath 指向 ~/Library/Caches/ms-playwright/ 下已有版本
const { chromium } = require(require('os').homedir() +
	'/.npm/_npx/257a462f87570f9c/node_modules/playwright-core');
(async () => {
	const browser = await chromium.launch({ executablePath: require('os').homedir() +
		'/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
	const page = await browser.newPage({ viewport: { width: 1280, height: 1100 }, colorScheme: 'dark' });
	await page.goto('http://localhost:4321/zh/', { waitUntil: 'networkidle' });
	await page.waitForTimeout(3500);                      // 让动效跑起来
	await page.screenshot({ path: '/tmp/hero-dark.png' });
	// hover 聚焦：鼠标移到某节点上再截 .hero 区域
	await browser.close();
})();
```

检查清单：

- [ ] 暗色 + 亮色各截一张，标签无重叠、不出画布
- [ ] hover 一个大标签，邻域高亮、其余淡出、显示"共 N 篇"
- [ ] 英文站 `/en/` 也看一眼（标签少、走自动布局，是布局兜底能力的试金石）
- [ ] 点一个标签确认跳到 `/zh/tags/<slug>/`
- [ ] 完事 `pkill -f "astro preview"`
