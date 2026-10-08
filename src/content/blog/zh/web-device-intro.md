---
title: 'Web Device 从入门到实战：用 AFS + AUP 构建一个真正的网站'
description: '如果说 AUP 解决的是“如何用机器可以理解的方式描述界面”，那么 Web Device 解决的就是另一个更实际的问题：'
pubDate: '2026-09-20'
tags: ['AFS', 'AUP', 'Blocklet']
cover: '/images/posts/bafkreiaclknjq5knsvs7qlrihu4ukoemrbn3q7a5e7t7bfvuibcmjki6qa.webp'
---

如果说 AUP 解决的是“如何用机器可以理解的方式描述界面”，那么 Web Device 解决的就是另一个更实际的问题：

**如何把 AFS 中的页面、内容和站点配置，直接变成一个可以访问的网站。**

传统网站开发通常需要 Web Framework、模板系统、Markdown 引擎、CSS、路由、构建工具和部署系统。Web Device 则把这些能力重新组织到 ARC、AFS、AUP 和 `.web/` 目录之中。

可以先用一张图理解它：

```javascript
内容对象 content/ ──┐
                    ├──→ Web Device ──→ HTML ──→ 网站
页面 pages/ ────────┤
                    │
站点配置 .web/ ─────┘
                         ↑
                    AUP Layout

```

Web Device 并不是要再创造一个 React、Vue 或 Next.js，而是把**网站本身变成 AFS 中一种可以被 ARC 运行时理解和渲染的资源结构**。官方文档明确将 Web Device 定义为 ARC 中负责静态网站的 AFS provider，它读取页面、内容对象和 Web 配置，并渲染成静态 HTML；站点文件仍然是事实来源。

---

## 一、先理解 Web Device 到底是什么

理解 Web Device 最容易犯的错误，是把它当成“另一个前端框架”。

实际上，它更接近：

```javascript
AFS
 ↓
Web Device
 ↓
页面 / 内容 / 组件 / SEO / Theme
 ↓
Static HTML

```

ARC 是运行时和 CLI，AFS 是 ARC 用来组织资源的路径抽象，而 Web Device 是负责网站渲染的 provider。

因此，一个 Web Device 网站并不是：

```javascript
React App
    ↓
Build
    ↓
HTML

```

而更接近：

```javascript
AFS 文件结构
    ↓
Web Device
    ↓
AUP Layout + Web Components + Content
    ↓
Static HTML

```

这也是 Web Device 和传统网站框架最重要的区别。

它并没有把网站开发重新变成另一套独立技术栈，而是让网站直接成为 ARC/AFS 生态中的一种 Device。

---

# 二、Web Device、AUP、AFS 到底是什么关系？

如果前面的 AUP 教程已经让你理解了 AUP，那么现在可以把三者放在一起看。

```javascript
                 ┌── AUP ──→ 页面结构与 Layout
                 │
AFS ──→ Web Device ──→ Web Components ──→ HTML
                 │
                 └── Content ──→ 文章、产品、事件、文档

```

三者职责非常明确：

| 技术  | 主要职责  |
|---|---|
| AFS  | 用路径组织资源、文件、内容和服务  |
| AUP  | 描述 UI、页面和 Layout 的语义结构  |
| Web Device  | 把这些 AFS 资源渲染成网站  |
| `.web/`  | 网站级配置、组件、Theme、tokens  |
| `pages/`  | 页面、路由和 Layout  |
| `content/`  | 文章、产品、事件等内容对象  |

所以不要把 Web Device 理解成“取代 AUP”。

恰恰相反：

**AUP 是 Web Device 的页面描述语言之一，而 Web Device 是 AUP 在网站场景中的一个具体运行环境。**

---

# 三、一个 Web Device 网站只有三个核心目录

理解 Web Device 最重要的一步，是记住：

```javascript
pages/       页面
content/     内容
.web/        网站

```

官方文档把三者的职责划分得非常清楚。

### `pages/`：页面

这里放网站真正的页面和 Layout。

例如：

```javascript
pages/
├── index/
│   └── layout.aup
├── about/
│   └── layout.aup
└── docs/
    └── layout.aup

```

`pages/index/` 对应首页，`pages/about/` 可以对应 `/about/`。

### `content/`：内容

