---
title: 'AUP 从入门到实战：理解 ArcBlock 的 Agentic UI Protocol'
description: '如果第一次接触 AUP，最容易产生的误解是：AUP 是不是 ArcBlock 自己的 UI 组件库，或者是类似 React、Vue 的前端框架？'
pubDate: '2026-09-20'
tags: ['AUP', 'Blocklet']
---

![ChatGPT Image 2026年9月20日 11_07_32.jpg](/images/posts/bafkreidtrc6jjckputpjnl262kh2e3kzxtcdf3pdv7x5xga3xuzmw54fii.webp)

> **AUP（Agentic UI Protocol）是一种声明式 UI 模型：开发者描述界面、数据、状态和交互，而不是直接规定某一种设备应该如何渲染。运行时根据目标设备的能力，将同一个语义界面呈现为适合当前环境的形式。**
> 

如果第一次接触 AUP，最容易产生的误解是：AUP 是不是 ArcBlock 自己的 UI 组件库，或者是类似 React、Vue 的前端框架？

不是。

AUP 更接近一种**语义化 UI 协议和运行时模型**。它首先描述“应用是什么、有哪些内容、可以做什么”，然后由 Session、Device Capability 和 Renderer 决定最终如何呈现。

可以先记住这条主线：

```javascript
User / Agent → AUP Semantic Tree → Data / Event / Session → DeviceCaps → Renderer → Web / Native / Fallback

```

这也是理解整套 AUP 文档最重要的一张地图。

---

# 一、AUP 到底解决什么问题？

传统 Web 开发通常直接针对浏览器：

```javascript
HTML + CSS + JavaScript → Browser → UI

```

AUP 则把“应用语义”和“具体呈现”分开：

```javascript
Application Intent → AUP Semantic Tree → Device / Renderer → Actual UI

```

例如应用需要表达：

> 一篇文章，有标题、正文、图片和一个打开详情的操作。
> 

传统开发者可能直接写 HTML；AUP 更关注：

```javascript
Title + Body + Media + Action

```

电脑可以把它渲染成完整页面，手机可以采用移动布局，能力较弱的设备则可能只保留文字和基本操作。

所以 AUP 的核心不是“让所有设备显示完全一样”，而是：

> **让不同设备理解同一个应用语义，并根据自身能力进行呈现。**
> 

---

# 二、先把 AUP、AFS、Web Device 分清楚

如果你已经学习过 AFS，这三个概念尤其容易混在一起。

可以简单记成：

```javascript
AFS → 资源、路径、Provider、Action
AUP → 界面、状态、事件、数据绑定、Session
Web Device → Web 网站、页面、内容、组件、HTML
Blocklet → 应用的打包与运行单元

```

它们可以组合：

```javascript
User → AUP UI → Event / Binding → AFS Resource / Action → Runtime → AUP Session → Renderer

```

因此 AUP 并不取代 AFS。

例如用户点击“删除”：

```javascript
AUP：用户触发 Delete Action
          ↓
AFS：这个路径对应什么 Action？
          ↓
Runtime / Provider：当前调用者是否允许？
          ↓
执行结果 → Session / Patch → UI 更新

```

理解这一层关系后，AUP 和 AFS 就不会再显得是两套互相竞争的技术。

---

# 三、AUP 的核心：Semantic Tree

AUP 用 **Node Tree** 描述界面。

一个简单页面可以理解成：

```javascript
App → Page → View → Title + Image + Text + Action

```

Node 的核心字段包括：

| 字段  | 作用  |
|---|---|
| `id`  | 节点稳定身份  |
| `type`  | 节点类型  |
| `props`  | 节点属性  |
| `children`  | 子节点  |
| `src`  | 读取 AFS 数据  |
| `bind`  | 读写 AFS 数据  |
| `propBind`  | 服务端数据映射到属性  |
| `state`  | UI 状态  |
| `events`  | 用户交互  |

AUP 当前提供 `view`、`text`、`media`、`input`、`action`、`table`、`chart`、`map`、`calendar`、`chat`、`editor` 等 Primitive。

