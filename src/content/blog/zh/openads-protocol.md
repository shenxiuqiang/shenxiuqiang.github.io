---
title: 'OpenAds Protocol 去中心化广告网络产品设计文档'
description: 'OpenAds Protocol 是一个面向去中心化应用的开放广告协议。'
pubDate: '2026-09-09'
tags: ['Blocklet', 'OpenAds', 'Web3']
cover: '/images/posts/bafkreibqtfeu3afulzcquvcwia3wwp7mazqsy55v4kjtwb2rs7rni54igu.webp'
---

## 去中心化广告网络产品设计文档 V0.1

## 1. 产品概述

OpenAds Protocol 是一个面向去中心化应用的开放广告协议。

它不建立一个统一控制所有广告主、广告内容和流量的平台，而是把传统广告网络拆成两个可以独立部署、自由组合的 Blocklet：

**AdHub Blocklet**

负责广告主、广告活动、广告素材、广告价格、预算、广告策略、资金管理和广告结算。

**AdSlot Blocklet**

负责嵌入不同 DApp，在页面中提供统一广告位，发现可用 AdHub，选择广告源、请求广告、展示广告、记录广告事件并完成计费。

整体关系为：

```javascript
Advertiser
    │
    │ 购买广告
    ▼
┌───────────────────┐
│   AdHub Blocklet  │
│                   │
│ 广告主             │
│ Campaign          │
│ Creative          │
│ Budget            │
│ Pricing           │
│ Targeting         │
│ Settlement        │
└─────────┬─────────┘
          │
          │ OpenAds API
          │
          ▼
┌───────────────────┐
│   AdSlot Blocklet │
│                   │
│ AdHub Discovery   │
│ Ad Selection      │
│ Rendering         │
│ Measurement       │
│ Billing           │
└─────────┬─────────┘
          │
          │ Embed / SDK
          ▼
┌───────────────────┐
│       DApp        │
│                   │
│   Content         │
│   Service         │
│   Marketplace     │
│   Community       │
└───────────────────┘
          │
          ▼
         User

```

OpenAds 的核心目标不是创建另一个 Google Ads。

而是：

> **建立一个任何人都可以运营广告网络、任何 DApp 都可以接入广告收入的开放协议。**
> 

---

# 2. 为什么需要两个 Blocklet

传统广告平台实际上同时控制了两个市场：

```javascript
广告主
  ↓
广告平台
  ↓
网站 / App

```

广告主只能向平台购买广告。

开发者也只能接受平台提供的广告。

平台因此同时控制：

- 广告主；
- 广告价格；
- 广告库存；
- 广告选择；
- 用户数据；
- 广告计费；
- 收益分配。

OpenAds 将其拆开：

```javascript
                AdHub A
               /
Advertisers → AdHub B
               \
                AdHub C

                   ↓

            OpenAds Protocol

                   ↓

             AdSlot Blocklet

                   ↓

          DApp A / B / C / D

```

任何人都可以运营 AdHub。

任何 DApp 都可以部署 AdSlot。

一个 DApp 可以选择：

```javascript
AdHub A

```

也可以以后同时连接：

```javascript
AdHub A
AdHub B
AdHub C

```

让不同广告网络之间竞争。

因此系统中不存在唯一的“广告平台”。

---

# 3. 三类核心参与者

## 3.1 Advertiser

广告主。

可以是：

- DApp；
- Blocklet 开发者；
- Web3 项目；
- AI 产品；
- 电商；
- 游戏；
- SaaS；
- 社区；
- 传统互联网企业。

广告主向某个 AdHub 提交 Campaign。

例如：

```javascript
Campaign

Product:
AIGNE Studio

Budget:
10,000 USDC

Price:
5 USDC CPM

Region:
Global

Category:
AI / Developer

Start:
2026-09-01

End:
2026-09-30

```

---

# 4. AdHub Blocklet

AdHub 可以理解为：

> **一个独立运营的去中心化广告网络节点。**
> 

