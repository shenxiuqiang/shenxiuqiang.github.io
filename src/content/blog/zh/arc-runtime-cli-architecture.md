---
title: 'ARC Runtime / arc CLI 全架构逆向研究'
description: '如果第一次接触 ArcBlock，很容易把 arc 理解成一个普通的命令行工具：安装之后，通过几个命令创建项目、启动服务、部署应用。'
pubDate: '2026-09-17'
tags: ['AFS', 'Blocklet', 'DID', 'ARC']
---

![ChatGPT Image 2026年9月17日 14_21_17.jpg](/images/posts/bafkreicvcqf2b2c3hp5srrgt6jqetoppzqf5jjxez5zaufb76zf7xmdyki.webp)

> 从一个 CLI 命令开始，理解 ArcBlock 背后的 Runtime、AFS、DID、Vault、Space、Provider、MCP 与 Blocklet。
> 

如果第一次接触 ArcBlock，很容易把 `arc` 理解成一个普通的命令行工具：安装之后，通过几个命令创建项目、启动服务、部署应用。

但如果把 `arc CLI` 往下拆一层，会发现它真正有意思的地方并不在“CLI 能执行哪些命令”，而在于它背后连接着一个更大的运行时体系。

本文不从具体项目出发，而是从基础概念开始，逐层逆向理解 `arc CLI` 与 ARC Runtime 的关系，以及 AFS、DID、Vault、Space、Provider、MCP、Skill 和 Blocklet 分别解决什么问题。

需要说明的是：下面部分内容是根据公开文档、命令结构和组件之间的关系进行的架构归纳，其中涉及“逆向理解”的部分属于分析模型，并不等同于 ArcBlock 官方发布的完整内部架构图。

---

## 一、先理解：arc CLI 到底是什么？

最简单的理解是：

**`arc CLI`** **是开发者与 ARC Runtime 之间的命令行控制入口。**

传统 Web 开发通常是：

```javascript
开发者
  ↓
终端
  ↓
npm / Docker / Git / Kubernetes
  ↓
应用

```

而 ArcBlock 的思路更接近：

```javascript
开发者 / Agent
      ↓
    arc CLI
      ↓
  ARC Runtime
      ↓
身份 / 数据 / 密钥 / 能力 / 应用

```

因此，`arc` 不应该只被理解成“创建 Blocklet 的脚手架”。

更准确地说，它承担的是 Runtime 的控制面角色。

开发者可以通过 CLI 与 Runtime 交互，完成服务启动、应用管理、开发调试、部署以及其他 Runtime 能力的操作。

所以理解整个体系的第一个关键点是：

> **不要把 arc CLI 和 ARC Runtime 看成两个独立产品。CLI 更像入口，Runtime 才是实际承载能力的运行环境。**
> 

---

# 二、为什么需要 ARC Runtime？

传统应用开发中，一个应用通常需要自己组合大量基础设施：

```javascript
Web App
 ├── 数据库
 ├── 文件系统
 ├── 用户系统
 ├── 密钥管理
 ├── API
 ├── 外部服务
 └── 部署环境

```

这意味着开发者不仅要写业务逻辑，还需要不断解决“应用如何获得数据、身份和能力”的问题。

ARC Runtime 尝试把其中一部分基础能力统一起来。

可以把它理解成一个长期运行的能力环境：

```javascript
                    ARC Runtime
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
      AFS               DID              Vault
       │                 │                 │
     数据访问            身份              密钥
       │                 │                 │
       └────────────── Space ──────────────┘
                         │
                    Provider
                         │
                 外部数据 / 服务
                         │
                    Blocklet
                    应用能力

```

因此，Runtime 的核心价值并不是“帮你启动一个 Web 服务”。

它更像是在回答：

> **一个应用、开发者或者 AI Agent，如何在一个统一环境里获得身份、数据、密钥和外部能力？**
> 

---

# 三、ARC Runtime 与 arc CLI 的关系

两者的关系可以用操作系统来类比。

如果把 Runtime 看成操作系统，那么：

```javascript
ARC Runtime
    ↑
arc CLI

```

