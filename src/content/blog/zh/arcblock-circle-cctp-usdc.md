---
title: 'ArcBlock Chain 接入 Circle CCTP：让 ArcBlock 应用进入全球 USDC 网络'
description: '最近在研究 Circle 的 CCTP、Arc App Kit、USDC 以及 ArcBlock Chain 时，我开始思考一个值得 ArcBlock 社区讨论的问题：'
pubDate: '2026-09-16'
tags: ['Blocklet', 'USDC']
---

![ChatGPT Image 2026年9月17日 09_53_05.jpg](/images/posts/bafkreib2mz4p33ntyvxuexgqvgkhmk7rrjjd3fn7fxjilaph6raifdaqmm.webp)

最近在研究 Circle 的 CCTP、Arc App Kit、USDC 以及 ArcBlock Chain 时，我开始思考一个值得 ArcBlock 社区讨论的问题：

> **如果未来 ArcBlock Chain 能够正式接入 Circle CCTP，会给 ArcBlock 的应用生态带来什么？**
> 

这里首先需要澄清几个容易混淆的名称。

**ArcBlock Chain** 是 ArcBlock 的 Layer 1 区块链，为应用提供可核验的链上记录；ArcBlock 官方目前将其运行的网络称为 **ABT Network**。ArcBlock 同时还有一个叫 **ARC（Agentic Realm Computer）** 的应用运行时，用来运行 Blocklet，它不是一条区块链。Circle 则有自己的 **Arc** 区块链，这与 ArcBlock 的 ARC 和 ArcBlock Chain 都是不同的产品。

本文讨论的是：

> **ArcBlock Chain 接入 Circle CCTP。**
> 

目前 Circle 官方 CCTP 支持网络列表中还没有 ArcBlock Chain，因此本文是一篇面向未来的技术和生态探讨，而不是对当前已经完成的集成进行描述。Circle 会为正式支持的区块链分配 CCTP Domain，并要求网络满足相应的技术与 USDC 发行条件。

我认为，这件事情值得认真研究，因为它可能让 ArcBlock Chain 上的应用从一个相对独立的区块链生态，进一步连接到一个已经存在的全球 USDC 网络。

---

# 一、CCTP 到底解决了什么问题？

区块链最大的特点之一是开放。

但开放的另一面是：

> **不同区块链之间天然是相互独立的。**
> 

Ethereum、Base、Solana、Arbitrum 等网络拥有各自的状态、资产和执行环境。

即使它们都存在 USDC，用户在 Ethereum 上拥有的 USDC，也不会自动出现在 Base 或 Solana 上。

于是过去最常见的解决办法就是：

**Bridge。**

传统的跨链资产模式通常类似：

```javascript
Ethereum
   │
   │ Lock
   ▼
Bridge
   │
   │ Mint
   ▼
Other Chain
   │
   ▼
Wrapped Asset

```

这种模式可以解决跨链问题，但也会带来额外复杂性：

- 需要桥接合约；
- 需要流动性；
- 需要验证跨链消息；
- 可能出现 Wrapped Token；
- 不同桥产生不同版本的资产；
- 用户需要判断哪个资产才是真正的原生资产。

于是一个非常现实的问题出现了：

> **如果同一个 USDC 在不同网络存在多个桥接版本，应用开发者到底应该支持哪个？**
> 

CCTP 的设计思路与传统资产桥不同。

---

# 二、CCTP 的核心：Burn + Mint

CCTP，全称：

**Cross-Chain Transfer Protocol**

是 Circle 为 USDC 跨链设计的基础设施。

它的核心思想可以用一句话概括：

> **在源链 Burn USDC，在目标链 Mint 等量的原生 USDC。**
> 

例如：

```javascript
Ethereum
100 USDC
   │
   │ Burn
   ▼
  CCTP
   │
   │ Message + Attestation
   ▼
ArcBlock Chain
   │
   │ Mint
   ▼
100 USDC

```

这里并不存在：

```javascript
Wrapped USDC
USDC.e
Bridged USDC

```

而是：