任何团队都可以部署。

例如：

```javascript
ArcBlock Ads
Developer Ads
AI Ads
Gaming Ads
Photography Ads
Web3 Ads
Seattle Local Ads

```

这些都可以是不同的 AdHub。

不同 AdHub 可以形成自己的广告市场定位。

---

## 4.1 广告主接入

AdHub 提供 Advertiser Console。

广告主通过 DID Connect 登录。

然后：

```javascript
Create Campaign
      ↓
Upload Creative
      ↓
Set Budget
      ↓
Select Target
      ↓
Deposit Funds
      ↓
Review
      ↓
Active

```

AdHub 运营者可以：

接受广告主主动提交；

也可以主动寻找广告主并代为创建 Campaign。

因此一个 AdHub 既可以完全自动运行，也可以采用传统广告公司的运营模式。

---

# 5. AdHub 的广告审核

去中心化并不意味着：

> 什么广告都必须展示。
> 

每一个 AdHub 都拥有自己的内容政策。

例如：

```javascript
AdHub A
Developer / AI Ads Only

AdHub B
General Ads

AdHub C
Family Safe

AdHub D
Crypto / Web3 Only

```

AdHub Operator 可以审核：

- 广告内容；
- 目标网址；
- 广告素材；
- 产品真实性；
- 法律风险；
- 恶意软件；
- 色情；
- 赌博；
- 欺诈；
- 政治广告；
- 地区限制。

因此：

> **OpenAds 去中心化的是广告网络的所有权，而不是取消广告运营责任。**
> 

---

# 6. Campaign 数据结构

一个标准 Campaign 可以包含：

```javascript
Campaign
├── campaignDID
├── advertiserDID
├── adHubDID
│
├── name
├── category
├── description
│
├── startTime
├── endTime
│
├── totalBudget
├── remainingBudget
│
├── pricingModel
│   ├── CPM
│   ├── CPC
│   └── CPA
│
├── bidPrice
│
├── targeting
│   ├── language
│   ├── country
│   ├── category
│   ├── device
│   └── context
│
└── creatives[]

```

一个 Campaign 可以包含多个 Creative。

---

# 7. Creative

Creative 是真正展示给用户的广告。

V1 建议只支持三种标准格式：

### Native Card

适合社区、内容应用、Marketplace。

```javascript
Image
Title
Description
CTA
Destination

```

### Banner

例如：

```javascript
728 × 90
320 × 100
300 × 250

```

### Compact Card

适合侧栏、小组件和移动应用。

未来再扩展：

```javascript
Video
Interactive
Mini DApp
Playable
Sponsored Content

```

---

# 8. AdSlot Blocklet

AdSlot 是整个系统最重要的公共组件。

它不是广告运营平台。

它代表：

> **DApp 中的一个开放广告位。**
> 

例如一个 Discuss 社区：

```javascript
Article
Article
Article

──────────────
     AdSlot
──────────────

Article
Article

```

Marketplace：

```javascript
Product
Product
Product

Sponsored
[ AdSlot ]

Product
Product

```

GLOFTER：

```javascript
Photographer
Photographer

Sponsored
Camera / Travel / Print Ad

Photographer

```

开发者只需要把 AdSlot 嵌入自己的 Blocklet。

---

# 9. AdSlot 应该成为标准 Blocklet Component

理想的开发体验应该非常简单。

例如：

```javascript
<AdSlot
  slot="article-feed"
  category="technology"
  format="native"
/>

```

或者：

```javascript
<openads-slot
  slot="sidebar"
  format="300x250">
</openads-slot>

```

AdSlot 自己负责：

```javascript
发现 AdHub
↓
连接 AdHub
↓
请求广告
↓
选择广告
↓
展示
↓
记录 Impression
↓
记录 Click
↓
计费
↓
结算

```

DApp 开发者不需要实现这些逻辑。

---

# 10. AdHub NFT：去中心化广告网络发现