`arc CLI` 是控制 Runtime 的入口，而 Runtime 负责真正承载运行环境。

因此：

```javascript
arc service
     ↓
启动 / 管理 Runtime

arc ...
     ↓
向 Runtime 发出各种操作

Runtime
     ↓
实际提供身份、数据、能力和应用运行环境

```

这个关系非常重要。

因为如果只研究 CLI 命令，很容易把整个 ArcBlock 体系理解成一组开发工具；而从 Runtime 往下看，它更接近一个面向应用与 Agent 的运行环境。

---

# 四、AFS：Runtime 中最值得理解的数据层

如果说 Runtime 是整个系统的运行环境，那么 AFS 可以看作其中非常关键的数据访问抽象。

AFS 通常可以理解为 **Agentic File System**。

它的核心思想不是简单地“再造一个文件系统”，而是：

> **让不同来源的数据，通过统一的路径和访问方式暴露给应用或 Agent。**
> 

传统程序访问数据可能是：

```javascript
本地文件 → fs
数据库   → SQL
HTTP API  → REST
对象存储 → SDK
Git      → Git API

```

而 AFS 希望把这些差异隐藏在统一的数据访问层之后：

```javascript
                 Agent / Application
                         ↓
                     AFS Path
                         ↓
                      Mount
                         ↓
                     Provider
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
            文件       数据库      外部服务

```

所以真正重要的不是“File System”这几个字，而是 **统一访问模型**。

---

# 五、AFS 的核心思想：Path → Mount → Provider

可以把 AFS 理解成三层。

### Path：我要访问什么？

例如：

```javascript
/data/...
/memory/...
/workspace/...
/github/...

```

路径提供统一的访问入口。

### Mount：这个路径连接到哪里？

Mount 决定某个路径背后的数据来源。

### Provider：真正负责访问数据

Provider 可以连接具体的数据源、服务或者能力。

于是形成：

```javascript
Agent
  ↓
AFS Path
  ↓
Mount
  ↓
Provider
  ↓
实际数据 / 外部服务

```

这带来一个重要变化：

**Agent 不一定需要知道数据究竟存在哪里。**

它只需要知道：

```javascript
“我要访问这个路径。”

```

底层由 Runtime 决定如何找到对应的数据。

这也是 AFS 对 Agent 场景有意义的地方。

---

# 六、从 AFS 进一步理解 Agent

如果把传统程序理解成：

```javascript
输入
 ↓
代码
 ↓
输出

```

那么 Agent 更像：

```javascript
Observe
   ↓
Understand
   ↓
Act
   ↓
Verify
   ↓
继续行动

```

Agent 因此需要的不只是模型，还需要大量外部能力：

```javascript
文件
数据库
网络
代码
知识
身份
密钥
第三方服务

```

如果每一种能力都需要一个独立 SDK，Agent 很快会变得复杂。

AFS 提供了一种统一的数据访问思路，而 Runtime 则进一步提供身份、密钥、Provider、MCP 等能力。

于是可以形成：

```javascript
                 AI Agent
                    ↓
              Skill / MCP
                    ↓
               ARC Runtime
                    ↓
              ┌─────┴─────┐
              ↓           ↓
             AFS        Providers
              ↓           ↓
           数据访问     外部能力

```

这也是 ARC Runtime 与普通应用 Runtime 一个值得注意的区别。

---

# 七、DID、Vault、Space：Runtime 的基础设施层

AFS 解决“怎么访问数据”，但一个真正的应用环境还需要解决三个问题：

```javascript
我是谁？
我有哪些秘密？
我的数据属于哪个空间？

```

这对应三个重要概念。

## DID：身份

DID 可以理解为去中心化身份基础。

它解决的是：

```javascript
Who am I?

```

也就是应用、用户或者 Agent 如何拥有一个可验证的身份。

---

## Vault：密钥与秘密

Vault 解决：

```javascript
What secrets can I use?

```

例如：

```javascript
API Key
Token
Credential
Secret

```

它的意义在于，不应该让应用把敏感信息直接散落在代码、配置文件或者 Agent Prompt 中。

