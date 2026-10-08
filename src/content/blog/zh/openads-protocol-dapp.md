---
title: 'OpenAds Protocol：面向 DApp 的开放广告基础设施'
description: '传统广告网络（Google Ads、Meta Ads 等）把广告主、流量、定价、选择权、用户数据和结算全部集中在单一平台手里。广告主只能向平台买广告，开发者也只能接受平台提供的广告源。平台同时控制广告主、库存、价格、数据与收益分配，形成强锁定。'
pubDate: '2026-09-09'
tags: ['Blocklet', 'OpenAds', 'Web3']
cover: '/images/posts/bafkreibqtfeu3afulzcquvcwia3wwp7mazqsy55v4kjtwb2rs7rni54igu.webp'
---

传统广告网络（Google Ads、Meta Ads 等）把广告主、流量、定价、选择权、用户数据和结算全部集中在单一平台手里。广告主只能向平台买广告，开发者也只能接受平台提供的广告源。平台同时控制广告主、库存、价格、数据与收益分配，形成强锁定。

OpenAds Protocol 换了一种思路：它不试图再造一个“去中心化 Google Ads”，而是把广告网络拆成两个可独立部署、自由组合的 Blocklet，让任何人都能运营广告网络，任何 DApp 都能接入广告收入。

### 它是什么

OpenAds 是一套开放协议，核心由两部分组成：

- **AdHub Blocklet**：广告网络节点。负责广告主、Campaign、Creative、预算、定价、定向、审核、资金托管与结算。任何人都可以部署自己的 AdHub（垂直领域如 Developer Ads、AI Ads、Photography Ads、Web3 Ads 等）。
- **AdSlot Blocklet**：标准化广告位组件。嵌入 DApp 后，负责发现可用 AdHub、请求广告、展示、记录 Impression/Click、生成 Delivery Receipt 并完成计费。

关系很清晰：

Advertiser → AdHub（运营广告与资金） → OpenAds API → AdSlot（嵌入 DApp） → User

DApp 开发者只需要像使用普通组件一样嵌入：

tsx

```javascript
<AdSlot slot="article-feed" category="technology" format="native" />
```

或对应的 Web Component，剩下的发现、选择、展示、证明、结算全部由 AdSlot 处理。

### 核心特点

1. **真正去中心化的广告网络所有权** 没有唯一中心广告平台。任何人都可以运营 AdHub，不同 AdHub 可以形成垂直市场并相互竞争。DApp 可随时切换 AdHub，页面中的 &lt;AdSlot /&gt; 无需改动。
2. **服务发现用 NFT + Registry，而非中心服务器** 每个正式运行的 AdHub 对应一个 AdHub NFT（身份），配合经济质押注册到 OpenAds Registry。AdSlot 通过 Registry 发现可用广告网络，读取 DID 与 Endpoint，再连接。没有 ads.openads.com 这类中心节点。
3. **计费与证明分离，职责清晰** AdHub 提供广告与预算托管，AdSlot 负责确认展示并签名生成 Delivery Receipt。卖广告的人和证明广告被展示的人不是同一个节点，比传统平台自报数据更合理。资金从广告主预存预算中按有效事件扣除，再按约定分配给 Publisher、AdHub Operator 与协议。
4. **隐私优先的 Contextual Advertising** V1 不建立跨站用户画像，不追踪“这个用户昨天搜了什么、买过什么”。广告主要根据当前 DApp、页面内容分类、语言、粗粒度地区、设备类型等上下文选择。用户真实 DID 不会直接发给 AdHub，可用临时 Epoch User ID 实现基础 Frequency Cap。
5. **标准化接口 + 可替换 Provider** 统一 Manifest、广告请求、事件上报、结算等接口。Publisher 不喜欢某个 AdHub，断开即可换另一个，广告网络变成可替换服务，而不是锁定平台。
6. **与 Reward Protocol 天然可组合** 广告收入可流入 Publisher 账户，再按比例进入社区奖励池。用户即使没有直接付费，也可能因创造广告价值而参与应用经济。OpenAds 解决“DApp 如何靠流量赚钱”，Reward Protocol 解决“如何把部分增长收益返给用户”，两者叠加形成更完整的去中心化增长基础设施。

### 对比传统广告平台

