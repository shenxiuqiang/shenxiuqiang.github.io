---
title: 'InfoPoint 白皮书 - 面向 AI 原生时代的空间感知与语义检索基础设施'
description: '版本：0.9 Draft'
pubDate: '2026-05-22'
tags: ['Blocklet', 'InfoPoint', 'DID', 'AI']
cover: '/images/covers/infopoint-whitepaper.jpg'
---

版本：0.9 Draft

---

# 摘要

InfoPoint 是一套面向 AI 原生互联网的空间发现与语义检索基础设施。

系统通过：

- BLE 近场发现
- LoRa 空间索引同步
- DID 空间身份
- Blocklet 空间运行时
- AI 原生语义检索

将现实空间转化为机器可理解、AI 可理解、可编程的语义空间节点。

与传统 IoT 系统不同，InfoPoint 并不试图将边缘硬件变成小型 Web Server。

InfoPoint 采用：

# Stateless Spatial Beacon Architecture（无状态空间信标架构）

即：

- 边缘节点只负责广播空间身份
- 节点之间同步轻量级空间索引
- 云端 Runtime 提供动态服务
- App 侧构建本地空间图谱与 AI 检索上下文

系统适用于：

- 餐饮
- 酒店
- 商场
- 展会
- 景区
- 创作者经济
- 本地生活
- AI 原生城市基础设施

---

# 1. 问题

现代互联网索引的是网页，而不是现实空间。

今天的空间发现仍然依赖：

- 地图平台
- 关键词搜索
- 二维码
- 中心化平台推荐
- 人工交互

现实空间缺乏：

- 全球可寻址身份
- AI 可读语义
- 实时空间状态
- 去中心化发现机制
- 统一语义协议

传统 BLE Beacon 系统失败的原因在于：

它们只广播 URL。

缺乏：

- 身份层
- 语义层
- Runtime 层
- 信任层
- AI 检索能力

因此现实世界仍然是：

# 不可编程的。

---

# 2. 核心设计原则

## 2.1 极简边缘硬件

InfoPoint 节点不是 Web Server。

节点不运行：

- AI
- 数据库
- 富媒体服务
- 大型应用

节点只负责：

- BLE 广播
- LoRa 空间同步
- 近场空间发现

这样可以：

- 降低硬件成本
- 降低功耗
- 提高稳定性
- 简化部署
- 提高规模化能力

---

## 2.2 空间身份去中心化

每一个现实空间都应该拥有：

- DID
- 所有权
- 可验证身份
- 语义元数据
- 可解析 Runtime

空间不再依附于平台账号。

空间本身成为网络原生对象。

---

## 2.3 AI 原生检索

InfoPoint 并不是地图系统。

系统目标不是关键词搜索。

而是：

# Spatial Semantic Retrieval（空间语义检索）

空间上下文能够直接进入 AI 推理链路。

---

## 2.4 本地空间智能

空间图谱主要存在于 App 本地。

而不是中心化云端。

这样可以获得：

- 更低延迟
- 更强隐私
- 离线能力
- 个性化空间记忆
- 更低基础设施成本

---

# 3. 系统架构

InfoPoint 由六层组成。

| 层级  | 职责  |
|---|---|
| BLE Discovery Layer  | 近场发现  |
| LoRa Spatial Sync Layer  | 空间索引同步  |
| DID Identity Layer  | 空间身份  |
| Spatial Resolver Layer  | DID → Runtime 解析  |
| Spatial Runtime Layer  | Blocklet Runtime  |
| AI Semantic Layer  | AI 检索与推理  |

---

# 4. 硬件架构

InfoPoint 硬件采用轻量化设计。

节点并不是服务器。

节点不负责：

- AI 推理
- 内容存储
- 视频处理
- 大规模数据计算

节点只负责：

- BLE 广播
- LoRa 同步
- 空间发现
- 可选 WiFi 配网

---

## 4.1 推荐硬件

推荐开发板：

- Heltec WiFi LoRa 32 V4
- ESP32-C3 + SX1262
- Nordic nRF52 + LoRa 模块

---

## 4.2 必要能力

| 能力  | 是否需要  |
|---|---|
| BLE Advertising  | 必需  |
| LoRa Communication  | 必需  |
| Flash Storage  | 少量即可  |
| WiFi Provisioning  | 可选  |
| GPS  | 可选  |

---

# 5. 空间发现机制

## 5.1 BLE Discovery

BLE 用于：

# Nearby Discovery（近场发现）

BLE 广播包含：

- InfoPoint UUID
- 节点 ID
- 协议版本
- 压缩语义元数据

示例：

```javascript
{
  "v":1,
  "id":"cafe001",
  "t":"cafe"
}

```

App 扫描 BLE 广播后：

即可发现附近空间。

---

## 5.2 二维码入口

InfoPoint 同时支持二维码入口。

二维码用于：

- 用户主动进入
- 兼容现有用户习惯
- 精确空间定位
- 对象级交互

例如餐厅：

| 对象  | 绑定  |
|---|---|
| 餐厅  | 主 Space DID  |
| 桌子  | 子空间二维码  |
| 菜单  | Menu Plugin  |
| 支付  | Commerce Plugin  |

结构：

```javascript
Restaurant DID
↓
Table QR Code
↓
Runtime Context
↓
Order Session

```

这允许实现：