```javascript
Source Chain
     │
     │ Burn
     ▼
    CCTP
     │
     ▼
Destination Chain
     │
     │ Mint
     ▼
Native USDC

```

Circle 官方文档将 CCTP 描述为一种通过跨链消息实现 USDC 原生 Burn-and-Mint 的协议。其基本消息流程是：

1. 源链链上组件发出消息；
2. Circle 的链下 Attestation 服务对消息签名；
3. 目标链上的链上组件接收并处理消息。

这就是 CCTP 与传统桥最重要的区别。

---

# 三、举一个简单例子

假设一个用户拥有：

```javascript
Ethereum
100 USDC

```

他希望在 ArcBlock Chain 上使用这 100 USDC。

传统桥可能是：

```javascript
Ethereum
   │
   │ Lock USDC
   ▼
Bridge
   │
   │ Mint
   ▼
ArcBlock Chain
   │
   ▼
Wrapped USDC

```

而 CCTP 的目标模型是：

```javascript
Ethereum
100 USDC
   │
   │ Burn
   ▼
Circle CCTP
   │
   │ Attestation
   ▼
ArcBlock Chain
   │
   │ Mint
   ▼
100 Native USDC

```

用户最终拿到的是目标网络上的**原生 USDC**。

---

# 四、CCTP 并不是简单的“跨链 Token”

理解这一点非常重要。

CCTP 的本质实际上是：

> **一个围绕 USDC 建立的跨链消息与原生资产发行机制。**
> 

它不是单纯的：

```javascript
Chain A → Chain B

```

而是：

```javascript
Chain A
   │
   │ Burn
   ▼
CCTP Message
   │
   │ Circle Attestation
   ▼
Chain B
   │
   │ Mint
   ▼
Native USDC

```

这意味着，CCTP 的价值不仅在于“把钱从 A 链搬到 B 链”。

更重要的是：

> **让不同区块链上的应用可以围绕同一种标准化结算资产建立业务。**
> 

---

# 五、为什么原生 USDC 对应用生态很重要？

假设 ArcBlock Chain 上未来有大量应用。

如果市场上出现：

```javascript
USDC
USDC.e
Bridged USDC
Wrapped USDC
Bridge-USDC
Some-USDC

```

应用开发者就需要考虑：

- 钱包支持哪个？
- DEX 支持哪个？
- 用户转账时接受哪个？
- 商户收哪个？
- Agent 支付使用哪个？
- 交易所支持哪个？
- 会计系统记录哪个？

这会产生大量不必要的复杂性。

而如果 ArcBlock Chain 正式获得 Circle 支持，并使用 Circle 的原生 USDC / CCTP 体系，那么目标可以非常清晰：

```javascript
ArcBlock Chain
      │
      └── Native USDC

```

然后通过 CCTP 与其他支持网络连接。

这样 ArcBlock Chain 上的应用就不只是拥有一个稳定币。

更重要的是：

> **它们可以使用一种能够进入全球 USDC 流动网络的标准结算资产。**
> 

---

# 六、目前 Circle 的 CCTP 网络是什么情况？

这也是讨论 ArcBlock Chain 接入 CCTP 时必须面对的现实。

Circle 官方目前列出了多个 CCTP 支持网络，包括 Ethereum、Arbitrum、Base、Solana、OP Mainnet、Polygon、Unichain、Monad、Sei、XDC、Injective、Pharos 等。

Circle 同时为每个 CCTP 网络分配一个独立的 **Domain Identifier**。

需要特别注意：

> **CCTP Domain 并不是区块链本身的 Chain ID。**
> 

例如目前 Circle 的官方列表中：

```javascript
Ethereum       Domain 0
Arbitrum       Domain 3
Base           Domain 6
Solana         Domain 5
Arc Testnet    Domain 26

```

Circle 明确说明，CCTP Domain 是 Circle 为支持 CCTP 的区块链分配的协议标识，并不等同于公链自身的 Chain ID。

因此，如果未来 ArcBlock Chain 接入 CCTP，应该由 Circle 正式为其分配对应的 CCTP Domain。

而不是 ArcBlock 自己选择一个数字宣布“我们是 CCTP Domain X”。

---