但要特别注意：

> **Parser 接受一个 Primitive，不代表所有设备都支持它。**
> 

最终支持情况需要结合目标设备的 `DeviceCaps` 判断。

---

# 四、AUP DSL：用更适合人写的方式描述 UI

AUP 可以使用 JSON 表达，但复杂应用直接写 JSON 可读性较差，因此 ARC 提供了 AUP DSL。

例如：

```javascript
app "Hello AUP" {
  default home

  page home "Home" {
    view {
      h1 "Hello AUP"
      text "Welcome to ArcBlock."
    }
  }
}

```

DSL 本质上还是 AUP Semantic Tree 的一种源码表达方式，不是另一套 UI 协议。

当前项目建议采用 **source first**：

```javascript
.aup Source → lint / validate → runtime
                    ↓
             JSON compatibility artifact

```

如果项目存在 `.aup/app.aup`，它作为权威源码；只有明确需要 JSON 兼容产物时，再使用：

```javascript
arc dsl generate ./hello-aup --write

```

不要同时手工维护 `.aup` 和 JSON 两套源代码。

---

# 五、创建第一个 AUP 应用

第一次学习 AUP，推荐直接使用 ARC 当前的 `minimal-app` recipe。

先查看 recipe：

```javascript
arc blocklet recipe explain minimal-app

```

创建应用：

```javascript
arc blocklet create ./hello-aup --recipe minimal-app --name hello-aup

```

创建以后，可以重点查看：

```javascript
hello-aup/
├── .aup/app.aup
├── pages/index/layout.aup
├── .web/...
├── agents/...
└── seed/settings/...

```

第一次学习不需要马上研究所有目录，先打开：

```javascript
.aup/app.aup

```

然后修改页面内容，观察运行结果。

一个最简单的应用可以理解为：

```javascript
app "Nimbus" {
  default home

  shell {
    header {
      brand "Nimbus"
    }
    footer "Nimbus"
  }

  page home "Home" {
    view {
      h1 "Welcome"
      text "This is my first AUP application."
    }
  }
}

```

其中：

- `app` 定义应用；
- `page` 定义页面；
- `shell` 定义应用级外框；
- `view` 是内容容器；
- `h1`、`text` 等是具体 Primitive。

---

# 六、数据：src、bind、propBind 和 state

AUP 真正区别于静态 UI 的地方，是它可以和 AFS 数据连接。

可以先用一句话区分：

```javascript
src → 读取
bind → 读写
propBind → 服务端数据映射到属性
state → UI 自身状态

```

例如：

```javascript
text {
  from "/profile/name"
}

```

可以理解为：

```javascript
AFS Data → AUP Node

```

这里是读取关系。

如果输入框需要和数据建立读写绑定，则使用 `bind`：

```javascript
input display-name
  bind="/user/persons/$session.did/profile/display-name"

```

它表达：

```javascript
AFS Data ⇄ AUP Input

```

但必须注意：

> **`bind`** **不是授权机制。**
> 

写入是否允许，仍然由调用者身份、AFS scope、Provider 和 Runtime 权限决定。

`propBind` 用于把服务端数据映射到 Node 的属性，适用于服务端管理属性的场景。

而 `state` 是 UI 自己的状态，例如：

```javascript
open = true
loading = false
dirty = true

```

它和 AFS 业务数据不是同一个层次。

---

# 七、事件：让 UI 真正执行操作

AUP 的界面不仅负责展示，还可以产生事件。

常见操作包括：

```javascript
button "Details" -> page details

button "Load" -> set viewer src "/items/42"

button "Bump" -> set dial state {value: 7, dirty: true}

action -> exec "/.auth/logout"

action -> navigate "/login"

```

这些操作可以分成三类：

```javascript
Page Navigation → AUP 页面切换
Node Update     → 修改 Node / State
AFS Exec        → 调用 AFS Action
Browser Navigate→ 浏览器 URL 导航

```

例如：