---

## Space：数据空间

Space 可以理解为一个围绕身份组织数据、资源和能力的空间。

因此可以形成一个非常简单的关系：

```javascript
DID
 │
 ├── Identity
 │
 └── Space
       │
       ├── Data
       ├── Resources
       └── Capabilities

```

从这个角度看：

> **DID 解决“谁”，Vault 解决“秘密”，Space 解决“数据与资源属于哪里”。**
> 

三者共同构成 Runtime 的基础环境。

---

# 八、Provider：把外部世界接进 Runtime

Runtime 自己不可能拥有所有数据和服务。

所以需要 Provider。

Provider 的作用可以简单理解为：

> **把外部世界的能力接入 Runtime。**
> 

例如：

```javascript
ARC Runtime
     │
     ├── Local Provider
     ├── Git Provider
     ├── Database Provider
     ├── Storage Provider
     └── External API Provider

```

因此 Provider 更像适配层。

它把：

```javascript
外部系统

```

转换成：

```javascript
Runtime 可以理解和管理的能力

```

而 AFS 又可以通过 Mount 把这些 Provider 暴露成统一的数据入口。

于是三者形成闭环：

```javascript
AFS
 ↓
Mount
 ↓
Provider
 ↓
外部系统

```

这也是为什么 AFS 与 Provider 应该放在一起理解。

---

# 九、MCP 与 Skill：Agent 如何使用这些能力？

如果 Provider 解决“Runtime 有什么能力”，那么 MCP 与 Skill 更关注：

> **Agent 如何发现和使用这些能力？**
> 

MCP 可以理解为一种标准化的 Agent 能力连接方式。

可以简单表示：

```javascript
Agent
  ↓
MCP
  ↓
Tool / Resource
  ↓
Runtime / Provider

```

而 Skill 更偏向于：

```javascript
Skill
 ↓
告诉 Agent
“应该如何使用某种能力”

```

所以可以把两者简单区分：

```javascript
MCP  = 能力如何连接
Skill = 能力如何使用

```

例如，一个 Agent 可能拥有某个数据访问能力。

MCP 让 Agent 能够发现和调用它，而 Skill 则可以描述完成某类任务时应该采取什么步骤。

这也是 Agent 系统从“模型”走向“可执行系统”的重要一步。

---

# 十、Blocklet：Runtime 上运行的应用

理解到这里，再看 Blocklet 就简单很多。

Blocklet 可以理解成 Runtime 上运行的应用单元。

传统 Web：

```javascript
Server
  ↓
Application
  ↓
Database

```

Runtime 模型更接近：

```javascript
ARC Runtime
     ↓
   Blocklet
     ↓
DID / AFS / Vault / Space / Provider

```

因此 Blocklet 并不是孤立存在的。

它可以使用 Runtime 提供的基础能力。

这意味着开发者不需要每个应用都重新实现：

```javascript
身份
密钥
数据访问
外部服务连接
Agent 能力

```

而是可以把这些能力交给 Runtime。

---

# 十一、把所有组件放在一起

到这里，整个架构可以压缩成一张图：

```javascript
             Human / Developer / AI Agent
                         │
                    arc CLI / MCP
                         │
                       Skill
                         │
                  ┌──────▼──────┐
                  │ ARC Runtime  │
                  └──────┬──────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       DID             Vault            Space
        │                │                │
        └────────────────┼────────────────┘
                         │
                       AFS
                         │
                      Mount
                         │
                     Provider
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
            Files      Database   External API
                         │
                      Blocklet
                         │
                     Application

```

如果只记住这一张图，就已经能够理解 ARC Runtime 的大部分基本结构。

---

# 十二、arc CLI 真正解决的是什么？

回到最开始的问题：

**arc CLI 到底是干什么的？**

答案其实已经比较清楚。

它不是单纯的：

```javascript
项目创建工具

```

而更接近：

```javascript
Runtime Control Interface

```

也就是：

```javascript
开发者
   ↓
arc CLI
   ↓
ARC Runtime
   ↓
身份 / 数据 / 密钥 / Provider / 应用

```