这是整个方案里非常有 Web3 特征的一部分。

每一个正式运行的 AdHub 都拥有一个：

# AdHub NFT

这个 NFT 表示：

> 一个正在提供 OpenAds 服务的广告网络节点。
> 

可以包含：

```javascript
AdHub NFT

Name
DID
Operator DID
Endpoint
Protocol Version
Categories
Regions
Pricing Models
Policy
Reputation
Manifest Hash

```

NFT 本身不需要保存所有动态信息。

可以保存：

```javascript
AdHub DID
+
Manifest URI
+
Manifest Hash

```

真正的动态信息通过 AdHub DID / Manifest 获取。

---

# 11. AdHub Registry

AdHub NFT 被质押到：

```javascript
OpenAds Registry

```

形成公开广告网络列表。

例如：

```javascript
OpenAds Registry

AdHub NFT #182
ArcBlock Developer Ads

AdHub NFT #327
Web3 Global Ads

AdHub NFT #672
AI Product Ads

AdHub NFT #983
Photography Ads

```

AdSlot 查询 Registry：

```javascript
AdSlot
   ↓
OpenAds Registry
   ↓
发现 AdHub NFT
   ↓
读取 AdHub DID
   ↓
读取 Service Endpoint
   ↓
连接 AdHub

```

因此不需要：

```javascript
ads.openads.com

```

这样的中心服务器保存所有广告节点。

---

# 12. NFT 与经济质押应该分离

这里建议区分两个概念。

**AdHub NFT**

表示服务身份。

**Stake**

表示经济保证。

因此：

```javascript
AdHub NFT
+
ABT / Stablecoin Stake

```

共同注册到 Registry。

原因很简单：

NFT 本身代表身份，但未必具有足够经济价值。

如果 AdHub 从事：

- 欺诈；
- 恶意广告；
- 不支付 Publisher；
- 伪造结算；

协议未来可以通过 Governance / Arbitration 对保证金进行处罚。

这会形成：

```javascript
身份
+
信誉
+
经济责任

```

三个层次。

---

# 13. DApp 如何选择 AdHub

DApp Operator 打开 AdSlot 管理界面后，可以看到：

```javascript
Available Ad Networks

ArcBlock Developer Ads
★★★★★
CPM $3.20
Revenue Share 80%
AI / Developer

Web3 Global Ads
★★★★☆
CPM $4.10
Revenue Share 75%
Web3 / Crypto

General Ads
★★★★☆
CPM $2.30
Revenue Share 85%
General

```

DApp 可以选择一个 AdHub：

```javascript
Primary AdHub:
ArcBlock Developer Ads

```

V1 建议：

> 一个 AdSlot 只连接一个 AdHub。
> 

保持系统简单。

未来 V2 再支持：

```javascript
AdHub A
AdHub B
AdHub C

```

动态竞争。

---

# 14. 广告请求流程

用户打开 DApp 页面：

```javascript
User
 ↓
DApp
 ↓
AdSlot
 ↓
AdHub

```

AdSlot 发送：

```javascript
AdRequest

slot
format
pageCategory
language
country
deviceType
context
anonymousSession

```

例如：

```javascript
{
  "slot": "article-feed",
  "format": "native",
  "category": "AI",
  "language": "zh",
  "country": "US"
}

```

AdHub 返回：

```javascript
AdResponse

campaignId
creativeId
creative
destination
price
billingModel
requestToken
expiry
signature

```

---

# 15. 广告选择权属于 AdHub

V1 中建议：

AdSlot：

> 描述当前广告位。
> 

AdHub：

> 决定展示哪个广告。
> 

例如 AdHub 内部可以采用：

```javascript
Campaign targeting
+
Budget
+
Bid
+
Frequency
+
Ad quality
+
Remaining budget

```

计算广告。

因此不同 AdHub 可以发展自己的广告算法。

OpenAds Protocol 不强制所有广告网络使用同一种推荐算法。

---

# 16. 广告价格

AdHub 可以定义自己的价格体系。