```javascript
button "Details" -> page details

```

是 AUP 内部页面导航。

而：

```javascript
action -> navigate "/login"

```

是浏览器级 URL 导航。

不要把两者混为一谈。

---

# 八、AUP 与 AFS Action 的结合

当 UI 需要真正执行业务操作时，可以通过 AFS `exec`。

例如：

```javascript
action -> exec "/.auth/logout"

```

完整流程就是：

```javascript
User Click → AUP Event → AFS exec → Provider / Runtime → Result → Patch → UI

```

因此可以把 AUP 和 AFS 的职责理解为：

```javascript
AUP：用户可以做什么？
AFS：系统可以提供什么能力？
Runtime：当前调用者能不能做？

```

这种分层对于 Agent 应用尤其重要，因为 Agent 不只是读取数据，也可能需要执行 Action。

---

# 九、Session 和 Patch：AUP 为什么是动态 UI？

静态 AUP Tree 只解决“页面是什么”。

真实应用还需要处理：

```javascript
用户操作 → 状态变化 → 数据变化 → UI 更新

```

因此 AUP 引入 Session。

可以把 Session 理解成一次持续的交互上下文：

```javascript
AUP Tree → Session → Event / Data Change → Patch → Renderer → Updated UI

```

如果用户只修改了一个按钮状态，就不需要重新发送整个页面。

AUP Patch 支持：

```javascript
create
update
remove
reorder

```

例如：

```javascript
Initial Tree
    ↓
Button: idle
    ↓
Event
    ↓
Patch: Button → loading
    ↓
Current Tree

```

因此 AUP 的运行方式不是传统的“服务器每次返回一整个 HTML 页面”，而是围绕 Tree、Session 和 Patch 持续同步。

---

# 十、DeviceCaps：同一个 AUP 为什么可以适配不同设备？

这是 AUP 最重要的设计之一。

设备会报告自己的能力，Renderer 根据能力决定如何呈现。

能力可能表现为：

```javascript
native
webview
partial
unsupported

```

例如：

```javascript
AUP: editor
       ↓
Desktop → native
Mobile → webview
Limited Device → partial / fallback
Unsupported → degradation

```

因此：

> **AUP 不是要求所有设备使用完全相同的 UI，而是让设备根据自己的能力呈现相同的语义。**
> 

这也是为什么不能看到某个 Primitive 出现在 AUP 文档中，就默认所有设备都支持它。

---

# 十一、Degradation：设备不支持怎么办？

AUP 为部分 Primitive 定义了降级路径。

例如当前 `editor` 可以理解成：

```javascript
editor → input → text

```

也就是说：

> 如果设备无法提供完整 Editor，可以降级到 Input；如果连 Input 都无法使用，还可以进一步降级为 Text。
> 

但不要把它理解成：

> 所有 Primitive 都会自动变成 Text。
> 

只有明确存在 degradation contract 的类型才有这种行为；未知或自定义类型不会自动获得降级规则。

因此开发 AUP 时，应该同时考虑：

```javascript
正常能力 → Partial → Fallback

```

而不是只测试自己电脑上的完整 Renderer。

---

# 十二、Web Device 和 AUP 不等于同一个东西

AUP 可以被 Web Device 使用，但两者不是同一个概念。

可以这样记：

```javascript
AUP       → 描述“界面是什么”
Web Device→ 描述“Web 网站如何组织和呈现”

```

Web Device 还有自己的：

```javascript
Pages
Content
Components
Theme
Routes
HTML Renderer

```

所以：

> AUP 不是 HTML 的简单替代品，Web Device 也不是 AUP 的另一个名字。
> 

如果你做的是传统内容网站，应该重点研究 Web Device；如果做的是需要 Semantic UI、Session、Device Capability 和 Agent interaction 的应用，则应该重点研究 AUP。

---

# 十三、Agent 为什么需要 AUP？

传统 Agent 操作网页，通常需要：

```javascript
Agent → 找页面 → 找按钮 → 模拟操作

```

