---
title: 'ARC 技术总览：Agentic Realm Computer 的技术图谱、技术清单与教程索引'
description: '一页看懂 ArcBlock ARC 的全部技术面：从 ARC Runtime、AFS、AUP、Web Device、Blocklet 到身份与数据空间、Agent Access，每一层都给出官方文档入口和本站对应教程，方便先总览、再深入。'
pubDate: '2026-10-12'
tags: ['ARC', 'AFS', 'AUP', 'Blocklet', 'AI']
cover: '/images/covers/arc-tech-overview.jpg'
---

ArcBlock 的技术名词这两年变得很快：ARC、AFS、AUP、AOS、AIGNE、Web Device、Blocklet、DID Space、Agent Access……单个词都能查到文档，但很少有人把它们**放在一张图上**看。

结果是：想知道"我要做的东西应该从哪一层下手"，得先读完五篇文档。

这篇是总览页。它做四件事：

1. 用一张图说清 ARC 的技术分层；
2. 用一张表把每项技术、它解决什么问题、官方文档在哪，逐条列出来；
3. 每一项都挂上本站已经写过的对应教程，读完总览可以直接跳到细节；
4. 用**官方文档站自己**当活例子——它就运行在 ARC 上，并且原生支持 MCP，可以直接被 Agent 调用。

如果你只需要一个入口，那就是官方文档：**<https://www.arcblock.io/en/docs/>**（中文：**<https://www.arcblock.io/zh/docs/>**）。本文负责的是"先看懂地图"，官方文档负责"给出当前合同"。

---

## 一、一句话定义 ARC

> **ARC（Agentic Realm Computer，代理式领域计算机）是 ArcBlock 的应用运行时：它把一个应用需要的数据、身份、能力和界面统一成按路径寻址的资源，然后让人和 AI Agent 用同一套资源跑同一个应用。**

拆成三句话：

- **对应用来说**，ARC 是"运行环境"——你把应用打包成 **Blocklet**，交给 ARC 跑起来。
- **对数据来说**，ARC 把一切资源变成**路径**——由 **AFS**（Agentic File System）统一寻址，不管背后是本地文件、数据库、DID Space 还是外部 API。
- **对 Agent 来说**，ARC 让应用天然可接入——每个 Blocklet 都自带 **MCP 端点**和发现文档，外部 Agent 不需要你额外开发就能找到它、读它。

一句话对比传统方案：

```text
传统：应用 = 代码 + 数据库 + 部署脚本 + 一堆适配
ARC：应用 = Blocklet（声明）+ 路径化资源（AFS）+ 身份（DID）

传统：给人类做 UI，给 Agent 单独做 API
ARC：同一份资源，Web Device 渲染给人，MCP / AFS 暴露给 Agent
```

---

## 二、技术总结概览

### 2.1 分层图谱

```text
┌──────────────────────────────────────────────────────────────┐
│  入口层        arc CLI  ·  arc service  ·  AFS Explorer       │
├──────────────────────────────────────────────────────────────┤
│  应用层        Blocklet（package / instance）                 │
├──────────────────────────────────────────────────────────────┤
│  界面层        AUP（交互界面）· Web Device（静态站点）· AFS UI │
├──────────────────────────────────────────────────────────────┤
│  身份与数据层  DID  ·  DID Space  ·  Session  ·  CallerInfo   │
├──────────────────────────────────────────────────────────────┤
│  资源层        AFS（Path → Mount → Provider → Capability）    │
├──────────────────────────────────────────────────────────────┤
│  运行时层      ARC Runtime                                    │
├──────────────────────────────────────────────────────────────┤
│  对外协议层    MCP  ·  AFS over HTTP  ·  llms.txt  ·  OAuth   │
└──────────────────────────────────────────────────────────────┘
```

从上往下读，是"我要做一个应用"的路径；从下往上读，是"这个能力是谁提供的"的路径。

### 2.2 三条不变量

ARC 的设计里有三件事几乎不变，理解了它们，其他名词都是推论：