初期支持：

### CPM

每 1000 次有效展示收费。

### CPC

有效点击收费。

### CPA

有效转化收费。

V1 最适合首先支持：

```javascript
CPM
+
CPC

```

CPA 涉及跨应用 Conversion Proof，可以放到后续版本。

---

# 17. 为什么计费应该由 AdSlot 负责

这是这个架构非常关键的一点。

传统广告平台：

```javascript
广告平台
说展示了多少次
↓
广告主相信平台

```

OpenAds 可以设计成：

```javascript
AdHub
提供广告

AdSlot
确认展示

```

也就是说：

> **卖广告的人和证明广告被展示的人不是同一个节点。**
> 

这比完全由 AdHub 自己统计更合理。

---

# 18. Delivery Receipt

每一个有效广告事件由 AdSlot 生成：

# Delivery Receipt

例如：

```javascript
campaignId
creativeId
adHubDID
slotDID
publisherDID

eventType:
IMPRESSION

timestamp

requestToken

eventNonce

viewability

signature

```

AdSlot 使用自己的 DID 签名：

```javascript
AdSlot Signature

```

AdHub 验证以后：

```javascript
Valid
↓
Billable Event

```

---

# 19. 广告展示计费

资金流建议设计成：

```javascript
Advertiser
     │
     │ 预存预算
     ▼
 AdHub Escrow
     │
     │
     │ 广告展示
     ▼
   AdSlot
     │
     │ Delivery Receipt
     ▼
   AdHub
     │
     │ Settlement
     ▼
┌──────────────┐
Publisher
AdHub Operator
Protocol
└──────────────┘

```

例如：

广告 CPM：

```javascript
$10

```

1000 次有效展示：

```javascript
Advertiser Cost
$10

```

分配：

```javascript
Publisher       $8.00
AdHub Operator  $1.50
OpenAds         $0.50

```

具体比例完全由 AdHub 和 Publisher 协商。

---

# 20. AdSlot 计费，AdHub 扣款

这里需要明确两个职责：

AdSlot：

> 产生可计费事件。
> 

AdHub：

> 根据 Campaign 价格扣除广告主 Budget。
> 

因此不是 AdSlot 直接从广告主钱包取钱。

完整逻辑是：

```javascript
AdSlot
   ↓
Billable Event
   ↓
AdHub
   ↓
Verify
   ↓
Campaign Budget - Price
   ↓
Publisher Balance + Revenue

```

这样职责非常清晰。

---

# 21. Publisher Revenue

每个 DApp 都有自己的：

```javascript
Publisher Account

```

例如：

```javascript
Discuss Kit
Publisher DID:
did:abt:xxx

Balance:
1,283 USDC

```

Publisher 可以：

```javascript
Withdraw

```

也可以设置：

```javascript
Auto Settlement
Daily
Weekly
Monthly

```

---

# 22. 与 Reward Protocol 结合

OpenAds 可以和前面提出的 Reward Protocol 形成非常有意思的组合。

例如一个 DApp：

```javascript
广告收入
   ↓
Publisher Revenue
   ↓
90% DApp Operator
10% Community Reward Pool

```

最终形成：

```javascript
Advertiser
   ↓
OpenAds
   ↓
DApp
   ↓
Advertising Revenue
   ↓
Reward Protocol
   ↓
Users

```

这意味着用户即使没有直接购买商品，也可能因为使用 DApp、创造广告价值而参与应用经济。

于是两个公共组件分别解决：

```javascript
OpenAds Protocol
= DApp 如何获得收入

Reward Protocol
= DApp 如何把部分收入返还给用户

```

组合起来可能形成完整的：

# Decentralized Growth Infrastructure

---

# 23. 不建立全球用户广告画像

OpenAds 不应该复制传统互联网广告最大的争议：

> 跨网站追踪用户。
> 

V1 建议优先采用：

# Contextual Advertising

广告根据：