- 桌号点餐
- 多 Session Runtime
- 精细化空间上下文

二维码与 BLE 是互补关系：

| BLE  | QR  |
|---|---|
| 被动发现  | 主动进入  |
| 环境感知  | 精确交互  |
| Nearby Context  | Object Context  |

---

# 6. LoRa 空间同步

LoRa 不用于传输内容。

LoRa 用于：

- Nearby Spatial Index Sync
- 空间索引传播
- 节点感知
- 语义缓存同步

示例同步数据：

```javascript
{
  "did":"did:abt:cafe001",
  "type":"cafe",
  "lat":40.712,
  "lng":-73.99,
  "tags":["quiet","wifi","workspace"]
}

```

这意味着：

用户连接一个节点。

即可获得附近大量空间索引。

---

# 7. DID 空间身份

每个空间拥有一个 DID。

例如：

```javascript
did:abt:cafe001

```

DID 代表：

- 所有权
- 身份
- 信任
- Runtime 路由锚点

InfoPoint 使用 ArcBlock DID 基础设施。

---

## 7.1 DID 解析流程

```javascript
BLE / QR
↓
DID
↓
InfoPoint Resolver
↓
Forge Metadata
↓
Runtime Endpoint
↓
Spatial Runtime

```

---

## 7.2 DID 元数据

示例：

```javascript
{
  "infopoint": {
    "runtime":"https://space.infopoint.ai/cafe001",
    "resolver":"https://resolver.infopoint.ai",
    "spaceType":"cafe",
    "services":[
      "menu",
      "booking",
      "event",
      "ai-guide"
    ]
  }
}

```

---

## 7.3 Resolver 设计

区块链负责：

- 身份
- 所有权
- 可信性

Resolver 负责：

- Runtime 路由
- Cache
- Geo Routing
- Runtime Migration

这种解耦：

允许 Runtime 独立升级与迁移。

---

# 8. Spatial Runtime

InfoPoint Runtime 基于 Blocklet 构建。

每一个现实空间：

都是：

# 一个可编程 Runtime。

---

## 8.1 Runtime 能力

核心能力：

- Profile
- Event
- Booking
- Commerce
- Messaging
- Realtime State
- Analytics
- AI Interaction

---

## 8.2 插件系统

InfoPoint 采用插件架构。

而不是固定行业模板。

例如：

| 行业  | Plugin  |
|---|---|
| 餐厅  | Menu  |
| 酒店  | Room  |
| 展会  | Booth  |
| 景区  | Guide  |
| 零售  | Coupon  |
| 摄影师  | Booking  |
| Livehouse  | Event  |

同一 Runtime 核心：

支持多行业扩展。

---

# 9. AI 原生空间检索

空间图谱主要存在于 App 本地。

App 会逐渐积累：

- Nearby Spatial Graph
- Semantic Embedding
- 用户偏好图谱
- 实时空间状态
- 空间记忆缓存

系统参考了 Spatial-RAG 相关研究。

---

## 9.1 检索流程

```javascript
用户问题
↓
语义解析
↓
空间过滤
↓
本地空间图谱
↓
语义排序
↓
AI 响应

```

---

## 9.2 示例

用户问：

```javascript
附近适合办公的安静咖啡厅

```

系统联合计算：

- 距离
- 人流
- WiFi
- 语义标签
- 当前噪音
- 用户历史偏好

最终生成：

# 实时语义空间推荐

而不是静态地图结果。

---

# 10. 本地空间智能

InfoPoint 强调：

# Local Spatial Intelligence

而不是 Cloud-only Search。

优势：

- 更低延迟
- 更高隐私
- 离线能力
- 个性化空间上下文
- 更低云成本

App 将逐渐成为：

# 本地 AI 空间检索引擎。

---

# 11. 安全与信任

InfoPoint 使用 DID 作为可信身份层。

系统解耦：

| 层  | 职责  |
|---|---|
| DID  | 所有权  |
| Resolver  | 路由  |
| Runtime  | 服务  |
| AI Layer  | 检索  |

这种结构降低了：

- 系统耦合
- 单点依赖
- Runtime 迁移成本

---

# 12. 商业模式

InfoPoint 是基础设施。

而不是单一应用。

潜在商业层包括：

- 硬件销售
- Hosted Runtime
- Plugin Marketplace
- 企业分析服务
- AI 服务
- Spatial Search API
- DID 注册服务

长期价值在于：

- 实时空间语义数据
- AI 检索基础设施
- 城市空间智能网络

---

# 13. 对比

| 系统  | Nearby Discovery  | Identity  | Semantic Layer  | AI Retrieval  |
|---|---|---|---|---|
| QR Code  | 手动  | 无  | 无  | 无  |
| BLE Beacon  | 部分  | 弱  | 弱  | 无  |
| Google Maps  | Cloud-only  | 中心化  | 部分  | 有限  |
| InfoPoint  | 原生  | DID  | 原生  | 原生  |

---

# 14. 结论

InfoPoint 提出了一套：

# AI 原生空间发现与语义检索基础设施。

系统融合：

- BLE Discovery
- QR Entry
- LoRa Sync
- DID Identity
- Blocklet Runtime
- AI-native Retrieval

将现实空间转化为：

# 可编程、可检索、可语义理解的空间节点。

InfoPoint 并不是连接设备。

而是在：

# Semanticize Physical Space（语义化现实空间）。