# 七、ArcBlock Chain 接入 CCTP，需要做什么？

我认为可以把这件事情理解成几个层次。

## 第一层：明确 ArcBlock Chain 的 USDC 方案

首先需要明确：

> ArcBlock Chain 如何支持 Circle 原生 USDC？
> 

这里必须严格区分：

```javascript
自己部署一个 ERC-20 Token

```

和：

```javascript
Circle Native USDC

```

两者完全不同。

如果目标是进入 CCTP 网络，那么重点应该是与 Circle 建立正式的 USDC / CCTP 集成，而不是简单部署一个名称叫 USDC 的 Token。

Circle 当前 CCTP 的支持网络本身就建立在“USDC 在这些网络原生发行”的基础上。

---

# 八、第二层：ArcBlock Chain 与 Circle CCTP 技术架构适配

对于 EVM 网络，Circle CCTP 当前使用包括：

```javascript
TokenMessengerV2
MessageTransmitterV2
TokenMinterV2

```

在典型的 CCTP 流程中：

```javascript
User
 │
 ▼
USDC
 │
 ▼
TokenMessengerV2
 │
 │ Burn
 ▼
MessageTransmitter
 │
 │ Message
 ▼
Circle Attestation
 │
 ▼
Destination Chain
 │
 ▼
MessageTransmitterV2
 │
 ▼
TokenMinterV2
 │
 │ Mint
 ▼
Native USDC

```

Circle 官方提供了不同 EVM 网络的 CCTP 合约部署信息。

因此，如果 ArcBlock Chain 未来正式接入 CCTP，就需要按照 Circle 当时的官方集成要求，对 ArcBlock Chain 的：

- 智能合约环境；
- USDC Token；
- CCTP 合约；
- Message Transmitter；
- Token Minter；
- 跨链消息；
- 权限体系；

进行适配。

这里不能简单理解为：

> “把其他链的 CCTP 合约复制到 ArcBlock Chain 就完成了。”
> 

真正的关键是：

> **获得 Circle 官方支持并进入其 CCTP 信任与运行体系。**
> 

---

# 九、第三层：ArcBlock Chain 的 Finality

CCTP 还有一个非常重要的技术要求：

**源链交易必须达到相应的最终性条件。**

因为 Circle 不能看到一笔交易就立刻认为：

```javascript
100 USDC 已经 Burn

```

然后在另一条链 Mint。

如果源链发生重组，可能造成严重的资产安全问题。

因此 CCTP 会根据不同区块链的最终性模型和确认要求处理跨链消息。

Circle 官方也明确说明，不同网络的 Finality 和 Block Confirmation 要求不同。

因此 ArcBlock Chain 如果希望进入 CCTP，需要让 Circle 能够清晰理解和验证：

```javascript
Consensus
    ↓
Block Finality
    ↓
Transaction Confirmation
    ↓
CCTP Attestation

```

ArcBlock Chain 自身的：

- 共识机制；
- Finality；
- Reorg 风险；
- 区块生产；
- 节点网络；
- RPC；
- Explorer；
- 网络稳定性；

都会成为技术集成的一部分。

---

# 十、第四层：正式成为 Circle 支持的 CCTP Network

最终目标不是：

> ArcBlock Chain 自己实现一个 CCTP。
> 

而是：

> **ArcBlock Chain 成为 Circle 官方支持的 CCTP 网络。**
> 

可以理解为：

```javascript
                  Circle CCTP
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Ethereum         Base         Solana
        │              │              │
     Arbitrum         Arc           Monad
        │              │              │
        └──────────────┼──────────────┘
                       │
                ArcBlock Chain
                       ▲
                       │
                 Future Goal

```

目前 ArcBlock Chain 并不在 Circle 的官方 CCTP 支持列表中，因此这里是一个未来目标，而不是当前状态。

---

# 十一、为什么我认为这件事情值得 ArcBlock 认真考虑？

因为 ArcBlock Chain 的定位本身正在发生变化。

ArcBlock 官方目前将 ArcBlock Chain 定义为其 Layer 1 区块链，用于为应用提供可核验的链上记录；同时 ArcBlock 正在围绕 ARC、应用、身份、数据和 Agent 构建新的应用基础设施。