```javascript
当前 DApp
当前页面
内容分类
语言
粗粒度地区
设备类型

```

选择。

而不是：

```javascript
这个用户昨天搜索了什么
访问了什么网站
买过什么
住在哪里
收入多少

```

---

# 24. DID 与隐私

用户真实 DID 不应该直接发送给 AdHub。

AdSlot 可以生成：

```javascript
Epoch User ID

```

例如：

```javascript
hash(
  userDID
  + adHubDID
  + epoch
)

```

得到临时标识。

于是 AdHub 可以实现：

```javascript
Frequency Cap

```

例如：

> 同一个用户一天最多看到某广告 3 次。
> 

但无法轻易跨不同 AdHub 建立永久用户画像。

---

# 25. 广告欺诈

去中心化广告系统最大的技术挑战不是展示广告，而是：

# Ad Fraud

例如 DApp Operator 可以自己制造：

```javascript
1,000,000 fake impressions

```

骗取广告费。

因此必须建立反作弊体系。

V1 可以采用：

```javascript
AdHub Request Token
+
AdSlot DID Signature
+
Session Nonce
+
Rate Limit
+
Viewability
+
Publisher Reputation

```

后续可以进一步增加：

```javascript
User Proof
Risk Model
Challenge Protocol
Stake
Fraud Arbitration

```

---

# 26. Publisher Reputation

每个 AdSlot / Publisher 可以形成公开信誉：

```javascript
Publisher

DID
Traffic
Valid Impression Rate
Click Rate
Fraud Rate
Dispute Rate
AdHub Relationships
Account Age
Stake

```

AdHub 可以设置：

```javascript
Minimum Reputation

```

例如新 Publisher：

```javascript
CPM $1

```

高信誉 Publisher：

```javascript
CPM $8

```

由市场自然形成价格差异。

---

# 27. AdHub Reputation

同样，Publisher 也需要判断 AdHub。

例如：

```javascript
AdHub Reputation

Campaign Volume
Payment Volume
Settlement Rate
Advertisers
Publishers
Disputes
Account Age
Stake

```

因此关系不是：

```javascript
广告平台挑网站

```

而是：

```javascript
AdHub 挑 Publisher
+
Publisher 挑 AdHub

```

双方共同选择。

---

# 28. OpenAds Registry

最终 Registry 可以成为整个生态的服务发现层：

```javascript
              OpenAds Registry
                     │
       ┌─────────────┼─────────────┐
       │             │             │
     AdHub A       AdHub B       AdHub C
       │             │             │
       │             │             │
     AdSlot        AdSlot        AdSlot
       │             │             │
      DApp          DApp          DApp

```

Registry 不负责：

```javascript
广告内容
广告算法
广告资金
广告展示

```

它只负责：

```javascript
Discovery
Identity
Stake
Metadata
Reputation reference
Protocol compatibility

```

这样 Registry 很难成为新的中心化平台。

---

# 29. OpenAds 标准接口

协议建议定义六组核心 API。

```javascript
/.well-known/openads

GET  /manifest
GET  /campaigns/quote
POST /ads/request
POST /events
POST /settlements
GET  /publisher/account

```

其中：

### Manifest

告诉 AdSlot：

```javascript
我是谁
支持哪个协议版本
支持哪些广告类型
覆盖哪些地区
支持什么计价方式
API Endpoint

```

---

# 30. AdHub Manifest

示例：

```javascript
{
  "protocol": "openads",
  "version": "1.0",
  "name": "Developer Ads",
  "did": "did:abt:...",
  "categories": [
    "developer",
    "ai",
    "web3"
  ],
  "formats": [
    "native",
    "banner"
  ],
  "pricing": [
    "CPM",
    "CPC"
  ],
  "regions": [
    "GLOBAL"
  ]
}

```

所有 AdHub 使用统一格式。

这样 AdSlot 才能自由切换广告网络。

---

# 31. AdSlot 管理界面

DApp Operator 看到：