这很依赖具体网页结构。

AUP 的思路则是提供一个更结构化的语义层：

```javascript
Agent → Semantic UI → Data / Action → Execute → Session Update

```

Agent 不只是看到“这里有一个蓝色按钮”，而可以理解：

> 这是一个 Action。
> 

也可以理解：

> 这个输入绑定到了某个数据。
> 

或者：

> 当前设备不支持某个高级 Primitive。
> 

因此 AUP 的意义并不是“给 Agent 做一套特殊网页”，而是：

> **让应用界面本身具有更明确、可被机器理解的语义。**
> 

---

# 十四、安全：UI 不是权限系统

这是实际开发中最重要的一条原则：

> **按钮是否显示，与用户是否有权限执行操作，是两回事。**
> 

例如：

```javascript
button "Delete" -> exec "/data/delete"

```

只表示 UI 提供了 Delete 操作，并不意味着当前用户一定拥有删除权限。

同样：

```javascript
visible = false

```

也不是安全措施。

真正的授权仍然由：

```javascript
Caller Identity
      ↓
AFS Scope
      ↓
Provider / Runtime Policy
      ↓
Read / Write / Exec Authorization

```

决定。

因此不要把 AUP Tree 当成 ACL，也不要通过隐藏按钮实现安全控制。

`$session` 可以帮助 UI 获取当前 Session 的部分信息，例如：

```javascript
$session.authenticated
$session.role
$session.did

```

但这些信息同样不能替代服务端授权。

---

# 十五、推荐的 AUP 开发流程

实际开发时，可以保持这样一条流程：

```javascript
DSL Source → format → lint → validate → blocklet check → run → Target Renderer 验收

```

对应命令：

```javascript
arc dsl format ./hello-aup --write
arc dsl lint ./hello-aup
arc dsl validate ./hello-aup
arc blocklet check ./hello-aup --profile minimal-app
arc blocklet run ./hello-aup

```

还可以检查 JSON compatibility artifact：

```javascript
arc dsl generate ./hello-aup --check

```

需要实际生成时：

```javascript
arc dsl generate ./hello-aup --write

```

这里要注意：

> `validate` 通过，不代表浏览器中的最终 UI 一定正确；更不代表其他设备一定支持。
> 

完整验收应该包含：

```javascript
Source Validity → Runtime Validity → Target Acceptance

```

也就是：

**代码合法 → 应用能运行 → 目标设备表现正确。**

---

# 十六、从零做一个小项目

如果你准备真正练习 AUP，可以做一个“个人资料”应用。

第一步只显示静态内容：

```javascript
Name
Email
Avatar

```

第二步连接 AFS：

```javascript
/profile/name
/profile/email
/profile/avatar

```

第三步加入：

```javascript
Edit
Save

```

第四步使用 `bind` 建立读写关系。

第五步通过 `action -&gt; exec` 调用业务 Action。

第六步根据 `$session` 显示当前用户相关信息。

最后测试不同 Renderer 和不同 DeviceCaps。

整个练习可以覆盖 AUP 的核心链路：

```javascript
Page → Primitive → Data → Binding → Event → AFS Action → Session → Device Capability → Renderer

```

---

# 十七、AUP 学习顺序

新手不需要一开始就把所有 Primitive 全部记住。

建议按照下面的顺序：

```javascript
AUP 基础
  ↓
App / Page / Node / Primitive
  ↓
Props / src / bind / state
  ↓
Events / Navigation / AFS exec
  ↓
Session / Patch
  ↓
DeviceCaps / Degradation
  ↓
Caller Identity / Security
  ↓
Web Device / Agent

```

Primitive 也建议先掌握：

```javascript
view
text
media
input
action

```

然后再学习：

```javascript
table
chart
map
calendar
chat
editor
canvas
surface

```

这样学习效率会比一开始背完整 Reference 高很多。

---

# 十八、把 AUP 和 AFS 放在一起理解

如果把 AFS 和 AUP 放到同一个架构里，关系就很清楚：