这里不是页面代码，而是“内容对象”。

例如：

```javascript
content/
└── articles/
    ├── first-post/
    │   ├── content.md
    │   └── cover.png
    └── second-post/
        ├── content.md
        └── cover.png

```

一篇文章就是一个对象。

它可以拥有标题、摘要、日期、作者、标签、相关内容、封面以及多语言版本。

### `.web/`：网站

这里放整个网站共享的能力：

```javascript
.web/
├── site.yaml
├── tokens.json
├── components/
├── template/
└── themes/

```

例如 Header、Footer、文章卡片、Hero、SEO 默认值、视觉 Token 等，都属于网站层。

这形成了一个非常重要的分工：

```javascript
pages/    = 网站有哪些页面
content/  = 网站有什么内容
.web/     = 网站长什么样、怎么工作

```

---

# 四、为什么要把 Page 和 Content 分开？

这是 Web Device 非常值得理解的设计。

传统网站很容易出现这样的结构：

```javascript
首页
 ├── 第一篇文章
 ├── 第二篇文章
 ├── 第三篇文章
 └── 第四篇文章

```

结果文章和首页绑定在一起。

Web Device 更强调：

```javascript
Content Object
      ↓
多个页面读取
      ↓
首页 / 分类页 / 标签页 / 推荐页 / 搜索页

```

例如：

```javascript
content/articles/aup-introduction/

```

是一篇文章。

它可以同时出现在：

```javascript
首页
文章列表
AUP 专题页
搜索结果
相关推荐
标签页

```

文章本身并不知道自己应该出现在首页第几个位置。

这使内容成为一种可以被重新组合的资源，而不是某个页面的附属物。

官方文档也明确建议，内容对象描述“它是什么”，而首页排序、过滤和组件选择交给 Page 的 source/binding 和 Layout。

---

# 五、建立第一个 Web Device 网站

现在直接动手。

当前官方“建立第一个站点”教程使用 `arc 2.0.0-beta.25` 验证。由于 ARC 仍处于 beta 版本，实际操作前建议先执行：

```javascript
arc --version

```

如果版本不同，不要直接假设 CLI 参数和组件规则完全一致。官方文档也明确要求针对目标版本重新核验。

首先创建一个最小 Blocklet：

```javascript
arc blocklet init ./my-site --recipe basic --name my-site
cd ./my-site

```

然后确认 Blocklet ID：

```javascript
grep -E '^id:' blocklet.yaml

```

官方示例中得到：

```javascript
id: my-site

```

这个 ID 后面会被 `.route/web` 使用。

创建目录：

```javascript
mkdir -p .route .web/components/hello pages/index

```

---

# 六、`.route/web`：告诉 ARC 这里是 Web Device

建立：

```javascript
.route/web

```

内容：

```javascript
site: my-site
path: /
source: .
handler: web

```

这里有一个非常容易混淆的地方。

如果没有这个 Web route，Blocklet 的直接访问可能会寻找：

```javascript
.aup/app.aup
.aup/app.json

```

那是 AUP App 的入口，而不是当前这个 Web Device 网站。

因此：

```javascript
.route/web

```

实际上是在告诉 ARC：

**这个 Blocklet 的 Web 入口由 Web Device 接管。**

---

# 七、`.web/site.yaml`：网站的总配置

接下来建立：

```javascript
.web/site.yaml

```

最小配置可以这样写：

```javascript
domain: my-site.local
locale: en
render-mode: static

seo:
  og-site-name: My Site
  description: A minimal Web Device site.

```

需要特别注意：

```javascript
domain: my-site.local

```

并不是说网站现在已经部署到了 `my-site.local`。

它只是站点配置中的域名信息，本地开发时仍然通过 `arc blocklet run` 输出的 localhost 地址访问。

当前 Web Device 推荐通过 `.web/site.yaml` 集中管理 locale、SEO、Theme 等站点级配置。

---

# 八、第一个 Web Component

Web Device 中有一个很重要的概念：

**Page 负责组合，Component 负责呈现。**

例如我们创建：

```javascript
.web/components/hello/
├── manifest.json
├── render.js
└── style.css

```

`manifest.json`：

```javascript
{
  "name": "hello",
  "description": "A minimal local component.",
  "props": {
    "title": { "type": "string" },
    "text": { "type": "string" }
  }
}

```