这意味着未来 ArcBlock 的问题不应该只是：

> “如何让用户拥有 ABT？”
> 

还应该包括：

> **“如何让 ArcBlock 应用能够自然地参与真实的数字经济？”**
> 

而 USDC 是一个非常现实的答案。

---

# 十二、ArcBlock 不一定需要发行自己的 Stablecoin

这里我认为尤其值得讨论。

如果应用需要一种稳定的支付和结算资产，那么有一个问题：

> ArcBlock 是否一定需要自己发行一个 Stablecoin？
> 

我认为未必。

ArcBlock 最近关于 Stablecoin 的文章实际上也在强调一个重要区别：

> **收款不等于发行 Stablecoin。**
> 

应用可以使用现有的 USDC 等资产进行支付和结算，而应用真正需要解决的往往是：

- Billing；
- Credits；
- Usage；
- Subscription；
- Reconciliation；
- Customer Account；
- Revenue Distribution。

这与 ArcBlock 当前正在推进的应用基础设施方向是非常契合的。

因此，一个很自然的架构可能是：

```javascript
Stablecoin
    ↓
USDC
    ↓
Circle
    ↓
CCTP
    ↓
ArcBlock Chain
    ↓
ArcBlock Application
    ↓
Billing / Credits / Usage / Settlement

```

Stablecoin 负责：

> **价值结算**
> 

ArcBlock 应用负责：

> **业务规则**
> 

这两者其实没有必要混在一起。

---

# 十三、这会给 ArcBlock 应用带来什么？

我认为最重要的价值可以总结成一句话：

> **让 ArcBlock 应用不需要自己重新建设一套金融基础设施。**
> 

传统 Web3 应用可能需要考虑：

```javascript
Wallet
Token
Gas
Bridge
Liquidity
DEX
Stablecoin
Cross-chain
Settlement

```

如果 ArcBlock Chain 能够使用标准化的 USDC，并接入 CCTP：

```javascript
Wallet
   │
   ▼
USDC
   │
   ▼
CCTP
   │
   ▼
ArcBlock Chain
   │
   ▼
Application

```

大量复杂性可以下沉到基础设施层。

开发者可以更多地关注：

```javascript
Application Logic
Identity
Data
Agent
Business Model

```

---

# 十四、这时候 Arc App Kit 就非常值得关注

Circle 目前已经提供 **Arc App Kit**。

这里同样需要注意：

**Arc App Kit 是 Circle 的开发工具，与 ArcBlock Chain 本身不是同一个产品。**

Circle 对 App Kit 的定位是：

> 用统一的开发接口构建跨链支付和流动性体验。
> 

目前 App Kit 提供：

- Bridge
- Swap
- Send
- Unified Balance

并支持 Viem、Ethers、Solana 以及 Circle Wallets 等开发环境。

其中 Bridge 可以把底层跨链 USDC 操作封装起来，而不是要求每个应用自己实现完整的 CCTP 流程。

例如 Circle 官方 App Kit 文档直接展示了：

```javascript
const result = await kit.bridge({
  from: {
    adapter: viemAdapter,
    chain: "Ethereum_Sepolia"
  }
});

```

这样的高层 API。

这就是“基础设施抽象”的价值。

---

# 十五、如果未来 ArcBlock Chain 加入 CCTP，App Kit 会发生什么？

假设未来：

```javascript
Ethereum
Base
Solana
Arbitrum
Arc
...
   │
   │ CCTP
   ▼
ArcBlock Chain
   │
   ▼
ArcBlock Applications

```

那么 App Kit 可以成为 ARC 应用与 Circle 支付基础设施之间的一层开发抽象。

例如一个应用可以提供：

```javascript
Pay with USDC

```

用户的钱可能来自：

```javascript
Ethereum
Base
Solana
Arbitrum

```

应用不需要强迫用户先：

```javascript
Bridge
Bridge
Bridge
Swap

```

然后再进入应用。

理想的体验应该是：

```javascript
User
 │
 │ USDC
 ▼
Application
 │
 ▼
ArcBlock Chain

```