```javascript
OpenAds

Ad Slots

Article Feed
Native
ACTIVE

Sidebar
300 × 250
ACTIVE

Footer
728 × 90
DISABLED

```

进入某个 Slot：

```javascript
Ad Network

● Developer Ads
○ Web3 Global
○ General Ads

Category

Developer
AI

Minimum CPM

$3.00

Blocked Categories

Gambling
Adult
Politics

```

无需写代码即可管理。

---

# 32. AdHub 管理界面

运营者看到：

```javascript
Advertisers
Campaigns
Creatives
Publishers
Revenue
Settlement
Review Queue
Fraud
Analytics

```

Dashboard：

```javascript
Active Campaigns       127

Advertiser Balance     $182,381

Today Impressions      3,281,223

Today Clicks           38,173

Publisher Revenue      $12,837

AdHub Revenue          $2,193

```

这使 AdHub 本身可以成为一个完整商业产品。

---

# 33. 谁可以运营 AdHub？

任何人。

这是这个系统最重要的地方之一。

例如一家摄影行业公司可以运营：

# Photography AdHub

专门接受：

```javascript
Camera
Lens
Travel
Print
Photo Software
Studio

```

GLOFTER 等摄影 DApp 可以优先选择这个网络。

另一个团队可以运营：

# Developer AdHub

广告主可能是：

```javascript
AI API
Cloud
Database
Developer Tools
Blocklets

```

开发者社区接入它。

这样出现的不是一个巨大的通用广告公司，而是：

> **大量垂直广告市场。**
> 

---

# 34. AdHub 之间最终可以竞争

当系统成熟后，AdSlot 可以同时连接：

```javascript
AdHub A
AdHub B
AdHub C

```

发送：

```javascript
AdOpportunity

```

三个 AdHub 返回：

```javascript
A → CPM $4.20
B → CPM $5.10
C → CPM $3.80

```

AdSlot 可以选择：

```javascript
B

```

这实际上会形成一个去中心化：

# Real-Time Ad Marketplace

但这应该属于 V2/V3。

第一版完全没有必要做 RTB。

---

# 35. 商业模型

OpenAds Protocol 本身也需要收入。

建议每一次广告结算收取：

```javascript
0.5% ～ 3%

```

协议费。

例如：

```javascript
Advertiser Spend
$100

Publisher
$80

AdHub
$18

OpenAds Protocol
$2

```

不同 AdHub 可以自行决定自己的佣金。

OpenAds 只收统一协议费。

---

# 36. 一个非常重要的市场机制

传统广告平台存在一个问题：

> 平台规模越大，广告主和 Publisher 越难离开。
> 

OpenAds 应该反过来。

如果 Publisher 不喜欢 AdHub A：

```javascript
AdHub A
↓
Disconnect

```

然后：

```javascript
AdHub B
↓
Connect

```

DApp 页面中的：

```javascript
<AdSlot />

```

完全不需要修改。

广告网络成为：

# Replaceable Provider

这可能是 OpenAds 最核心的产品价值之一。

---

# 37. MVP

第一阶段应该非常克制。

## OpenAds V0.1

只实现：

```javascript
1 个 AdHub Blocklet
1 个 AdSlot Blocklet

DID Login
AdHub NFT
Registry Discovery

Campaign
Creative

Native Ad
Banner Ad

CPM
CPC

Campaign Budget

Ad Request
Impression
Click

Delivery Receipt

Publisher Revenue

Settlement

```

不要一开始开发：

```javascript
RTB
AI Targeting
CPA
Conversion Network
Cross-chain
Video Ads
Global User Profile
复杂机器学习

```

先验证最核心的问题：

> **一个独立 AdHub 能不能通过标准接口给多个完全不同的 DApp 提供广告，并自动完成计费和收入分配。**
> 

---

# 38. 第二阶段

V0.5：

```javascript
多个 AdHub
AdHub Registry
AdHub NFT Staking
Publisher Reputation
AdHub Reputation
Fraud Detection
Multiple Pricing

```