`render.js`：

```javascript
export function render(ctx) {
  const { props, escapeHtml } = ctx;

  return {
    html: `<main>
      <h1>${escapeHtml(props.title || "")}</h1>
      <p>${escapeHtml(props.text || "")}</p>
    </main>`,
  };
}

```

`style.css`：

```javascript
main {
  max-width: 42rem;
  margin: 4rem auto;
  font-family: system-ui, sans-serif;
}

```

在当前 `2.0.0-beta.25` 的验证规则中，一个新的 standalone Web Component 需要 `manifest.json`、`render.js` 和 `style.css`。如果缺少 `style.css`，CLI 检查可能出现 `missing_web_component_file`。

---

# 九、用 AUP 写页面 Layout

现在建立：

```javascript
pages/index/layout.aup

```

内容：

```javascript
page index {
  hello main
    title="Hello, Web Device"
    text="This page is rendered by a local blocklet."
}

```

这里出现了 Web Device 最核心的一种组合方式：

```javascript
pages/index/layout.aup
        ↓
hello component
        ↓
render.js
        ↓
HTML

```

也就是说，AUP Layout 并不一定负责直接写所有 HTML。

它更像一个**页面编排层**。

组件才是真正承担 Web HTML、CSS 和浏览器呈现的地方。

官方文档特别强调：不能因为某个 AUP primitive 存在，就认为它一定可以直接作为 Web Layout 的 section；Web Layout 使用的是 Web Component + Props contract。

---

# 十、运行第一个网站

完成后执行：

```javascript
arc dsl lint .
arc dsl validate .
arc blocklet check .
arc blocklet build .

```

如果检查通过，再运行：

```javascript
arc blocklet run .

```

ARC 会启动或复用本地 daemon，并打印实际访问 URL。

**不要自己猜端口，也不要直接复制别人的 localhost 地址。**

打开命令实际打印的 URL。

你应该看到：

```javascript
Hello, Web Device

This page is rendered by a local blocklet.

```

官方文档把这个过程分成三个不同阶段：

```javascript
lint / validate
      ↓
输入是否正确

blocklet build
      ↓
能否生成构建产物

blocklet run + Browser
      ↓
用户实际看到什么

```

三者不能互相替代。

---

# 十一、真正的网站：加入 Content

刚才的 Hello World 只是验证 Web Device 能运行。

真正的网站通常从这里开始：

```javascript
my-site/
├── blocklet.yaml
├── .route/
│   └── web
├── .web/
│   ├── site.yaml
│   ├── tokens.json
│   └── components/
├── pages/
│   ├── index/
│   │   └── layout.aup
│   └── articles/
│       └── layout.aup
└── content/
    └── articles/
        ├── hello-web-device/
        │   └── content.md
        └── hello-aup/
            └── content.md

```

这时候网站已经从：

```javascript
一个页面

```

变成：

```javascript
一个内容系统

```

---

# 十二、Content Object 是什么？

例如：

```javascript
content/articles/hello-web-device/

```

下面建立：

```javascript
content.md

```

可以写：

```javascript
---
title: Hello Web Device
summary: 我的第一篇 Web Device 文章
date: 2026-09-20
tags:
  - Web Device
  - AUP
---

# Hello Web Device

这是我的第一篇 Web Device 文章。

Web Device 将 AFS 中的内容、页面和站点配置渲染成网站。

```

Web Device 会把这个目录视为一个内容对象。

目前正文可以使用：

```javascript
content.md
index.md

```

如果同时存在，`content.md` 优先。

中文版本则可以写：

```javascript
content.zh.md

```

而不是再创建一个：

```javascript
content/articles/hello-web-device-zh/

```

这也是 Web Device 多语言设计的重要特点：

```javascript
一个 Content Object
       ↓
content.md
content.zh.md
content.en.md

```

而不是：

```javascript
一个中文站
一个英文站

```

官方文档明确采用这种 locale 文件覆盖机制。

---

# 十三、Metadata 应该放在哪里？

Web Device 对内容对象的 metadata 有明确的读取优先级：

```javascript
Markdown front matter
        ↓
对象目录字段
        ↓
兼容的 .aup/default.json

```

前面的来源覆盖后面的来源。

所以新项目最自然的方式就是：

