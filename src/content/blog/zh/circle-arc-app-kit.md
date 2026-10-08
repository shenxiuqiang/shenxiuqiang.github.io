---
title: 'Circle Arc App Kit 快速入门'
description: '官方文档入口：Arc App Kits 官方文档。目前 App Kits 的核心能力是 Send、Bridge、Swap、Unified Balance，并通过统一的类型安全接口屏蔽底层 CCTP、Gateway 等协议细节。'
pubDate: '2026-09-16'
tags: ['USDC']
---

官方文档入口：[Arc App Kits 官方文档](https://docs.arc.io/app-kit?utm_source=chatgpt.com)。目前 App Kits 的核心能力是 **Send、Bridge、Swap、Unified Balance**，并通过统一的类型安全接口屏蔽底层 CCTP、Gateway 等协议细节。

## 1. 先用一句话理解 App Kit

**App Kit 是 Circle 为 Arc 及多链 USDC 支付场景提供的 SDK。**

它解决的是：

> **我不想自己分别实现 Ethereum → Arc、Solana → Arc、USDC 转账、跨链桥、Swap、统一余额这些底层逻辑，我希望用统一 API 把它们组合起来。**
> 

整体架构：

```javascript
你的应用
   │
   ▼
Arc App Kit
   │
   ├── Send
   ├── Bridge
   ├── Swap
   └── Unified Balance
   │
   ├───────────────┐
   ▼               ▼
CCTP            Gateway
   │               │
   └───────┬───────┘
           ▼
 Ethereum / Base / Solana / Arc / ...
```

官方明确把 App Kit 定位为跨链支付和流动性工作流的抽象层。([Arc Docs](https://docs.arc.io/app-kit))

---

# 2. 四个核心能力一定要搞懂

这是学习 App Kit 最重要的一张图：

```javascript
                    App Kit
                       │
       ┌───────────────┼────────────────┐
       │               │                │
      Send           Bridge            Swap
       │               │                │
    同链转账          跨链 USDC          兑换
       │               │                │
       └───────────────┼────────────────┘
                       │
                Unified Balance
                       │
                  统一 USDC 余额
```

---

# 3. Send：同一条链的钱包之间转账

最简单。

例如：

```javascript
用户 A
  │
  │ 1 USDC
  ▼
用户 B
```

代码：

```javascript
const result = await kit.send({
  from: {
    adapter: viemAdapter,
    chain: "Arc_Testnet",
  },
  to: "RECIPIENT_ADDRESS",
  amount: "1.00",
  token: "USDC",
});
```

官方目前的 Send 支持同链钱包之间的 Token 转账，并可以使用 Token alias 或合约地址。([Arc Docs](https://docs.arc.io/app-kit/send?utm_source=chatgpt.com))

### 你应该怎么理解？

Send ≈

```javascript
ERC-20 transfer
```

但 App Kit 帮你把：

- wallet adapter
- chain
- token
- transaction

这些东西统一封装了。

---

# 4. Bridge：跨链

这是 GLOFTER 很可能用到的核心功能。

例如：

```javascript
Ethereum
   │
   │ USDC
   ▼
  Arc
```

代码：

```javascript
const result = await kit.bridge({
  from: {
    adapter: viemAdapter,
    chain: "Ethereum_Sepolia",
  },
  to: {
    adapter: viemAdapter,
    chain: "Arc_Testnet",
  },
  amount: "1.00",
});
```

你不需要自己处理：

```javascript
Burn
 ↓
Attestation
 ↓
Mint
```

App Kit 把底层 CCTP 流程抽象掉了。([Arc Docs](https://docs.arc.io/app-kit/bridge?utm_source=chatgpt.com))

---

# 5. Bridge 背后的核心技术：CCTP

这里一定要理解。

它不是：

```javascript
Ethereum USDC
 ↓
包装 Token
 ↓
Arc
```

而是 Circle 的 **CCTP（Cross-Chain Transfer Protocol）**。

概念上：

```javascript
Ethereum
   │
   │ Burn USDC
   ▼
Circle CCTP
   │
   │ Attestation
   ▼
Arc
   │
   │ Mint native USDC
   ▼
Arc USDC
```

所以它的核心价值是：

> **跨链之后仍然是原生 USDC，而不是某种 Wrapped USDC。**
> 

App Kit 的意义是把这个复杂流程封装成：

```javascript
kit.bridge(...)
```

([Arc Docs](https://docs.arc.io/app-kit/bridge?utm_source=chatgpt.com))

---

# 6. Swap：兑换 Token

例如：

```javascript
USDC
 ↓
EURC
```

代码：

```javascript
const result = await kit.swap({
  from: {
    adapter: viemAdapter,
    chain: "Arc_Testnet",
  },
  tokenIn: "USDC",
  tokenOut: "EURC",
  amountIn: "1.00",
  config: {
    kitKey: process.env.KIT_KEY!,
  },
});
```

Swap 需要 Circle Console 的 **Kit Key**。([Arc Docs](https://docs.arc.io/app-kit/swap?utm_source=chatgpt.com))

目前 Arc Testnet 的 Swap 支持范围比较有限，官方文档列的是：

```javascript
USDC
EURC
cirBTC
```

不要把 Testnet 的支持范围理解成 Mainnet 的完整 Token 支持范围。([Arc Docs](https://docs.arc.io/app-kit/swap?utm_source=chatgpt.com))

---

# 7. Unified Balance：最值得你理解的功能

这是 App Kit 里面最有意思的概念。

传统方式：

```javascript
Ethereum USDC = 100
Base USDC     = 200
Arbitrum USDC = 300
Arc USDC      = 0
```

用户真正想要的是：

```javascript
我的 USDC
= 600 USDC
```

而不是关心：

```javascript
钱在哪条链？
```

Unified Balance 就是解决这个问题。

官方把它定义为：

> chain-agnostic USDC balance
> 

也就是：

> **与具体区块链无关的 USDC 统一余额。**
> 

([Arc Docs](https://docs.arc.io/app-kit/unified-balance?utm_source=chatgpt.com))

---

# 8. Unified Balance 的工作方式

例如：

```javascript
Base
100 USDC
   │
   ├────────┐
             │
Arbitrum     │
200 USDC     │
   │         │
   ├─────────┤
             ▼
      Unified Balance
          300 USDC
             │
             ▼
           Arc
             │
          支付 50
             │
             ▼
          商家钱包
```

代码：

```javascript
await kit.unifiedBalance.deposit({
  from: {
    adapter: viemAdapter,
    chain: "Base_Sepolia",
  },
  amount: "1.00",
  token: "USDC",
});
```

再从统一余额支付：

```javascript
const result = await kit.unifiedBalance.spend({
  from: {
    adapter: viemAdapter,
  },
  amountIn: "1.50",
  to: {
    adapter: viemAdapter,
    chain: "Arc_Testnet",
    recipientAddress: "0xRecipientAddress",
  },
});
```

官方目前就是通过 Circle Gateway 实现这一层抽象。([Arc Docs](https://docs.arc.io/app-kit/unified-balance?utm_source=chatgpt.com))

---

# 9. Unified Balance 和 Bridge 的区别

这个非常容易混淆。

### Bridge

你在说：

> 我要把 USDC 从 A 链转到 B 链。
> 

```javascript
Base
 ↓
Bridge
 ↓
Arc
```

### Unified Balance

你在说：

> 我不想关心 USDC 在哪条链，我想建立一个统一资金池，然后从任意支持的链消费。
> 

```javascript
Base ──────┐
           │
Arbitrum ──┼──→ Unified Balance → Arc
           │
Solana ────┘
```

所以：

**Bridge 是“跨链转移”。**

**Unified Balance 是“链抽象后的资金使用”。**

---

# 10. App Kit 的开发模型

你可以把它理解成三层。

```javascript
┌────────────────────────────┐
│        GLOFTER App         │
│ React / Next.js / Agent    │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│         App Kit            │
│                            │
│ send()                     │
│ bridge()                   │
│ swap()                     │
│ unifiedBalance.*()         │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      Circle Protocols      │
│                            │
│ CCTP                       │
│ Gateway                    │
└─────────────┬──────────────┘
              │
              ▼
     Multiple Blockchains
```

因此你写 GLOFTER 的时候，**尽量不要直接把 CCTP/Gateway 逻辑散落在业务代码里**。

业务层只关心：

```javascript
pay(...)
bridge(...)
swap(...)
deposit(...)
spend(...)
```

底层交给 App Kit。

---

# 11. 安装

最简单的 Viem 项目：

```javascript
npm install @circle-fin/app-kit \
  @circle-fin/adapter-viem-v2 \
  viem
```

官方当前推荐的核心包就是：

```javascript
@circle-fin/app-kit
```

再根据你的技术栈选择 Adapter。([Arc Docs](https://docs.arc.io/app-kit/tutorials/installation?utm_source=chatgpt.com))

---

# 12. Adapter 是什么？

这是 App Kit 的另一个核心概念。

App Kit 不强制你使用某一个钱包/区块链 SDK。

它通过 Adapter 接入。

目前官方文档列出的主要适配器包括：

```javascript
Viem
Ethers
Solana
Circle Wallets
```

例如：

```javascript
npm install @circle-fin/adapter-viem-v2 viem
```

或者：

```javascript
npm install @circle-fin/adapter-ethers-v6 ethers
```

Solana：

```javascript
npm install @circle-fin/adapter-solana-kit \
  @solana/kit \
  @solana/web3.js
```

Circle Wallets：

```javascript
npm install @circle-fin/adapter-circle-wallets
```

([Arc Docs](https://docs.arc.io/app-kit/tutorials/installation?utm_source=chatgpt.com))

---

# 13. 为什么需要 Adapter？

假设你使用 Viem：

```javascript
GLOFTER
   ↓
App Kit
   ↓
Viem Adapter
   ↓
Ethereum / Base / Arc
```

如果你使用 Solana：

```javascript
GLOFTER
   ↓
App Kit
   ↓
Solana Adapter
   ↓
Solana
```

所以 App Kit 的 API 可以保持一致：

```javascript
kit.bridge(...)
```

而具体怎么操作钱包，由 Adapter 负责。

这是 App Kit **跨 EVM + Solana** 的关键设计。

---

# 14. 支持哪些链？

App Kit 目前已经不只是 Arc。

官方当前支持的能力矩阵包括：

```javascript
Ethereum
Base
Arbitrum
Avalanche
Polygon
OP
Solana
Unichain
Monad
Sonic
World Chain
XDC
Arc
...
```

不同链支持的能力不同。

例如：

```javascript
             Send   Bridge   Swap   Unified
Ethereum      ✓       ✓       ✓       ✓
Base          ✓       ✓       ✓       ✓
Arbitrum      ✓       ✓       ✓       ✓
Solana        ✓       ✓       ✓       ✓
Arc           ✓       ✓       ✓       ✓
```

但 Testnet 的支持明显更有限，尤其 Swap。开发时一定要查官方支持矩阵，不要假设所有链都支持所有功能。([Arc Docs](https://docs.arc.io/app-kit/references/supported-blockchains?utm_source=chatgpt.com))

---

# 15. Chain ID 和 App Kit Chain Identifier

这里容易踩坑。

App Kit 使用：

```javascript
"Arc_Testnet"
```

而不是自己随便写：

```javascript
"arc-testnet"
```

官方提供：

```javascript
import { BridgeChain } from "@circle-fin/app-kit";

const chain = BridgeChain.Arc_Testnet;
```

也可以直接：

```javascript
const chain = "Arc_Testnet";
```

这些标识是大小写敏感的。([Arc Docs](https://docs.arc.io/app-kit/references/supported-blockchains?utm_source=chatgpt.com))

---

# 16. Token 怎么指定？

可以使用 alias：

```javascript
token: "USDC"
```

也可以直接传 Token Contract Address。

官方目前常用 alias 包括：

```javascript
USDC
EURC
USDT
USDe
DAI
PYUSD
cirBTC
NATIVE
```

但是不同能力支持的 Token 不一样。

特别注意：

```javascript
Bridge → USDC / EURC
Unified Balance → USDC
```

而 Send 可以支持更广泛的 Token。([Arc Docs](https://docs.arc.io/app-kit/references/supported-blockchains?utm_source=chatgpt.com))

---

# 17. GLOFTER 应该怎么使用 App Kit？

如果按照我们上一轮讨论的 GLOFTER 经济模型，我建议：

```javascript
                  GLOFTER
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Wallet       Payment      Services
        │            │            │
        └────────────┼────────────┘
                     ▼
                  App Kit
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Bridge        Send       Unified
                     │
                     ▼
                    Arc
                     │
                     ▼
              GLOFTER Contract
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    Photographer     Hub       Protocol
```

---

# 18. 一个完整的 GLOFTER 支付流程

例如用户购买：

```javascript
Tokyo Photography
100 USDC
```

用户的钱在：

```javascript
Base
```

而摄影师的钱包在：

```javascript
Arc
```

那么：

```javascript
用户
 │
 │ 100 USDC
 ▼
App Kit
 │
 ├── Bridge Base → Arc
 │
 ▼
Arc
 │
 ▼
Payment Contract
 │
 ├── 80 USDC → Photographer
 ├── 15 USDC → Hub
 └──  5 USDC → GLOFTER
```

这个过程可以进一步简化成：

```javascript
User
 ↓
GLOFTER
 ↓
App Kit
 ↓
Arc
 ↓
PaymentRouter
 ↓
Revenue Split
```

---

# 19. App Kit 和你的 Payment Contract 是两回事

这是开发 GLOFTER 时必须分清的。

### App Kit

解决：

```javascript
USDC 从哪里来？
怎么跨链？
怎么 Swap？
怎么转账？
```

### GLOFTER Smart Contract

解决：

```javascript
这个 100 USDC 怎么分？
谁是摄影师？
谁是 Hub？
谁获得 Protocol Fee？
订单是否完成？
退款怎么办？
```

所以：

```javascript
        GLOFTER
           │
     ┌─────┴─────┐
     ▼           ▼
 App Kit      GLOFTER Contract
     │           │
 资金流动       商业规则
     │           │
     └─────┬─────┘
           ▼
          Arc
```

**不要把商业分账逻辑塞进 App Kit。**

App Kit 是金融基础设施 SDK。

---

# 20. App Kit 的“收费”机制

官方特别提到一个功能：

> Application monetization
> 

也就是说应用可以向终端用户收取自定义费用，而不需要自己重新实现一套底层收费机制。([Arc Docs](https://docs.arc.io/app-kit))

这对 GLOFTER 很有价值。

例如：

```javascript
摄影服务：100 USDC

GLOFTER Platform Fee
5 USDC
```

或者：

```javascript
Bridge
1 USDC

GLOFTER Service Fee
0.2 USDC
```

因此 App Kit 不只是技术 SDK，也考虑了应用商业化。

---

# 21. 你需要重点理解的两个底层协议

App Kit 当前主要帮你抽象：

### CCTP

用于：

```javascript
USDC 跨链
```

例如：

```javascript
Ethereum → Arc
Solana → Arc
```

### Gateway

主要用于：

```javascript
Unified Balance
```

也就是：

```javascript
多链 USDC
 ↓
Unified Balance
 ↓
即时消费
```

官方文档明确把 App Kit 描述为建立在 Gateway 和 CCTP 等底层协议之上的统一接口。([Arc Docs](https://docs.arc.io/app-kit))

因此学习顺序应该是：

```javascript
App Kit
 ↓
知道 CCTP 是什么
 ↓
知道 Gateway 是什么
```

**而不是一开始就深入研究 CCTP 合约。**

---

# 22. App Kit 的完整开发流程

我建议你按照这个顺序实际学习：

```javascript
① Node.js / TypeScript
        ↓
② Viem
        ↓
③ Wallet
        ↓
④ App Kit
        ↓
⑤ Send
        ↓
⑥ Bridge
        ↓
⑦ Swap
        ↓
⑧ Unified Balance
        ↓
⑨ Arc Smart Contract
        ↓
⑩ GLOFTER Payment Contract
        ↓
⑪ Revenue Split
        ↓
⑫ Agent Payment
```

---

# 23. 第一阶段：只做 Send

不要一开始就搞跨链。

做：

```javascript
Wallet A
   │
   │ 1 USDC
   ▼
Wallet B
```

掌握：

```javascript
adapter
chain
token
amount
recipient
transaction
```

代码：

```javascript
await kit.send({
  from: {
    adapter,
    chain: "Arc_Testnet",
  },
  to: recipient,
  amount: "1",
  token: "USDC",
});
```

---

# 24. 第二阶段：Bridge

然后：

```javascript
Base Sepolia
      │
      │ 1 USDC
      ▼
Arc Testnet
```

掌握：

```javascript
from
to
adapter
amount
```

以及：

```javascript
CCTP
```

的基本概念。

官方 Bridge Quickstart 就是按照这个路线设计的。([Arc Docs](https://docs.arc.io/app-kit/bridge?utm_source=chatgpt.com))

---

# 25. 第三阶段：Unified Balance

然后做：

```javascript
Base
  10 USDC
     │
Arbitrum
  20 USDC
     │
Solana
  30 USDC
     │
     ▼
Unified Balance
     │
     ▼
Arc
  支付 50 USDC
```

这是最能体现 App Kit 与普通 ERC-20 SDK 区别的实验。

---

# 26. 第四阶段：GLOFTER PaymentRouter

再写自己的 Solidity：

```javascript
function pay(
    address photographer,
    address hub,
    uint256 amount
) external {
    // split USDC
}
```

例如：

```javascript
100 USDC

80% → Photographer
15% → Hub
5%  → GLOFTER
```

这样你就把：

```javascript
App Kit
+
Arc
+
USDC
+
Smart Contract
```

真正串起来了。

---

# 27. 第五阶段：把 AI Agent 接进来

最后：

```javascript
User
 │
 ▼
GLOFTER AI Agent
 │
 │ 找摄影师
 │
 ▼
Service
 │
 │ 100 USDC
 ▼
App Kit
 │
 ▼
Arc
 │
 ▼
PaymentRouter
 │
 ├── Photographer
 ├── Hub
 └── GLOFTER
```

这时候你之前设计的：

> **GLOFTER AI Photographer Agent**
> 

就真正拥有了**支付能力**。

---

# 28. 最终你应该形成这张脑图

```javascript
                         GLOFTER
                            │
                 ┌──────────┴──────────┐
                 │                     │
             User / Agent           Merchant
                 │                     │
                 └──────────┬──────────┘
                            ▼
                       App Kit
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
      Send                Bridge               Swap
       │                    │                    │
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                     Unified Balance
                            │
                            ▼
                    Circle Infrastructure
                       │             │
                      CCTP        Gateway
                       │             │
                       └──────┬──────┘
                              ▼
                     Ethereum / Base /
                    Solana / Arc / ...
                              │
                              ▼
                         Arc Network
                              │
                              ▼
                    GLOFTER Smart Contract
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
          Photographer       Hub        Developer
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                            USDC
```

---

# 29. 你真正需要掌握的知识点

如果把官方 App Kit 文档压缩成一个学习清单，我建议只记下面这些：

### 必须掌握

**App Kit**

```javascript
@circle-fin/app-kit
```

**Adapter**

```javascript
Viem
Ethers
Solana
Circle Wallets
```

**四个 API**

```javascript
kit.send()
kit.bridge()
kit.swap()
kit.unifiedBalance.deposit()
kit.unifiedBalance.spend()
```

**两个底层协议**

```javascript
CCTP
Gateway
```

**三个重要概念**

```javascript
Chain
Token
Wallet Adapter
```

---

### 第二阶段掌握

```javascript
Arc Testnet
Arc Mainnet

USDC
EURC

Smart Contract
ERC-20
Viem
Solidity
Foundry
```

---

### 最后再学

```javascript
Account Abstraction
Smart Wallet
Paymaster
Session Key
Delegate
Agentic Payment
```

Arc 官方的 Build 文档目前也把 Account Abstraction、Node Providers、Data Indexers、Compliance 等作为生态开发工具单独列出。([Arc Docs](https://docs.arc.io/build?utm_source=chatgpt.com))

---

# 30. 如果你的目标是 GLOFTER，我建议不要把 App Kit 全部学完再开发

你可以直接做一个 **GLOFTER Arc Lab**：

```javascript
glofter-arc-lab/
│
├── 01-send/
│   └── Arc → Wallet
│
├── 02-bridge/
│   └── Base → Arc
│
├── 03-unified-balance/
│   └── Base + Solana → Arc
│
├── 04-payment/
│   └── User → Photographer
│
├── 05-revenue-share/
│   └── Photographer + Hub + GLOFTER
│
└── 06-agent-payment/
    └── AI Agent → Photographer
```

每个目录都是一个**可运行的小实验**。

这样学完 `06-agent-payment`，你实际上已经不是“看懂 Arc 文档”，而是已经掌握：

```javascript
Wallet
 ↓
USDC
 ↓
App Kit
 ↓
CCTP
 ↓
Gateway
 ↓
Arc
 ↓
Smart Contract
 ↓
Revenue Share
 ↓
AI Agent
```

这条路线对你目前的 GLOFTER 项目尤其合适。

**建议你的第一份代码就从** **`01-send`** **开始，而不是从 Solidity 开始。** App Kit 官方的安装方式目前也是先安装 `@circle-fin/app-kit` + 对应 Adapter；官方 Quickstart 当前要求 Node.js 22+。([Arc Docs](https://docs.arc.io/app-kit/tutorials/installation?utm_source=chatgpt.com))

官方文档：[App Kit 总览](https://docs.arc.io/app-kit?utm_source=chatgpt.com) · [Installation](https://docs.arc.io/app-kit/tutorials/installation?utm_source=chatgpt.com) · [Bridge](https://docs.arc.io/app-kit/bridge?utm_source=chatgpt.com) · [Unified Balance](https://docs.arc.io/app-kit/unified-balance?utm_source=chatgpt.com) · [Send](https://docs.arc.io/app-kit/send?utm_source=chatgpt.com) · [Swap](https://docs.arc.io/app-kit/swap?utm_source=chatgpt.com)。