```javascript
                 User / Agent
                      ↓
               AUP Semantic UI
              /      |       \
          Data     Event     State
            ↓        ↓
          AFS Resource / Action
                      ↓
                Runtime / Provider
                      ↓
                 Session / Patch
                      ↓
                   Renderer

```

AFS 负责：

> 资源在哪里、有什么数据、有什么 Action、Provider 提供什么能力。
> 

AUP 负责：

> 这些能力怎样呈现、怎样交互、怎样绑定数据、怎样适配设备。
> 

Runtime 则负责把它们连接起来，并处理 Session、身份、权限和执行过程。

---

# 十九、最容易踩的坑

**把 AUP 当 React。** AUP 是语义 UI 协议，不是传统前端组件框架。

**把** **`src`** **当写权限。** `src` 表达读取，权限由 Runtime / AFS 决定。

**把** **`bind`** **当授权。** Binding 只是数据关系，不会自动授予权限。

**把隐藏按钮当安全措施。** UI 可见性不是 ACL。

**认为 Primitive 一定被所有设备支持。** 必须检查 DeviceCaps。

**认为 validate 通过就是完成。** 还要在实际 Renderer 中验证。

**把 Web Device 和 AUP 当成一个东西。** Web Device 有自己的 Web 页面和组件模型。

**同时维护** **`.aup`** **和 JSON。** 优先维护 `.aup` source，JSON 只作为兼容产物。

---

# 二十、结语：不要从“组件”开始理解 AUP

如果只记住：

```javascript
text
view
input
button
chart
map

```

你学到的是 AUP 的语法。

真正应该理解的是：

```javascript
Semantic Tree
      ↓
Data / State
      ↓
Event / Action
      ↓
Session / Patch
      ↓
Device Capability
      ↓
Degradation
      ↓
Security
      ↓
Renderer

```

AUP 真正改变的不是“怎样少写一点 HTML”，而是把传统 UI 中混在一起的问题拆开：

```javascript
我要表达什么？       → Semantic Tree
数据从哪里来？       → AFS Binding
用户可以做什么？     → Event / Action
界面现在是什么状态？ → State / Session
设备支持什么？       → DeviceCaps
能力不足怎么办？     → Degradation
用户有没有权限？     → Caller / Authorization
最终怎么显示？       → Renderer

```

因此，可以用一句话总结 AUP：

> **先描述应用想表达什么，再让运行时根据数据、调用者和设备能力决定怎样呈现。**
> 

而当它和 AFS 结合以后，就形成了一条完整的应用链路：

```javascript
User / Agent → AUP → AFS → Runtime → Session → Renderer

```

这也是理解 ArcBlock Agent Native 应用架构的一个重要入口。

---

## 官方文档

建议按照本文的顺序继续阅读：

- AUP 总览：`https://www.arcblock.io/zh/docs/aup/`
- 第一个 AUP App：`https://www.arcblock.io/zh/docs/aup/first-app/`
- Semantic Tree：`https://www.arcblock.io/zh/docs/aup/semantic-tree/`
- 事件、状态与绑定：`https://www.arcblock.io/zh/docs/aup/events-state-bindings/`
- Session、Patch 与 Scene：`https://www.arcblock.io/zh/docs/aup/sessions-patches-scenes/`
- Device Capability 与 Degradation：`https://www.arcblock.io/zh/docs/aup/device-capabilities-degradation/`
- DSL Generate / Lint / Migrate：`https://www.arcblock.io/zh/docs/aup/dsl-generate-lint-migrate/`
- Primitive Support Matrix：`https://www.arcblock.io/zh/docs/aup/primitive-support-matrix/`
- Caller Identity 与安全：`https://www.arcblock.io/zh/docs/aup/caller-identity-safety/`

> **版本提示：** ArcBlock 当前文档已经进入 ARC 2.0.0-beta 系列，不同教程页面的 CLI 验证版本可能存在差异。实际操作时建议先执行 `arc --version`，再以当前版本 CLI 和官方文档为准。
>