```javascript
---
title: Web Device 入门
summary: ...
date: 2026-09-20
author: ...
tags:
  - ARC
  - AUP
---

```

而不是把文章正文和 metadata 再拆成一大堆传统 CMS 配置文件。

---

# 十四、Page 如何知道应该显示哪些文章？

这就是 Web Device 的另一个核心机制：

**Source Binding。**

假设我们想在首页显示最新 6 篇文章。

不要把：

```javascript
文章 1
文章 2
文章 3
...

```

直接写进 Layout。

应该先定义一个 source：

```javascript
pages/index/sources/
└── articles

```

内容：

```javascript
/content/articles/

```

然后：

```javascript
pages/index/sources/articles.sort

```

写：

```javascript
-date

```

再建立：

```javascript
pages/index/sources/articles.limit

```

内容：

```javascript
6

```

于是：

```javascript
content/articles/
        ↓
source
        ↓
sort = -date
        ↓
limit = 6
        ↓
$source.articles
        ↓
page layout

```

官方文档把 Source 定义成一个非常小的契约：

```javascript
path
sort
limit
filter

```

并要求 source path 位于 `/content/&lt;type&gt;/` 之下。

---

# 十五、为什么 Source Binding 很重要？

因为它把：

```javascript
内容是什么

```

和：

```javascript
页面怎么展示

```

彻底分开。

例如：

```javascript
content/articles/

```

里面有 100 篇文章。

首页可以：

```javascript
最新 6 篇

```

专题页可以：

```javascript
tag = AUP

```

ArcBlock 教程页可以：

```javascript
tag = ARC

```

搜索页可以：

```javascript
keyword = Web Device

```

同一批内容不需要复制。

可以理解成：

```javascript
Content Object
      ↓
Source
      ↓
Filter / Sort / Limit
      ↓
Component
      ↓
Page

```

这实际上已经非常接近现代内容系统和数据驱动 UI 的架构。

---

# 十六、Web Component 才是网站的“视觉积木”

假设我们有：

```javascript
article-card
hero-banner
portal-header
portal-footer
content-card
related-content

```

那么页面不需要重新实现它们。

可以理解为：

```javascript
Page
 ├── Header
 ├── Hero
 ├── Article List
 │    ├── Article Card
 │    ├── Article Card
 │    └── Article Card
 └── Footer

```

而真正的 HTML、CSS、slots、响应式设计则由 Component 负责。

这就是：

```javascript
AUP Layout
      ↓
Component
      ↓
HTML/CSS

```

而不是：

```javascript
AUP
 ↓
直接替代所有 HTML/CSS

```

官方文档也建议，把 header、card、section 等重复出现的视觉结构放进 `.web/components/&lt;name&gt;/`，而不要在每个页面复制一套 UI tree。

---

# 十七、Theme 和 Tokens：网站统一视觉

如果网站有：

```javascript
颜色
字体
间距
圆角
阅读宽度
Accent
Surface

```

不要每个组件自己定义。

Web Device 提供：

```javascript
.web/tokens.json

```

作为设计 Token 的位置。

例如：

```javascript
tokens
 ├── surface
 ├── text
 ├── accent
 ├── spacing
 ├── radius
 └── typography

```

核心思想不是：

```javascript
第三张卡片 = 蓝色

```

而是：

```javascript
accent = brand accent

```

这样以后修改整个网站的视觉系统，只需要改变 Token。

官方文档也明确建议 Token 表达语义，而不是绑定某个具体页面或某个具体组件的位置。

---

# 十八、Markdown 在 Web Device 中扮演什么角色？

Web Device 并没有要求所有内容都写 AUP。

对于文章、文档等阅读型内容，Markdown 是非常自然的选择：

```javascript
content.md
     ↓
Markdown Reader
     ↓
AUP Tree
     ↓
Document Renderer
     ↓
HTML

```

因此可以继续使用我们熟悉的：

```javascript
# 标题

正文。

## 小标题

- 列表
- 列表

| A | B |
|---|---|
| 1 | 2 |

```

同时 Web Device 还提供了一系列 Markdown directives，例如：

```javascript
::embed
card-group

```

以及 Markdown Slides、Gallery 等能力。

但需要注意：