因此 CLI 的价值在于，把原本需要开发者直接操作的一系列 Runtime 能力，统一成命令行接口。

这也是为什么随着 Runtime 能力增加，CLI 的职责也会不断扩大。

---

# 十三、为什么还需要 `arc service`？

如果 Runtime 是一个长期运行的环境，那么它就不能只存在于某一次 CLI 命令执行期间。

因此需要一个长期运行的服务进程。

可以理解为：

```javascript
Terminal
   │
   │ arc service
   ↓
ARC Runtime
   │
   ├── AFS
   ├── DID
   ├── Vault
   ├── Space
   ├── Provider
   ├── MCP
   └── Blocklet

```

CLI 更多承担控制作用，而 Runtime 负责持续运行。

这个区别与：

```javascript
docker CLI
    ↓
Docker Engine

```

有一定相似性。

但 Runtime 管理的对象并不只是容器，而是更上层的身份、数据、能力和应用环境。

---

# 十四、与传统 Web 应用有什么不同？

传统 Web 应用通常围绕：

```javascript
HTTP
API
Database
Server
User

```

展开。

而 Runtime 模型更强调：

```javascript
Identity
Data
Capability
Resource
Application
Agent

```

因此两者的关注点不同。

传统模型：

```javascript
User
 ↓
Web App
 ↓
API
 ↓
Database

```

Runtime 模型：

```javascript
User / Agent
      ↓
Identity
      ↓
Runtime
 ┌────┼─────┐
 ↓    ↓     ↓
Data Capability Application

```

这并不是说 Runtime 要取代传统 Web，而是把应用运行环境进一步向“身份 + 数据 + 能力”扩展。

---

# 十五、与 Docker / Kubernetes 的区别

如果用一句话区分：

```javascript
Docker
→ 管理容器

Kubernetes
→ 管理容器集群

ARC Runtime
→ 管理身份、数据、能力和应用运行环境

```

三者处在不同抽象层。

Docker 关注：

```javascript
Process / Container

```

Kubernetes 关注：

```javascript
Workload / Cluster

```

ARC Runtime 更关注：

```javascript
Identity
Data
Capability
Application
Agent

```

所以不能简单把 ARC Runtime 理解成另一个 Kubernetes。

它解决的问题更接近应用与 Agent 的运行时基础设施。

---

# 十六、与 MCP 的区别

MCP 很容易与 Runtime 混淆。

实际上：

```javascript
MCP
→ 能力连接协议

ARC Runtime
→ 能力运行环境

```

可以类比成：

```javascript
HTTP
→ 网络通信协议

Server
→ 运行网络服务的环境

```

因此 MCP 可以进入 Runtime，但 MCP 本身不是 Runtime。

更完整的关系是：

```javascript
AI Agent
   ↓
  MCP
   ↓
ARC Runtime
   ↓
Provider / AFS / Application

```

这样理解以后，MCP、Provider 和 Runtime 三者的边界就清晰很多。

---

# 十七、为什么这种架构特别适合 Agent？

传统应用通常是：

```javascript
程序员决定流程
        ↓
程序执行流程

```

Agent 则可能是：

```javascript
目标
 ↓
Agent
 ↓
发现能力
 ↓
调用工具
 ↓
读取数据
 ↓
执行动作
 ↓
验证结果

```

这要求底层系统能够提供：

```javascript
Identity
Data
Tools
Secrets
Resources
Applications

```

而 ARC Runtime 的组件恰好可以组合成这一层：

```javascript
                AI Agent
                   ↓
              Skill / MCP
                   ↓
              ARC Runtime
                   ↓
      ┌────────────┼────────────┐
      ↓            ↓            ↓
     AFS          DID          Vault
      ↓            │            │
 Provider       Identity      Secrets
      │
      └────────── Space
                   │
                Blocklet

```

因此，从架构角度看，Runtime 并不只是“让应用跑起来”。

它更重要的方向可能是：

> **让人和 Agent 都能够在统一环境中获得身份、数据和可执行能力。**
> 

---