跨链过程尽可能被隐藏。

---

# 十六、Unified Balance 更值得研究

Circle App Kit 中另一个值得关注的能力是：

**Unified Balance。**

CCTP 更适合：

```javascript
Chain A
   ↓
Chain B

```

这样的点对点 USDC Transfer。

而 Gateway / Unified Balance 更强调：

```javascript
Ethereum USDC
Base USDC
Solana USDC
Arbitrum USDC
        │
        ▼
Unified Balance
        │
        ▼
Application

```

Circle 当前文档也明确区分了两者：

- **CCTP**：适合在不同区块链之间转移 USDC；
- **Gateway**：提供统一的跨链 USDC 余额访问。

这意味着未来如果 ArcBlock Chain 获得 Circle 支持，实际上可以进一步研究：

```javascript
ArcBlock Chain
       │
       ├── CCTP
       │
       └── Gateway

```

两套基础设施分别解决：

```javascript
CCTP
跨链转移

```

以及：

```javascript
Gateway
统一余额

```

---

# 十七、对 ArcBlock 应用开发体验的改变

未来一个 ArcBlock 应用可能需要：

```javascript
Identity
+
Application
+
Data
+
Agent
+
USDC

```

其中：

```javascript
Identity
Application
Data
Agent

```

由 ArcBlock 生态提供。

而：

```javascript
USDC
Cross-chain Settlement
Liquidity Connectivity

```

可以利用 Circle 的基础设施。

形成：

```javascript
                 Application
                      │
       ┌──────────────┼──────────────┐
       │              │              │
    Identity         Data          Agent
       │              │              │
       └──────────────┼──────────────┘
                      │
                ArcBlock Chain
                      │
                     USDC
                      │
                     CCTP
                      │
              Global USDC Network

```

这种组合其实非常自然。

---

# 十八、对 AI Agent 尤其有意义

我认为这是 ArcBlock Chain 接入 CCTP 最值得研究的长期价值之一。

AI Agent 和传统应用最大的不同之一，是 Agent 不只是“显示信息”。

它可以：

```javascript
Discover
→ Decide
→ Execute
→ Pay
→ Receive
→ Continue

```

例如：

```javascript
Agent A
   │
   │ 找到服务
   ▼
Service Agent B
   │
   │ 报价 5 USDC
   ▼
Agent A
   │
   │ Pay 5 USDC
   ▼
Agent B
   │
   │ Return Result
   ▼
Agent A

```

如果 Agent 的经济活动跨越不同区块链，那么支付基础设施就必须具有：

- 标准资产；
- 跨链能力；
- 可验证的交易；
- 可编程支付；
- 可对账。

USDC + CCTP 可以成为其中一层基础设施。

而 ArcBlock 可以把更多能力放在：

```javascript
Agent Identity
Agent Authorization
Agent Runtime
Application
Data
Verifiable Records

```

这其实与 ArcBlock 当前强调的“AI Agent 不只是需要一个钱包”这一方向也很吻合：支付只是 Agent 与区块链的一个交点，更重要的是身份、授权、能力和可核验记录。

---

# 十九、一个简单的应用例子

用一个普通的数字服务应用作为例子。

假设 ArcBlock Chain 上有一个：

```javascript
AI Design Service

```

用户可以购买：

```javascript
Logo Design       20 USDC
Website Design    100 USDC
AI Consultation    5 USDC

```

用户的 USDC 原本可能在：

```javascript
Ethereum

```

那么理想流程可以是：

```javascript
User
 │
 │ 100 USDC
 ▼
Ethereum
 │
 │ CCTP
 ▼
ArcBlock Chain
 │
 ▼
AI Design App
 │
 ├── Service Provider
 ├── Platform
 └── Agent

```

例如：

```javascript
100 USDC
   │
   ├── 80 USDC → Designer
   ├── 15 USDC → Platform
   └──  5 USDC → Agent / Protocol

```

收入分配由应用自己的业务规则和智能合约决定。

而跨链资产转移则交给 CCTP。

这两个问题被清晰分开：

```javascript
CCTP
解决：
“钱怎么到这里？”

Application
解决：
“钱到了以后怎么分？”

```