---

# 39. 第三阶段

V1.0：

```javascript
Multi-AdHub
Dynamic Routing
Competitive Bidding
Contextual Targeting
Reward Protocol Integration
Public Analytics
Governance
Dispute Resolution

```

最终再考虑：

# Decentralized Ad Exchange

---

# 40. 整个系统最终的形态

```javascript
                     Advertisers
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       AdHub A          AdHub B          AdHub C
          │               │               │
          │ AdHub NFT     │ AdHub NFT     │ AdHub NFT
          └───────────────┼───────────────┘
                          │
                  OpenAds Registry
                          │
                  NFT / DID Discovery
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       AdSlot           AdSlot           AdSlot
          │               │               │
          ▼               ▼               ▼
        DApp A           DApp B          DApp C
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                        Users

```

资金流：

```javascript
Advertiser
    ↓
Campaign Budget
    ↓
AdHub
    ↓
Ad Delivered
    ↓
AdSlot Proof
    ↓
Settlement
    ↓
┌───────────────┐
│ Publisher     │
│ AdHub         │
│ OpenAds       │
└───────────────┘

```

服务发现：

```javascript
AdHub
  ↓
AdHub NFT
  ↓
Stake
  ↓
OpenAds Registry
  ↓
AdSlot Discovery
  ↓
Connect

```

---

# 41. 产品定位

OpenAds 不应该被描述成：

> 一个去中心化 Google Ads。
> 

更加准确的是：

> **An Open Advertising Infrastructure for DApps.**
> 

中文：

# 面向 DApp 的开放广告基础设施

它提供的不是一个广告平台，而是一套标准：

```javascript
广告网络如何被发现
广告如何被请求
广告如何被展示
广告事件如何被证明
广告费用如何计算
Publisher 如何获得收入
AdHub 如何竞争

```

一旦这些接口成为标准，任何团队都可以进入其中任何一个角色。

---

# 42. OpenAds + Reward Protocol

如果把前面提出的 Reward Protocol 和 OpenAds 放在一起，会形成一个更加完整的 DApp 商业基础设施：

```javascript
                 DApp
                  │
            ┌─────┴─────┐
            │           │
          用户付费     广告收入
            │           │
            │        OpenAds
            │           │
            └─────┬─────┘
                  │
            Protocol Revenue
                  │
             Reward Protocol
                  │
                  ▼
                Users

```

OpenAds 回答：

> **DApp 如何通过流量赚钱？**
> 

Reward Protocol 回答：

> **DApp 如何把部分增长收益返给用户？**
> 

Payment Kit 回答：

> **用户如何付款？**
> 

DID 回答：

> **参与者是谁？**
> 

Blocklet 回答：

> **这些能力如何被组件化和部署？**
> 

如果这些模块最终可以组合起来，那么一个新 DApp 的商业能力也可以像软件组件一样被安装：

```javascript
Identity
Payment
Storage
Advertising
Rewards

```

这可能是比单独开发一个广告产品更值得探索的方向。

---

# 43. 核心原则

OpenAds Protocol 最终应该坚持六个原则：

**广告网络去中心化**

任何人都可以运营 AdHub。

**广告位标准化**

任何 DApp 都可以嵌入 AdSlot。

**服务自由选择**

Publisher 可以随时切换 AdHub。

**资金可验证**

广告预算、计费和结算可以被验证。

**隐私优先**

默认采用 Contextual Advertising，而不是跨站用户追踪。

**协议而不是平台**

OpenAds 自己不应该成为新的广告垄断者。

最终目标不是建立：

```javascript
One Advertising Company

```

而是建立：

```javascript
One Advertising Protocol
        ↓
Thousands of Ad Networks
        ↓
Thousands of DApps

```

这才是 OpenAds 真正去中心化的意义。

[OpenAds Protocol：面向 DApp 的开放广告基础设施](/posts/318f0b91-69d8-4f44-a787-1fd1cc6ef58b/)