**这些 Markdown 能力主要解决“内容呈现”，并不自动变成 AUP Session 或可写入的数据操作。**

例如一个 Markdown action-card 的链接并不意味着它拥有 `exec`、数据写入或者编辑权限。

---

# 十九、Page、Content、Component 三者应该如何配合？

这是开发 Web Device 时最重要的架构原则之一。

可以记住：

```javascript
Content
“我是什么？”

Page
“我在哪里显示？”

Component
“我长什么样？”

Source
“我要显示哪些？”

Theme
“整个网站保持什么视觉语言？”

```

最终形成：

```javascript
Content
   ↓
Source
   ↓
Page Layout
   ↓
Web Component
   ↓
Theme / Tokens
   ↓
HTML

```

这比传统“一个页面里面写完所有东西”的方式更容易复用。

---

# 二十、Web Device 的路由是如何产生的？

Web Device 的路由主要来自文件结构。

例如：

```javascript
pages/index/

```

对应：

```javascript
/

```

```javascript
pages/about/

```

对应：

```javascript
/about/

```

内容对象：

```javascript
content/articles/first-post/

```

则可以形成文章集合和详情路径。

标签、分页、归档等能力还可以进一步产生对应的路径。

因此：

```javascript
目录结构
      ↓
Route

```

是 Web Device 很重要的设计。

这也意味着不要在组件里面到处硬编码：

```javascript
/zh/xxx
/en/xxx
/articles/abc

```

因为一旦 locale、slug 或路由结构改变，硬编码链接就容易失效。

---

# 二十一、多语言不是复制两个网站

Web Device 的多语言模型值得特别注意。

例如：

```javascript
locale: zh

locales:
  - zh
  - en

```

然后：

```javascript
content/articles/hello/
├── content.md
└── content.en.md

```

页面：

```javascript
pages/about/
├── layout.aup
└── layout.en.aup

```

SEO：

```javascript
pages/about/seo/
├── title
├── title.en
├── description
└── description.en

```

因此：

```javascript
同一个站点
     ↓
多个 locale
     ↓
同一套内容对象
     ↓
不同语言视图

```

而不是：

```javascript
中文网站
英文网站
两个完全独立的网站

```

官方文档也明确建议，不要通过复制整个目录树来实现多语言。

---

# 二十二、SEO 是 Web Device 的重要能力

传统静态网站通常需要额外配置：

```javascript
title
description
canonical
Open Graph
Twitter Card
JSON-LD
hreflang
sitemap

```

Web Device 则可以根据：

```javascript
site
page
content
locale

```

组装对应的 SEO 信息。

例如：

```javascript
.web/site.yaml
        ↓
全站 SEO 默认值

pages/<name>/seo/
        ↓
页面 SEO

content/<type>/<slug>/
        ↓
内容 SEO

```

官方文档明确列出了 canonical、`hreflang`、Open Graph、Twitter metadata 和 JSON-LD 等能力。

但自动生成 metadata 不等于网站天然就能被搜索引擎发现，也不等于自动获得良好的可访问性。

最终仍然需要实际检查页面结构、链接、移动端布局和可访问性。

---

# 二十三、Web Device 和 UI Device 不要混淆

这也是理解 ArcBlock 新架构非常关键的一点。

可以简单理解：

```javascript
UI Device
    ↓
浏览器实时交互
    ↓
AUP Session
    ↓
动态 UI

```

而：

```javascript
Web Device
    ↓
服务端渲染
    ↓
Static HTML
    ↓
网站

```

它们不是互相取代。

可以用一个简单的比喻：

```javascript
UI Device = 终端
Web Device = 印刷机

```

UI Device 更强调实时交互和动态 Session；Web Device 更强调把 AFS 中的页面、内容和网站声明直接生成完整的网站页面。ArcBlock 官方文章也明确将两者描述为两条不同的渲染路径。

---

# 二十四、为什么 Web Device 对 Agent 很有意义？

到这里，Web Device 和前面的 AUP、AFS 就真正连起来了。

传统网站：

```javascript
Developer
    ↓
React / Vue
    ↓
HTML

```

而 ARC 的方向更接近：

```javascript
Human / Agent
       ↓
AFS
       ↓
Content + AUP + Web Components
       ↓
Web Device
       ↓
Website

```

Agent 可以参与的不再只是：