我认为这是一种非常健康的架构分层。

---

# 二十、ArcBlock Chain 原有 ArcBridge 与 CCTP 的关系

ArcBlock 本身已经有 ArcBridge。

ArcBlock 官方将 ArcBridge 定义为在 ArcBlock Chain 与其他网络之间转移资产的基础设施，并由节点承担转发相关交易的责任。

那么未来如果 ArcBlock Chain 接入 Circle CCTP，就可以形成一种非常有意思的基础设施分层：

```javascript
                Cross-chain Infrastructure
                         │
              ┌──────────┴──────────┐
              │                     │
         ArcBridge                 CCTP
              │                     │
        ArcBlock ecosystem       USDC
        specific assets          native transfer
              │                     │
              └──────────┬──────────┘
                         │
                  ArcBlock Chain

```

两者不一定是竞争关系。

更合理的理解是：

**ArcBridge 可以继续服务 ArcBlock 自身生态资产和特定跨链需求。**

而：

**CCTP 专注于标准化的 USDC 跨链流动。**

这样反而可以让两套基础设施各自发挥作用。

---

# 二十一、ArcBlock 为什么不应该自己重新造一个 USDC Bridge？

这是我认为一个很现实的问题。

假设 ArcBlock 自己建设一个：

```javascript
ArcBlock USDC Bridge

```

那么长期需要维护：

- Bridge Smart Contract；
- Relayer；
- Liquidity；
- Security；
- Monitoring；
- Cross-chain Message；
- Asset Mint/Burn；
- Emergency Mechanism。

而 Circle 已经在维护一套面向 USDC 的跨链基础设施。

那么从开发者生态的角度，一个更值得考虑的策略可能是：

> **尽可能使用行业成熟的标准，而把 ArcBlock 自己的资源投入到应用层和 Agent 层。**
> 

这并不是说所有跨链需求都应该交给 CCTP。

而是：

> **对于 USDC 这种标准资产，优先考虑采用 Circle 官方基础设施。**
> 

---

# 二十二、ArcBlock Chain 接入 CCTP 的潜在收益

如果未来正式完成接入，我认为至少有以下几个层面的价值。

## 1. 获得标准化的 USDC 支付入口

应用可以围绕 USDC 建立支付和结算。

---

## 2. 接入外部 USDC 流动性

用户可以从其他 CCTP 支持网络进入 ArcBlock Chain。

这意味着 ArcBlock 应用不必只依赖 ArcBlock 自身生态内部资金。

---

## 3. 降低跨链开发成本

开发者不需要每个应用自己实现一套 USDC Bridge。

---

## 4. 提升钱包和支付体验

用户不需要理解大量 Wrapped Token。

---

## 5. 提高应用的可组合性

其他链上的：

- Wallet；
- Payment；
- DeFi；
- Exchange；
- Agent；

都有机会与 ArcBlock 应用形成资金连接。

---

## 6. 为 AI Agent Economy 提供基础结算资产

Agent 可以使用 USDC 进行：

```javascript
API Payment
Service Payment
Data Payment
Compute Payment
Agent-to-Agent Payment

```

---

# 二十三、最重要的其实不是“跨链”

如果让我用一句话总结 CCTP 对 ArcBlock Chain 的潜在意义，我不会说：

> “ArcBlock Chain 多了一种跨链方式。”
> 

而会说：

> **ArcBlock Chain 获得了连接全球 USDC 经济网络的一条标准化通道。**
> 

这是完全不同的概念。

传统思路是：

```javascript
我要把资产搬进 ArcBlock Chain。

```

新的思路则是：

```javascript
ArcBlock Chain 上的应用
可以自然地参与全球 USDC 经济。

```

应用从一个相对封闭的生态变成开放经济网络的一部分。

---

# 二十四、ArcBlock + Circle：可能形成一种互补关系

如果把两家公司擅长的领域放在一起，可以得到一个非常有意思的组合。

### ArcBlock

更适合：

```javascript
Identity
Application
Agent
Runtime
Data
Verifiable Records
DApp

```

### Circle

更适合：