# 十八、最终理解：ARC Runtime 到底是什么？

经过前面的拆解，可以把 ARC Runtime 浓缩成一句话：

> **ARC Runtime 是一个围绕身份、数据、资源和可执行能力构建的应用与 Agent 运行环境，而 arc CLI 是开发者控制这个运行环境的重要入口。**
> 

其中：

```javascript
arc CLI
→ 控制入口

ARC Runtime
→ 运行环境

DID
→ 身份

Vault
→ 秘密

Space
→ 数据与资源空间

AFS
→ 统一数据访问

Provider
→ 外部能力适配

MCP
→ Agent 能力连接

Skill
→ 能力使用方法

Blocklet
→ 应用单元

```

把它们放在一起，就是：

```javascript
                  ┌─────────────────────┐
                  │ Human / AI Agent    │
                  └──────────┬──────────┘
                             │
                      CLI / MCP / Skill
                             │
                  ┌──────────▼──────────┐
                  │    ARC Runtime      │
                  └──────────┬──────────┘
                             │
        ┌────────────┬───────┼────────┬────────────┐
        ↓            ↓       ↓        ↓            ↓
       DID         Vault    Space     AFS       Provider
        │            │       │        │            │
        │            │       │        └────────────┤
        │            │       │                     ↓
        └────────────┴───────┴────────────── External World
                             │
                        Blocklet / App

```

这张图也是理解整个体系最重要的一张图。

---

# 十九、从 `arc` 命令开始，应该如何继续研究？

如果真正想理解 ARC Runtime，而不是只会使用 CLI，推荐按照下面的顺序阅读：

```javascript
arc CLI
   ↓
arc service
   ↓
ARC Runtime
   ↓
AFS
   ↓
DID / Vault / Space
   ↓
Provider
   ↓
MCP / Skill
   ↓
Blocklet
   ↓
Deploy / Attach / DSL

```

原因很简单：

如果先研究 Blocklet，很容易把 ArcBlock 理解成另一个 Web 应用框架。

如果先研究 AFS，也容易只看到一个“特殊文件系统”。

只有把这些组件放回 Runtime 中，才能看到它们真正的关系：

```javascript
                 Runtime
                    │
       ┌────────────┼────────────┐
       │            │            │
      Data       Identity      Capability
       │            │            │
      AFS           DID       Provider/MCP
       │            │            │
       └────────────┼────────────┘
                    │
                 Application
                    │
                 Blocklet

```

因此，研究 ARC 的最佳入口并不是记忆命令，而是先理解它背后的抽象。

---

# 二十、结语：从 CLI 看到 Runtime

第一次看到 `arc`，很容易想到：

> “这是 ArcBlock 的命令行工具。”
> 

继续往下研究，会发现：

> “它其实是在控制一个 Runtime。”
> 

再继续研究：

> “Runtime 又不只是运行应用，而是在统一管理身份、数据、秘密、资源和能力。”
> 

再往前一步：

> “这些能力最终可以同时被传统应用和 AI Agent 使用。”
> 

于是整个架构就从：

```javascript
CLI

```

逐渐变成：

```javascript
CLI
 ↓
Runtime
 ↓
Identity + Data + Capability
 ↓
Application + Agent

```

这可能才是理解 ARC Runtime 最重要的视角。

**arc CLI 是入口，ARC Runtime 是核心，AFS 是数据访问抽象，DID / Vault / Space 构成基础环境，Provider 连接外部世界，MCP / Skill 让 Agent 能够使用能力，而 Blocklet 则成为 Runtime 上运行的应用单元。**

如果从这个角度重新阅读 ArcBlock 的 CLI 文档，很多看似分散的命令就会开始出现一个共同的结构：

```javascript
                arc CLI
                   │
                   ▼
             ARC Runtime
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
      Data      Identity    Capability
       │           │           │
      AFS          DID      Provider/MCP
       │           │           │
       └───────────┼───────────┘
                   ▼
             Blocklet / App
                   │
                   ▼
             Human / Agent

```

**这也是从“会用 arc”走向“理解 ARC”的关键一步。**