```javascript
写一段 React

```

而可以进一步理解：

```javascript
创建内容
修改页面
组织内容集合
选择 Layout
调整组件
生成不同页面
检查 SEO
构建网站

```

这就是 Web Device 与 Agentic Computing 结合后值得关注的地方。

网站逐渐从：

**“代码组成的应用”**

变成：

**“可以被 Agent 理解和操作的结构化资源”。**

---

# 二十五、一个完整 Web Device 项目的结构

把前面的知识合在一起，一个较完整的网站可能长这样：

```javascript
my-site/
│
├── blocklet.yaml
│
├── .route/
│   └── web
│
├── .web/
│   ├── site.yaml
│   ├── tokens.json
│   ├── components/
│   │   ├── site-header/
│   │   ├── article-card/
│   │   ├── hero-banner/
│   │   └── site-footer/
│   └── template/
│
├── pages/
│   ├── index/
│   │   ├── layout.aup
│   │   └── sources/
│   │       └── articles
│   │
│   ├── articles/
│   │   └── layout.aup
│   │
│   └── about/
│       └── layout.aup
│
└── content/
    └── articles/
        ├── first-post/
        │   ├── content.md
        │   └── cover.png
        │
        └── second-post/
            ├── content.md
            └── cover.png

```

它已经非常接近一个真正的内容网站。

---

# 二十六、推荐的 Web Device 开发流程

不要一开始就研究所有组件、Theme 和 Markdown directive。

更有效的学习路线是：

```javascript
1. ARC CLI
      ↓
2. Basic Blocklet
      ↓
3. .route/web
      ↓
4. .web/site.yaml
      ↓
5. pages/
      ↓
6. AUP Layout
      ↓
7. Web Component
      ↓
8. content/
      ↓
9. Source Binding
      ↓
10. Theme / Tokens
      ↓
11. SEO / Locale
      ↓
12. Build / Diagnose

```

第一阶段只解决：

**“我能不能跑起来？”**

第二阶段解决：

**“我能不能建立页面？”**

第三阶段解决：

**“我能不能建立内容系统？”**

第四阶段解决：

**“我能不能把网站做成真正可维护的产品？”**

---

# 二十七、遇到问题时，不要直接重新部署

Web Device 出现问题时，建议按照下面的顺序排查：

```javascript
arc dsl lint .
        ↓
arc dsl validate .
        ↓
arc blocklet check .
        ↓
arc blocklet build .
        ↓
arc blocklet run .
        ↓
Browser

```

它们分别解决不同问题：

| 检查  | 主要解决  |
|---|---|
| `arc dsl lint`  | DSL 编写问题  |
| `arc dsl validate`  | AUP/Layout/Source contract  |
| `arc blocklet check`  | Blocklet 与 profile  |
| `arc blocklet build`  | 构建和 artifact  |
| `arc blocklet run`  | 本地真实运行  |
| Browser  | 用户最终看到什么  |

例如：

```javascript
页面空白

```

不要马上怀疑 ARC。

先判断：

```javascript
DSL 错了？
Layout 错了？
Source 没声明？
Source 返回 0？
Component 不存在？
Build 失败？
浏览器拿到了旧页面？

```

官方诊断文档也建议从最窄的失败边界开始定位，而不是一看到页面异常就进入部署流程。

---

# 二十八、最容易踩的几个坑

### 1. 把 Web Device 当成 React

Web Device 不是 React/Vue 的替代语法，而是 ARC 中基于 AFS 的网站渲染模型。

### 2. 认为所有 AUP primitive 都可以直接放进 Layout

这是非常重要的误区。

Web Device 中存在 native AUP tree 的静态渲染路径，但 `layout.aup` 仍然遵循 Web Component + Props contract。

**Primitive 存在 ≠ 一定可以作为 Web Layout section。**

### 3. 把文章正文写进 Page

正确方式是：

```javascript
content/
   ↓
source
   ↓
layout

```

而不是：

```javascript
page
 └── 写死所有文章

```

### 4. 把内容复制成多个语言目录

应该使用：

```javascript
content.md
content.zh.md
content.en.md

```

而不是复制多个 slug。

### 5. 看到 Build 成功就认为网站完成

Build 成功只证明构建过程能够完成。

真正验收仍然需要：