```javascript
USDC
CCTP
Gateway
Wallet
Payment
Stablecoin Infrastructure

```

两者之间可以形成：

```javascript
                   User
                     │
                     ▼
              ArcBlock Application
                     │
       ┌─────────────┼─────────────┐
       │             │             │
    Identity       Agent         Data
       │             │             │
       └─────────────┼─────────────┘
                     │
              ArcBlock Chain
                     │
                    USDC
                     │
                    CCTP
                     │
              Circle Infrastructure
                     │
        ┌────────────┼────────────┐
        │            │            │
     Ethereum       Base       Solana

```

这不是让 ArcBlock 变成 Circle。

也不是让 Circle 变成 ArcBlock。

而是：

> **各自提供自己最擅长的基础设施，然后在应用层形成组合。**
> 

---

# 二十五、Arc App Kit 可以成为开发者入口

如果未来 ArcBlock Chain 获得 Circle CCTP 支持，那么我认为非常值得进一步研究：

> **ArcBlock 应用开发模板与 Circle App Kit 的结合。**
> 

例如未来一个应用模板可以天然拥有：

```javascript
ArcBlock Application
│
├── Identity
├── Data
├── Agent
├── Blockchain
│
└── Payment
     ├── USDC
     ├── Send
     ├── Bridge
     ├── Swap
     └── Unified Balance

```

Circle App Kit 已经把这些底层能力进行了较高层的 SDK 抽象，并提供 Bridge、Swap、Send 和 Unified Balance 等能力。

这样开发者真正需要写的是：

```javascript
My Application
+
My Business Logic
+
My Agent

```

而不是：

```javascript
CCTP Contract
+
Attestation
+
Cross-chain Message
+
Bridge
+
Liquidity
+
Token Management

```

---

# 二十六、最终可能形成三层架构

如果把这个方向继续抽象，我认为未来可以形成：

```javascript
┌─────────────────────────────────────┐
│           Application Layer         │
│                                     │
│ Apps · Agents · Services · DApps    │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         ArcBlock Infrastructure     │
│                                     │
│ Identity · Data · Runtime           │
│ Verifiable Records · Blockchain     │
└─────────────────┬───────────────────┘
                  │
                  │ USDC
                  ▼
┌─────────────────────────────────────┐
│          Circle Infrastructure      │
│                                     │
│ CCTP · Gateway · Wallet · Payments  │
└─────────────────────────────────────┘

```

其中：

**ArcBlock Chain**

负责可信、可验证的链上记录和应用相关的区块链能力。

**Circle CCTP**

负责 USDC 在支持网络之间的原生跨链流动。

**App Kit**

负责把底层支付和跨链能力进一步封装成开发者可以直接使用的 SDK。

---

# 二十七、我认为可以讨论的技术路线

如果把“ArcBlock Chain 接入 CCTP”作为一个长期生态方向，我认为可以按照下面的路线推进。

## Phase 1：技术可行性研究

确认：

```javascript
ArcBlock Chain
      │
      ├── EVM Compatibility
      ├── Finality
      ├── RPC
      ├── Smart Contract
      ├── Token Standard
      └── USDC Integration

```

是否满足 Circle CCTP 的技术要求。

---

## Phase 2：Native USDC

与 Circle 讨论：

```javascript
USDC
+
ArcBlock Chain

```

的正式集成方式。

重点不是发行一个“USDC-like Token”，而是进入 Circle 的原生 USDC 体系。

---

## Phase 3：CCTP Testnet

如果 Circle 接受技术集成：

```javascript
ArcBlock Chain Testnet
       │
       ▼
CCTP Testnet
       │
       ▼
Ethereum / Base / Solana / ...

```

完成：

- Burn；
- Message；
- Attestation；
- Mint；
- Failure Recovery；
- Finality；
- Monitoring。

---

## Phase 4：Circle Official Support

最终目标：

> **ArcBlock Chain 出现在 Circle 官方 CCTP Supported Blockchains 列表中。**
> 

同时获得 Circle 分配的：

```javascript
CCTP Domain

```