| 不变量 | 含义 | 直接后果 |
| --- | --- | --- |
| **一切皆资源，资源皆有路径** | AFS 用路径统一寻址数据与能力 | 不需要为每个数据源学一套 API |
| **一切身份皆 DID，一切授权皆能力** | 身份和"能做什么"是两件事 | 登录成功不等于能写（见 Agent Access 的四道闸） |
| **一切能力皆可声明** | Provider / Blocklet 都要声明自己支持什么 | 不支持的操作不会伪装成支持 |

第二条最容易被误解，也是 ARC 和普通 Web 应用差别最大的地方：**ARC 里"你是谁"和"你能干什么"由不同层决定，凭证只解决第一层。**

### 2.3 容易混淆的五组名字

| 名字 | 是什么 | 不是什么 |
| --- | --- | --- |
| **ARC** | 应用运行时（Agentic Realm Computer） | 不是区块链，不是 Circle 的 Arc 链 |
| **AFS** | ARC 里的路径寻址资源层 | 不是 Linux 文件系统，不等于"所有数据存一起" |
| **AUP** | 声明式交互界面契约 | 不是 UI 组件库，不是 React/Vue 的替代品 |
| **Web Device** | 把 AFS 资源渲染成静态站点的 Provider | 不是 AUP 的别名，也不是通用前端框架 |
| **Blocklet** | 应用打包与运行单元（package + instance） | 不是 AUP / Web Device / Provider 的同义词 |

顺带把更容易搞混的"ARC 之外"的名字也钉住：

| 名字 | 关系 |
| --- | --- |
| **AIGNE** | AI Agent 框架（提示工程层），是 ARC 生态的上游栈，不是 ARC 本身 |
| **AOS** | Agentic Operating System（控制工程层），ARC 分层中的下层抽象 |
| **ArcBlock Chain** | ArcBlock 的 Layer 1 链，运行网络称 ABT Network，与 ARC 是两套东西 |
| **Circle Arc** | Circle 的区块链，和 ArcBlock 的 ARC 完全无关 |
| **Blocklet Server** | ARC 出现之前的旧运行时，能力延续但不等价 |