```javascript
arc blocklet run .
        ↓
Browser
        ↓
真实页面

```

### 6. 把 Theme 和 Component Overlay 混在一起

Theme、tokens、component overlay 是不同层次。特别是在 beta 版本中，不同来源的 cascade 和解析规则需要按照目标版本实际验证。

---

# 二十九、从传统 Web 开发重新理解 Web Device

如果把传统 Web 开发和 Web Device 放在一起看，会发现一个非常有意思的变化。

传统模式：

```javascript
页面
 ↓
组件
 ↓
数据
 ↓
API
 ↓
数据库

```

Web Device 更强调：

```javascript
AFS
 ↓
Content
 ↓
Source
 ↓
AUP Layout
 ↓
Web Component
 ↓
HTML

```

而 ARC 的完整体系则可以进一步理解为：

```javascript
                 ┌── AUP ──→ UI / Layout
                 │
AFS ─────────────┼── Content → Website
                 │
                 └── Actions / Resources
                         ↓
                      Runtime
                         ↓
                   Web Device
                         ↓
                        HTML

```

这使网站不再只是一个“前端项目”，而成为 AFS 中一种可以被 ARC 和 Agent 理解的资源。

---

# 三十、Web Device 真正值得关注的地方

Web Device 最值得关注的地方，不是“又出现了一个静态网站生成器”。

它真正有意思的是：

**ArcBlock 正在尝试把网站纳入 AFS + AUP + Agent 的统一计算模型。**

在这个模型里：

```javascript
Content 是数据
AUP 是语义 UI
Component 是 Web 呈现
Web Device 是 Renderer
AFS 是资源空间
ARC 是 Runtime
Agent 是使用这些资源的参与者

```

于是网站可以不再被理解为一堆：

```javascript
HTML
CSS
JS
Markdown
Build Script
Deploy Script

```

而可以理解为：

```javascript
一个结构化的、可组合的、可被机器理解的网站资源空间。

```

这也是 Web Device 和传统静态网站技术之间最值得研究的区别。

---

# 三十一、从 AUP 到 Web Device：两篇教程应该如何连起来？

如果前一篇文章是：

**《AUP 从入门到实战：理解 ArcBlock 的 Agentic UI Protocol》**

那么这一篇实际上就是下一层：

```javascript
AUP
 ↓
理解 Semantic UI
 ↓
Web Device
 ↓
理解 Website
 ↓
AFS Content
 ↓
Agentic Website

```

前一篇回答：

> UI 如何被机器理解？
> 

这一篇回答：

> 一个真正的网站如何成为 AFS 中可以被 ARC 和 Agent 理解、组织和渲染的资源？
> 

两者结合之后，ArcBlock 的 Web 技术路线就比较清楚了：

```javascript
AFS
 │
 ├── Resources
 │
 ├── Content
 │
 └── Services
       ↓
     AUP
       ↓
  Semantic UI
       ↓
 ┌───────────────┐
 │               │
 ▼               ▼
UI Device     Web Device
 │               │
 ▼               ▼
实时 UI       Static HTML

```

**这可能才是理解 Web Device 最重要的一张架构图。**

---

# 结语：网站正在从“代码”变成“资源”

传统网站开发的核心问题是：

> 如何把代码运行成一个网站？
> 

而 Web Device 更像是在问：

> 如果网站本身就是 AFS 中的一组结构化资源，ARC 能不能直接理解、组合和渲染它？
> 

从当前的设计来看，答案已经逐渐形成。

`pages/` 定义页面，`content/` 定义内容，`.web/` 定义网站能力，AUP 描述 Layout，Component 承担 Web 呈现，Source 负责内容选择，Theme 和 Tokens 管理视觉系统，最终由 Web Device 生成 HTML。

```javascript
AFS
 ↓
Content + Page + Web
 ↓
AUP + Source + Component
 ↓
Web Device
 ↓
Static HTML
 ↓
Website

```

这条路线真正值得关注的，并不是它是否马上替代现有 Web Framework，而是它是否能够成为一种**面向 Agent、结构化内容和新型应用运行时的 Web 基础设施**。

如果 AUP 解决的是“Agent 如何理解 UI”，那么 Web Device 解决的就是：

**“Agent 如何理解、构建和发布一个网站。”**