这样 ArcBlock Chain 才真正成为 CCTP 网络的一部分。Circle 当前的支持列表就是通过这种 Domain 体系管理各个网络。

---

## Phase 5：ArcBlock Developer Experience

最后才是开发者体验：

```javascript
ArcBlock App
       │
       ▼
USDC Payment
       │
       ▼
App Kit
       │
       ├── Send
       ├── Bridge
       ├── Swap
       └── Unified Balance
       │
       ▼
ArcBlock Chain

```

让开发者不需要理解 CCTP 的所有底层细节。

---

# 二十八、一个更长远的目标：Agent Economy

如果再向前看一步，我认为真正值得关注的可能不是：

**Human → Application**

而是：

**Agent → Application → Agent**

例如：

```javascript
User
 │
 ▼
Personal Agent
 │
 │ Discover
 ▼
Service Agent
 │
 │ Quote
 ▼
Payment
 │
 │ 5 USDC
 ▼
ArcBlock Chain
 │
 ▼
Service
 │
 ▼
Result

```

未来 Agent 可能购买：

- API；
- 数据；
- 存储；
- 计算；
- 内容；
- 软件能力；
- 专业服务。

这些交易都需要一个可靠的价值结算层。

如果：

```javascript
ArcBlock Chain
+
Identity
+
Agent
+
Application
+
USDC
+
CCTP

```

能够组合起来，那么 ArcBlock Chain 就不仅仅是一个记录交易的区块链。

它可能成为：

> **AI Agent 执行真实经济活动的基础设施之一。**
> 

---

# 二十九、ArcBlock 真正应该解决的是什么？

我越来越觉得，未来区块链基础设施的竞争不应该只是：

```javascript
谁 TPS 更高？
谁 Gas 更低？
谁有更多 Token？

```

对于应用开发者来说，更重要的问题可能是：

```javascript
身份有没有？
数据在哪里？
应用怎么运行？
资产怎么支付？
跨链怎么做？
Agent 怎么执行？
交易怎么对账？

```

如果这些能力都需要开发者自己拼起来，那么区块链本身依然是一个非常复杂的基础设施。

真正好的平台应该让：

```javascript
Complex Infrastructure
        ↓
     Platform
        ↓
Simple Developer API
        ↓
   Real Application

```

这也是我认为 ArcBlock Chain 与 Circle CCTP 结合值得研究的根本原因。

---

# 三十、最后

我并不认为 ArcBlock Chain 接入 CCTP 的意义只是：

> “以后 ArcBlock Chain 可以跨链 USDC。”
> 

真正值得关注的是：

> **ArcBlock Chain 可以通过 Circle CCTP 连接到一个已经存在的全球 USDC 网络。**
> 

这会改变 ArcBlock 应用的资金入口。

今天，一个应用可能首先需要考虑：

```javascript
用户有没有 ABT？
用户有没有 Gas？
用户在哪条链？
USDC 在哪里？
需要哪个 Bridge？
哪个 USDC 才是真的？

```

未来理想的体验应该是：

```javascript
用户有 USDC
       │
       ▼
ArcBlock Application
       │
       ▼
ArcBlock Chain
       │
       ▼
Application Logic

```

跨链、结算和底层资产流动尽可能由基础设施完成。

而开发者把精力放在真正有价值的事情上：

```javascript
Application
Identity
Data
Agent
Business Logic

```

这也是为什么我认为：

# **ArcBlock Chain + Native USDC + CCTP + App Kit**

值得成为 ArcBlock 社区进一步讨论的一个技术方向。

如果未来 ArcBlock Chain 能够正式获得 Circle CCTP 支持，那么它带来的可能并不只是一项跨链能力。

它可能意味着：

> **ArcBlock 上的应用，可以从第一天开始，就拥有连接全球数字美元流动网络的能力。**
> 

而当这个能力与 ArcBlock 的身份、应用运行时、数据和 AI Agent 体系结合起来时，真正值得期待的可能是下一步：

> **让 AI Agent 不仅能够运行应用，也能够在应用之间自主、安全、可验证地进行经济活动。**
> 

这可能才是 ArcBlock Chain 接入 CCTP 最值得探索的长期价值。