| 维度  | 传统广告平台  | OpenAds Protocol  |
|---|---|---|
| 控制权  | 平台同时控制广告主与流量  | AdHub 与 AdSlot 分离，可独立部署与切换  |
| 进入门槛  | 必须接入中心平台  | 任何人可运营 AdHub，任何 DApp 可嵌入 AdSlot  |
| 切换成本  | 高，数据与流程锁定  | 低，标准接口，换 AdHub 即可  |
| 用户隐私  | 深度跨站画像与追踪  | 默认 Contextual，尽量避免永久画像  |
| 计费可信度  | 平台自报  | AdSlot 签名 Delivery Receipt + AdHub 验证  |
| 市场形态  | 少数超级平台  | 大量垂直广告网络竞争  |
| 协议定位  | 封闭平台  | 开放标准与基础设施  |

### 颠覆性在哪里

- **从“一个广告公司”变成“一个广告协议”**。协议本身只定义发现、请求、展示、证明、结算与兼容性，不垄断广告内容、算法或资金。最终形态是成千上万个 AdHub + 成千上万个 DApp，而不是新的中心化巨头。
- **广告网络变成可插拔组件**。对 ArcBlock 生态尤其有价值：Blocklet 已经把身份、支付、存储等能力组件化，广告收入能力也可以像安装组件一样接入。
- **垂直市场自然涌现**。摄影类 DApp 可以优先接 Photography AdHub，开发者社区接 Developer AdHub，不再被迫接受通用广告源的低相关与低分成。
- **资金与证明可验证**。预算、有效事件、结算路径清晰，配合未来的声誉、质押与仲裁，能逐步降低欺诈空间。
- **增长闭环**。广告收入 + Reward Protocol，有机会让“用户使用 → 创造广告价值 → 获得奖励 → 更愿意使用”形成正向循环。

当然，去中心化广告最大的挑战从来不是展示广告，而是反作弊（假量、刷点击等）。文档里已规划 V1 用 Request Token、DID 签名、Nonce、Rate Limit、Viewability、Publisher Reputation 等基础手段，后续再叠加风险模型、质押与仲裁。这是务实路线，而不是一开始就承诺完美。

### 分阶段路线

- **V0.1（MVP）**：一个 AdHub + 一个 AdSlot，DID 登录、Campaign/Creative、Native + Banner、CPM/CPC、预算、请求、Impression/Click、Delivery Receipt、Publisher 收益与结算。先验证“一个独立 AdHub 能否通过标准接口服务多个不同 DApp，并自动完成计费与分配”。
- **V0.5**：多 AdHub、Registry + NFT 质押、双方声誉、基础反欺诈。
- **V1.0**：多 AdHub 动态路由与竞争、Contextual 增强、Reward Protocol 集成、公开分析与治理。

第一阶段刻意克制，不做 RTB、复杂 AI 定向、CPA 网络、视频广告、全局用户画像等，把核心闭环跑通最重要。

### 给 ArcBlock 社区的推荐

如果你在做社区、Marketplace、内容、摄影、开发者工具或其他 DApp，广告收入一直是现实痛点：要么接入中心化广告（隐私与分成不理想，且与 Web3 身份割裂），要么自己从零搭一套（成本高、难标准化）。

OpenAds 提供的是基础设施，而不是又一个封闭平台。AdSlot 可以很快变成标准组件，AdHub 可以由社区或垂直团队自行运营。配合已有的 DID、Payment Kit、Blocklet 组件化能力，以及未来的 Reward Protocol，有机会把“身份 → 支付 → 广告收入 → 用户激励”串成完整商业能力栈。

建议社区可以先从两件事开始：

1. 讨论并完善协议细节（Manifest 字段、Delivery Receipt 结构、基础反欺诈规则、分成默认建议等）。
2. 有兴趣的团队直接启动 V0.1 实现：一个可运行的 AdHub + 可嵌入的 AdSlot，在真实 DApp 里跑通广告请求到结算的闭环。

OpenAds 的目标不是取代 Google Ads，而是让广告网络像协议一样开放、可替换、可组合。一旦接口成为标准，任何团队都可以进入广告主、AdHub 运营者或 Publisher 任意角色。这才是去中心化广告真正有意义的地方。

欢迎在社区里继续讨论架构细节、MVP 优先级，以及如何与现有 Blocklet 生态更好结合。一起把面向 DApp 的开放广告基础设施跑起来。

[OpenAds Protocol 去中心化广告网络产品设计文档](/posts/f31ada5e-f554-4193-ba73-b765da7f5869/)