> 官方对此有专门一页做历史命名映射：[产品谱系与边界](https://www.arcblock.io/zh/docs/architecture/product-lineage/)。当你在旧文章里看到 Blocklet Server，就到这里对照。

---

## 三、ARC 技术清单

下面按层列出 ARC 涉及的全部技术。每一行都给：**它解决什么问题**、**官方文档**、**本站教程**。

### 3.1 运行时层

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **ARC Runtime** | 承载 AFS、身份、Provider、Blocklet 的运行环境 | [ARC 架构](https://www.arcblock.io/zh/docs/architecture/) · [ARC 产品页](https://www.arcblock.io/zh/arc/) | [ARC 架构发布解读](./arc-agentic-realm-computer/) |
| **ARC 2.0 分层模型** | 系统地图、分层归属、读文档的顺序 | [心智模型](https://www.arcblock.io/zh/docs/architecture/mental-model/) · [产品分层](https://www.arcblock.io/zh/docs/architecture/product-layers/) | 本文第二节 |
| **合同与证据** | 区分"当前合同"和"历史谱系"，避免把源码目录当公开 API | [Contracts and evidence](https://www.arcblock.io/zh/docs/architecture/contracts-and-evidence/) | — |

ARC 的文档有一条很值得学的规矩：**过去时、现在时、计划中的说法是分开的**。同一页上会标明这一页是拿哪个版本核对的。读文档时建议先看这页的版本边界。

### 3.2 入口层：arc CLI

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **arc CLI** | 控制 ARC Runtime 的命令行入口 | [ARC CLI 总览](https://www.arcblock.io/zh/docs/arc-cli/) · [安装](https://www.arcblock.io/zh/docs/arc-cli/install/) | [ARC Runtime / arc CLI 全架构逆向研究](./arc-runtime-cli-architecture/) |
| **arc service** | 把 Runtime 作为常驻服务跑起来 | [serve / service 命令](https://www.arcblock.io/zh/docs/arc-cli/command-reference-service/) | 同上 |
| **命令组** | `arc afs` / `arc blocklet` / `arc did` / `arc space` / `arc vault` / `arc provider` / `arc mcp` / `arc deploy` / `arc dsl` / `arc skill` | [命令参考](https://www.arcblock.io/zh/docs/arc-cli/command-reference-blocklet/) | 同上 |
| **AFS Explorer** | 图形化浏览 AFS 路径 | [AFS Explorer](https://www.arcblock.io/zh/docs/afs/explorer/) | [AFS 从入门到实战](./afs-intro/) |

一条容易被忽略的边界：**CLI 是入口，Runtime 才是能力本体。** 不要因为"命令多"就把每个命令组当成一个独立产品。

### 3.3 资源层：AFS

这一层是 ARC 最核心的抽象，也最值得花时间。

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **AFS** | 路径可寻址的资源与能力层 | [AFS 总览](https://www.arcblock.io/zh/docs/afs/) | [AFS 从入门到实战](./afs-intro/) |
| **Path** | 资源的虚拟地址 | [核心合同](https://www.arcblock.io/zh/docs/afs/core-contract/) | 同上 |
| **Mount** | 把路径前缀接到某个 Provider | [Provider 与挂载](https://www.arcblock.io/zh/docs/afs/providers/) | 同上 |
| **Provider** | 真正执行操作、并声明自己支持什么的模块 | [编写 Provider](https://www.arcblock.io/zh/docs/afs/author-a-provider/) · [Provider 目录](https://www.arcblock.io/zh/docs/afs/provider-catalog/) | 同上 |
| **Capability** | Provider 声明的操作集合（读、写、搜、执行……） | [核心合同](https://www.arcblock.io/zh/docs/afs/core-contract/) | 同上 |
| **操作集** | list / read / write / delete / rename / stat / search / exec / explain | [核心合同](https://www.arcblock.io/zh/docs/afs/core-contract/) | 同上 |
| **search vs query** | 自由文本检索与结构化查询是两件事 | [搜索与查询](https://www.arcblock.io/zh/docs/afs/search-and-query/) | 同上 |
| **运行时边界** | 什么时候路径"存在"但操作"不可用" | [运行时边界](https://www.arcblock.io/zh/docs/afs/runtime-boundaries/) | 同上 |

三个必须记住的判断：

1. **路径是接口边界，不是"数据都在一个库里"的证据。** Provider 自己决定数据怎么存。
2. **`list`、`search`、`query` 不通用。** 枚举、结构化查询、全文检索在 AFS 里是三种能力，Provider 可以只支持其中一部分。
3. **源码 `providers/` 目录是实现清单，不是公开支持目录。** 这是官方明确写的免责边界。

### 3.4 界面层：AUP、Web Device、AFS UI

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **AUP** | 声明式语义界面契约（Agentic UI Protocol） | [AUP 总览](https://www.arcblock.io/zh/docs/aup/) · [概念](https://www.arcblock.io/zh/docs/aup/concepts/) | [AUP 从入门到实战](./aup-intro/) |
| **Semantic Tree** | AUP 的核心：机器可理解的界面树 | [Semantic Tree](https://www.arcblock.io/zh/docs/aup/semantic-tree/) | 同上 |
| **AUP DSL** | 更适合人手写的描述方式 + 校验/生成/迁移 | [用 DSL 编写](https://www.arcblock.io/zh/docs/aup/author-with-dsl/) · [DSL 生成/校验/迁移](https://www.arcblock.io/zh/docs/aup/dsl-generate-lint-migrate/) | 同上 |
| **Session / Patch / Scene** | AUP 为什么是动态界面 | [事件、状态与绑定](https://www.arcblock.io/zh/docs/aup/events-state-bindings/) | 同上 |
| **DeviceCaps / Degradation** | 同一份 UI 如何适配不同设备 | [设备能力与降级](https://www.arcblock.io/zh/docs/aup/device-capabilities-degradation/) | 同上 |
| **Primitive 支持矩阵** | 哪些节点在哪些目标上真的支持 | [Primitive 支持矩阵](https://www.arcblock.io/zh/docs/aup/primitive-support-matrix/) | 同上 |
| **Caller Identity 与安全** | UI 不是权限系统 | [Caller Identity 与安全](https://www.arcblock.io/zh/docs/aup/caller-identity-safety/) | 同上 |
| **Web Device** | 把 AFS 资源树渲染成静态站点的 Provider | [Web Device 总览](https://www.arcblock.io/zh/docs/web-device/) · [编写](https://www.arcblock.io/zh/docs/web-device/author/) | [Web Device 从入门到实战](./web-device-intro/) |
| **Content Object** | 内容与页面分离的结构化内容单元 | [Web Device 编写](https://www.arcblock.io/zh/docs/web-device/author/) | 同上 |
| **组件与 Override** | 站点组件与主题覆盖 | [内置组件](https://www.arcblock.io/zh/docs/web-device/built-in-components/) · [组件覆盖](https://www.arcblock.io/zh/docs/web-device/components-overrides/) | 同上 |
| **AFS UI** | 说明 UI 关注点如何投射回 AFS 的架构视角 | [AFS UI](https://www.arcblock.io/zh/docs/architecture/afs-ui/) | — |

这里要特别钉一个常见误解：

> **AUP ≠ Web Device。** AUP 描述"交互界面树"，Web Device 负责"把结构化资源渲染成静态站点"。两者可以组合（Web Device 里用 AUP 写 Layout），但不是同一层的东西。AFS UI 更不是第三个平级的大板块，它只是一个架构透镜。

### 3.5 应用层：Blocklet

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **Blocklet** | ARC 打包与运行应用的单元 | [Blocklets 总览](https://www.arcblock.io/zh/docs/blocklets/) | [Blocklet 从入门到实战](./blocklet-intro/) |
| **Package 与 Instance** | 不可变的可复用单元 vs 一次具体运行形态 | [Package 与 Instance](https://www.arcblock.io/zh/docs/blocklets/package-and-instance/) | 同上 |
| **blocklet.yaml / Manifest** | 应用的"身份证"与能力声明 | [Manifest 与能力](https://www.arcblock.io/zh/docs/blocklets/manifest-and-capabilities/) | 同上 |
| **本地创建与运行** | 不远程部署即可脚手架与验收 | [本地创建与运行](https://www.arcblock.io/zh/docs/blocklets/create-run-locally/) | 同上 |
| **check / build / inspect** | 校验、构建、查看产物 | [检查、构建与 inspect](https://www.arcblock.io/zh/docs/blocklets/check-build-inspect/) | 同上 |
| **数据与 AFS** | Blocklet 如何挂载和使用 AFS | [数据与 AFS](https://www.arcblock.io/zh/docs/blocklets/data-and-afs/) | 同上 |
| **Surface** | 一个 Blocklet 可以有多个对外面（Web / AUP / Agent） | [Web surface](https://www.arcblock.io/zh/docs/blocklets/web-surfaces/) | 同上 |
| **生命周期与发布** | 本地验收到发布部署的边界 | [生命周期](https://www.arcblock.io/zh/docs/blocklets/lifecycle/) · [发布与部署](https://www.arcblock.io/zh/docs/blocklets/publish-deploy/) | 同上 |
| **参考应用** | ARC 仓库里的真实 package 长什么样 | [参考应用](https://www.arcblock.io/zh/docs/blocklets/reference-applications/) | — |

ARC 在 Blocklet 上有一个非常明确的取向：**本地优先**。官方推荐的日常开发链路是本地目录 + 隔离 ARC 环境：

```bash
arc blocklet create ./my-app --recipe minimal-app --name my-app
arc dsl validate ./my-app
arc blocklet check ./my-app --profile minimal-app
arc service start --blocklet ./my-app --port 4939
# 打开 http://my-app.localhost:4939/
```

这条链路能证明"源码 + 声明契约 + 本地运行时接受的 surface"，但**不能**证明远程发布链路在你的机器上可用。分清这两件事，可以省掉很多困惑。

### 3.6 身份与数据层

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **Identity & Data Spaces** | 谁在调用、能看到哪份数据 | [总览](https://www.arcblock.io/zh/docs/identity-data-spaces/) · [核心模型](https://www.arcblock.io/zh/docs/identity-data-spaces/core-model/) | [Identity & Data Spaces 从入门到实战](./identity-data-spaces-intro/) |
| **CallerInfo** | Runtime 眼中的"当前调用者" | [Caller context](https://www.arcblock.io/zh/docs/identity-data-spaces/caller-context/) | 同上 |
| **DID** | 可验证的主体标识 | [Identity 总览](https://www.arcblock.io/zh/docs/identity-data-spaces/) | 同上 |
| **DID Space** | 按 DID 作用域组织的持久化存储 Provider | [DID Space](https://www.arcblock.io/zh/docs/identity-data-spaces/did-space/) | 同上 |
| **Session 数据视图** | `/user`、`/tmp`、`/space` 三类视图 | [Session 数据](https://www.arcblock.io/zh/docs/identity-data-spaces/session-data/) · [Session 视图](https://www.arcblock.io/zh/docs/identity-data-spaces/session-views/) | 同上 |
| **Data Space** | 描述调用者数据上下文的文档术语 | [Data Space 术语](https://www.arcblock.io/zh/docs/identity-data-spaces/data-space-term/) | 同上 |
| **DID Connect** | 应用与钱包之间的身份握手 | [DID Connect](https://www.arcblock.io/zh/docs/identity-data-spaces/did-connect/) | 同上 |
| **arc space / arc did / arc vault** | 本地查看身份、数据空间与密钥 | [space 命令](https://www.arcblock.io/zh/docs/arc-cli/command-reference-space/) | [arc CLI 逆向研究](./arc-runtime-cli-architecture/) |

一句话记住这一层：

> **谁（CallerInfo）→ 看到什么（Session）→ 数据属于谁（DID Space）→ 能做什么（Provider Capability）。**

### 3.7 对外协议层：Agent Access

| 技术 | 一句话 | 官方文档 | 本站教程 |
| --- | --- | --- | --- |
| **Agent Access** | 外部 Agent 如何发现、连接、授权并使用一个 Blocklet | [Agent Access 总览](https://www.arcblock.io/zh/docs/agent-access/) | [Agent Access 从入门到实战](./agent-access-intro/) |
| **`POST /mcp`** | 每个 Blocklet 自带的 MCP 端点（streamable HTTP，无状态） | [连接客户端](https://www.arcblock.io/zh/docs/agent-access/connect-a-client/) · [端点](https://www.arcblock.io/zh/docs/agent-access/endpoints/) | 同上 |
| **`POST /api/afs/rpc`** | 同一批操作的 JSON-RPC 形式，给不会 MCP 的客户端 | [AFS over HTTP](https://www.arcblock.io/zh/docs/agent-access/afs-over-http/) | 同上 |
| **`GET /llms.txt`** | 纯文本指针，点名上面两条 | [llms.txt](https://www.arcblock.io/zh/docs/agent-access/llms-txt/) | 同上 |
| **发现文档** | `/.well-known/` 下的机器可读声明 | [发现面](https://www.arcblock.io/zh/docs/agent-access/discovery-surfaces/) | 同上 |
| **访问分档（四道闸）** | Method allowlist → Credential → Path policy → Provider capability | [访问分档](https://www.arcblock.io/zh/docs/agent-access/access-tiers/) | 同上 |
| **工具声明** | 匿名 `tools/list` 会同时公布读写工具 | [工具](https://www.arcblock.io/zh/docs/agent-access/tools/) | 同上 |
| **授权与设备授权** | OAuth / PKCE，以及无浏览器时怎么拿凭证 | [授权客户端](https://www.arcblock.io/zh/docs/agent-access/authorize-a-client/) · [设备授权](https://www.arcblock.io/zh/docs/agent-access/device-grant/) | 同上 |
| **客户端接入** | Claude Code、Codex CLI 等如何接上 | [接入你的工具](https://www.arcblock.io/zh/docs/agent-access/clients/) | 同上 |
| **错误排查** | `401` vs `200 + isError` 的区别 | [错误](https://www.arcblock.io/zh/docs/agent-access/errors/) | 同上 |

这一层最反直觉、也最值得记住的两句话：

- **`200` 不代表成功。** 每次 `tools/call` 都要检查 `result.isError`。
- **凭证不是写入开关。** 即便带着 owner 凭证，Blocklet 没为该路径开放，照样被拒。

---

## 四、T型速查表：一件事该去哪一层

前面是"有什么"，这张表是"该用谁"。左边是你想做的事，右边是负责的那一层。

| 我想…… | 去哪一层 | 从哪篇开始 |
| --- | --- | --- |
| 把应用跑起来、打包发布 | Blocklet | [Blocklet 从入门到实战](./blocklet-intro/) |
| 让 Agent 能读我的应用内容 | Agent Access | [Agent Access 从入门到实战](./agent-access-intro/) |
| 用统一的路径访问各种数据源 | AFS | [AFS 从入门到实战](./afs-intro/) |
| 用机器可理解的方式描述界面 | AUP | [AUP 从入门到实战](./aup-intro/) |
| 做一个静态网站 | Web Device | [Web Device 从入门到实战](./web-device-intro/) |
| 搞清用户是谁、数据存哪 | Identity & Data Spaces | [Identity & Data Spaces 从入门到实战](./identity-data-spaces-intro/) |
| 只想知道 CLI 和 Runtime 什么关系 | ARC CLI / Runtime | [ARC Runtime / arc CLI 全架构逆向研究](./arc-runtime-cli-architecture/) |
| 想看一个真实的 ARC 应用长什么样 | 官方文档站自己 | 本文第六节 · <https://www.arcblock.io/llms.txt> |
| 知道更多 ARC 相关的技术动态 | — | [ARC 架构发布解读](./arc-agentic-realm-computer/) |

---

## 五、推荐的阅读顺序

有两条路线，取决于你是先动手还是先读懂。

**路线 A：先动手（推荐给要立刻做东西的人）**

```text
① 装 arc CLI
        ↓
② Blocklet 从入门到实战        ← 先把应用跑起来
        ↓
③ AFS 从入门到实战             ← 再理解资源怎么寻址
        ↓
④ Identity & Data Spaces       ← 数据属于谁
        ↓
⑤ Agent Access                 ← 让 Agent 接进来
```

**路线 B：先读懂（推荐给要评估架构的人）**

```text
① 本文（ARC 技术总览）
        ↓
② ARC Runtime / arc CLI 全架构逆向研究
        ↓
③ AFS 从入门到实战
        ↓
④ AUP → Web Device             ← 界面两条路
        ↓
⑤ Blocklet                     ← 应用怎么装起来
        ↓
⑥ Identity & Data Spaces → Agent Access
```

不管走哪条，都建议**先读总览再读细节**。ARC 的难点不在单个概念，而在于"这些概念分别站在哪一层"。

---

## 六、最好的活例子：官方文档站本身就是 ARC 应用

上面所有概念，官方文档站自己就是一次完整实现。这是我在写这篇总览时觉得最值得单独拿出来讲的一点：

> **arcblock.io 运行在 ARC 上，并且原生支持 MCP。**

也就是说，前面讲的那一整套——Blocklet、AFS、MCP、Agent Access、Capability 声明、匿名读与授权写——在这台你天天查文档的服务器上全都真实存在。想验证 ARC 是不是"给 Agent 用的运行时"，不需要先装环境：**直接问官方文档站就行。**

### 6.1 三步发现

任何一个 MCP 客户端（Claude Code、Codex CLI 等）都可以这样接上：

```text
① https://www.arcblock.io/llms.txt                     ← 先读这个
       │
       │  它点名了下面这些地址
       ▼
② https://www.arcblock.io/.well-known/mcp.json         ← 服务器名片
       │
       │  name / transport / authentication / tools
       ▼
③ POST https://www.arcblock.io/mcp                     ← 实际端点
```

`llms.txt` 返回的正是我上面第 3.7 节讲的那套约定：

```text
## For agents

- MCP (Streamable HTTP): https://www.arcblock.io/mcp
- Server card: https://www.arcblock.io/.well-known/mcp.json
- AFS over HTTP (JSON-RPC): POST https://www.arcblock.io/api/afs/rpc
- Tools: search_content, list_content, get_content
- Collections available to agents: publications, learn, articles, docs, glossary, products, technologies
- Anonymous public read; writes require DID-Connect auth
```

`.well-known/mcp.json` 则是一张标准的"服务器名片"，把认证要求写在明面上：

```json
{
  "name": "ArcBlock Site",
  "url": "https://www.arcblock.io/mcp",
  "transport": "streamable-http",
  "authentication": {
    "required": false,
    "oauth_protected_resource": "https://www.arcblock.io/.well-known/oauth-protected-resource"
  },
  "tools": {
    "anonymous": ["search_content", "list_content", "get_content",
                  "afs_read", "afs_list", "afs_search", "afs_stat", "afs_explain"],
    "authenticated": ["afs_write", "afs_delete", "afs_exec"]
  }
}
```

注意这张名片的结构，它其实把我前面强调的"身份与能力分离"直接写成了字段：**匿名能做什么、认证后才能做什么，是两组工具，不是一个开关。**

### 6.2 三类工具，对应三个层次

| 工具 | 层次 | 做什么 |
| --- | --- | --- |
| `list_content` / `search_content` / `get_content` | 内容发现 | 按 collection 列出、检索、取回文档 |
| `afs_list` / `afs_read` / `afs_stat` / `afs_search` / `afs_explain` | AFS 路径访问 | 用路径直接走 AFS 那套操作 |
| `afs_write` / `afs_delete` / `afs_exec` | 授权写入 | 需要 DID-Connect 会话 |

也就是说，前面 AFS 那一节里讲的 `list` / `read` / `stat` / `search` / `explain`，在这里可以逐个亲手试。

### 6.3 亲手跑一次

只要有 `curl`，不需要装任何 SDK：

```bash
# ① 匿名列出可用工具（不需要凭证、不需要 initialize）
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# ② 列出 docs 集合（这一步会暴露背后的 AFS 路径与 Provider）
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call",
       "params":{"name":"list_content","arguments":{"collection":"docs","limit":3}}}'

# ③ 用 AFS 的 stat 看一个路径的真实能力声明
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call",
       "params":{"name":"afs_stat","arguments":{"path":"/packages/content/docs/afs"}}}'
```

第 ② 步的返回会告诉你，内容其实存在于 DID Space 里：

```json
{
  "tool": "list_content",
  "collection": "docs",
  "path": "/packages/content/docs",
  "result": {
    "data": [
      { "id": "afs", "path": "/packages/content/docs/afs",
        "meta": { "kind": "did-space:directory",
                  "provenance": { "provider": "did-space-user" } } },
      { "id": "agent-access", "path": "/packages/content/docs/agent-access", "...": "..." }
    ],
    "total": 58
  }
}
```

第 ③ 步更精彩——它把这一整篇文章的论点用一行输出摆在你面前：

```text
NODE /packages/content/docs/afs
KIND did-space:directory
UPDATED 2026-08-07T07:32:10.783Z
META_CAPABILITIES ["list","read","stat","search","exec","explain"]
META_ACCESSMODE readonly
META_WITHHELDCAPABILITIES ["write","delete"]
SIDE_EFFECT NONE
```

读到什么了？

- **路径、Provider、Capability、AccessMode 全都在这里。** 这正是第 3.3 节讲的那四件事。
- **`META_ACCESSMODE readonly` 和 `META_WITHHELDCAPABILITIES ["write","delete"]`** 说明"能做什么"是**声明出来的**，不是猜出来的。
- 这也解释了第 3.7 节那句话——**凭证不是写入开关**：路径本身是只读的，你带什么凭证都写不进去（要写就得走认证工具和对应的授权路径）。

顺便说明一个"官方文档站也没有超能力"的事实：它的 `search_content` 是按索引模式工作的，我实测时对 `docs` 集合的若干查询命中为 0，但 `list_content` 和 `afs_*` 都正常。这恰恰印证了 AFS 文档里的那句边界：

> 不要假设所有 Provider 都可搜索；**检索覆盖率、索引策略和排序由 Provider 自己决定。**

先 `afs_stat` 看清楚能力，再决定要不要依赖某个操作——这就是 AFS 文档反复强调的工作方式，而官方文档站自己就是最好的示范。

### 6.4 这说明了什么

如果把官方文档站当成一个普通网站，它只是"文档"。

但当你知道它运行在 ARC 上、自带 MCP、用 DID Space 存内容、用 Capability 声明读写边界时，它的性质就变了：

> **它不只是一个给人看的网站，同时是一个可以直接被 Agent 使用的应用。**

而这正是 ARC 想做的事——**同一个应用、同一份数据、同一套能力声明，人和 Agent 用各自的入口进来。** 人用浏览器读文档，Agent 用 MCP 读同一份内容。

如果你想给团队演示"ARC 到底能带来什么"，最省事的做法可能不是先讲架构，而是让他们的 Agent 连上 `https://www.arcblock.io/mcp`。

---

## 七、官方文档索引

官方文档是唯一的合同来源。本文所有链接都可以从这里重新出发：

| 入口 | 地址 | 覆盖什么 |
| --- | --- | --- |
| **文档总入口（英文）** | <https://www.arcblock.io/en/docs/> | 全部开发者文档 |
| **文档总入口（中文）** | <https://www.arcblock.io/zh/docs/> | 同上，官方中文版 |
| **ARC 架构** | <https://www.arcblock.io/zh/docs/architecture/> | 系统地图、心智模型、命名谱系 |
| **AFS** | <https://www.arcblock.io/zh/docs/afs/> | 路径、操作、Provider、边界 |
| **AUP** | <https://www.arcblock.io/zh/docs/aup/> | 界面树、DSL、Session、降级 |
| **Web Device** | <https://www.arcblock.io/zh/docs/web-device/> | 静态站点、内容、组件、主题 |
| **Blocklets** | <https://www.arcblock.io/zh/docs/blocklets/> | package、instance、本地运行、发布 |
| **Identity & Data Spaces** | <https://www.arcblock.io/zh/docs/identity-data-spaces/> | CallerInfo、DID Space、Session |
| **Agent Access** | <https://www.arcblock.io/zh/docs/agent-access/> | MCP、授权、发现、工具 |
| **ARC CLI** | <https://www.arcblock.io/zh/docs/arc-cli/> | 全部命令组与退出码 |
| **旧站文档** | <https://www.arcblock.io/zh/docs-legacy/> | 历史文章与旧命名 |
| **ARC 产品页 / 下载** | <https://www.arcblock.io/zh/arc/> · <https://arc.afsd.io/> | 定位介绍与安装入口 |
| **术语表** | <https://www.arcblock.io/zh/glossary/> | 名词对照 |
| **Agent 入口（llms.txt）** | <https://www.arcblock.io/llms.txt> | 给 Agent 的机器可读指针 |
| **MCP 服务器名片** | <https://www.arcblock.io/.well-known/mcp.json> | 传输方式、认证、工具清单 |
| **MCP 端点** | <https://www.arcblock.io/mcp> | 直接调用的 Streamable HTTP 端点 |
| **AFS over HTTP** | `POST https://www.arcblock.io/api/afs/rpc` | 同一批操作的 JSON-RPC 形式 |
| **全量文本** | <https://www.arcblock.io/llms-full.txt> · <https://www.arcblock.io/llms-docs.txt> | 给 Agent 的完整文档索引 |

官方文档有一句自述值得记住：**"内容以英文版和中文版为准，其他语言版本由 AI 自动翻译。"** 遇到不一致时，以官方指定的版本为准。

---

## 八、最后：这张图应该怎么用

不要试图一次记住所有名词。更有效的用法是：

1. 先记住**第二节那张分层图**（七层，从上到下）。
2. 遇到一个新名词时，先问："它在哪一层？"
3. 然后回到**第三节的技术清单**，找到它对应的官方文档和本站教程。
4. 只有当你要**做一个具体决定**时，才去读官方文档的细节页——因为那里标了版本边界。

ARC 的技术栈看起来名词很多，但结构其实相当克制：**资源按路径寻址，身份用 DID，能力靠声明，应用打包成 Blocklet，界面分交互与静态两条路，对外统一走 MCP。**

把这七层装进脑子，剩下的就只是查文档了。
