---
title: 'Node ↔ Hub Sync Protocol (NHSP) 去中心化 Node 网络 + 聚合型 Hub 的标准数据同步协议'
description: 'Version: 1.0'
pubDate: '2026-01-15'
tags: ['GLOFTER', 'Web3']
---

**Version:** 1.0
**Status:** Draft
**Author:** GLofter / Node-Hub Architecture
**Target:** 去中心化 Node 网络 + 聚合型 Hub 的标准数据同步协议

---

## 1. 背景与愿景

在传统平台架构中，所有数据集中在一个中心服务中。
在去中心化应用（DApp）时代，数据开始回归到"个人节点（Node）"：

- 每个人运行自己的 Node
- Node 拥有完整的数据主权
- 应用不再依赖单一中心

但新的问题随之出现：

> 如果每个人的数据都在自己的 Node 中，
> 那么"发现"、"搜索"、"推荐"、"聚合"如何实现？
> 

Hub 的角色由此诞生：

- Hub 不拥有数据
- Hub 只做索引、聚合与分发
- Hub 连接多个 Node
- 一个 Node 也可以被多个 Hub 聚合

NHSP 的目标是定义一种 **Node ↔ Hub 的标准同步协议**，使系统具备：

- 去中心化的数据主权
- Web2 级别的可用性
- Web3 式的可组合性
- 可重建、可扩展、可演化的网络结构

在这个模型中：

- **Node** = 数据主权单元
- **Hub** = 索引与发现层
- **NHSP** = 去中心化世界的"HTTP + RSS + Git"

---

## 2. 协议目标与原则

### 2.1 目标

NHSP 定义了一种标准化的 Node ↔ Hub 数据同步协议，用于解决：

- Node 作为数据主权源头
- Hub 作为多 Node 聚合与索引层
- Node 与 Hub 之间的多对多关系
- Node 数据的新增 / 修改 / 删除
- Hub 对 Node 数据的可靠同步与重建

### 2.2 核心原则

1. **Node 是权威源（Source of Truth）**
2. 
  - Hub 永远不反向修改 Node 数据
  - Node 拥有数据的最终决定权
3. **最终一致性（Eventual Consistency）**
4. 
  - 不追求强一致，允许短暂延迟
  - 系统最终会达到一致状态
5. **可重建（Rebuildable）**
6. 
  - Hub 可以随时从 Node 重新构建完整索引
  - Node 必须保证数据可追溯
7. **幂等（Idempotent）**
8. 
  - 重复同步不会产生副作用
  - 支持断线重连和重试
9. **解耦（Decoupled）**
10. 
  - Node 不需要知道 Hub 的内部结构
  - Hub 不需要知道 Node 的业务逻辑

---

## 3. 数据模型

### 3.1 Record（业务数据）

```javascript
type Record = {
  id: string;              // 记录唯一标识
  data: any;               // 业务数据（任意结构）
  updatedAt: number;        // Unix 时间戳（毫秒）
  deleted?: boolean;       // 逻辑删除标记
};

```

**约束：**

- `updatedAt` 必须单调递增
- 删除使用软删除（`deleted: true`）
- `id` 在 Node 内全局唯一

### 3.2 Event（变更事件）

Node 维护一个 append-only 的事件日志：

```javascript
type NodeEvent = {
  seq: number;                    // 序列号，单调递增
  type: "create" | "update" | "delete";
  recordId: string;               // 关联的记录 ID
  snapshot: Record | null;        // 记录快照（delete 时可为 null）
  ts: number;                     // 事件时间戳
};

```

**约束：**

- `seq` 在 Node 内全局递增
- Event 永不修改、永不回滚
- Event 按 `seq` 顺序存储和传输

### 3.3 NodeSyncState（Hub 同步状态）

Hub 为每个 Node 维护同步状态：

```javascript
type NodeSyncState = {
  nodeId: string;          // Node 标识
  lastSeq: number;         // 最后同步的事件序列号
  lastUpdatedAt: number;   // 最后同步的记录更新时间
};

```

---

## 4. API 规范

Node 必须暴露以下同步接口：

### 4.1 Snapshot API（快照拉取）

**端点：** `GET /sync/snapshot`

**查询参数：**

- `since` (number, 可选): Unix 时间戳（毫秒），默认 0

**响应：**

```javascript
{
  "records": [
    {
      "id": "record_001",
      "data": { /* 业务数据 */ },
      "updatedAt": 1700000000000,
      "deleted": false
    }
  ],
  "maxUpdatedAt": 1700000000000
}

```

**语义：**

- 返回 `updatedAt &gt; since` 的所有 Record
- 包含已删除的记录（`deleted: true`）
- 用于 Hub 初始化或灾难恢复
- 返回的记录按 `updatedAt` 升序排列

### 4.2 Event API（事件流）

**端点：** `GET /sync/events`

**查询参数：**

- `since` (number, 可选): 事件序列号，默认 0
- `limit` (number, 可选): 返回事件数量上限，默认 100

**响应：**

```javascript
{
  "events": [
    {
      "seq": 1,
      "type": "create",
      "recordId": "record_001",
      "snapshot": {
        "id": "record_001",
        "data": { /* 业务数据 */ },
        "updatedAt": 1700000000000
      },
      "ts": 1700000000000
    }
  ],
  "maxSeq": 1024
}

```

**语义：**

- 返回 `seq &gt; since` 的事件
- 按 `seq` 升序排列
- 用于增量同步
- `maxSeq` 表示当前 Node 的最大序列号

---

## 5. Hub 同步流程

### 5.1 初始化流程

当 Hub 首次连接一个 Node 时：

1. 调用 `GET /sync/snapshot?since=0`
2. 批量 upsert 所有 records 到本地数据库
3. 保存 `lastUpdatedAt = maxUpdatedAt`
4. 初始化 `lastSeq = 0`

**伪代码：**

```javascript
async function initializeNode(nodeUrl: string) {
  const response = await fetch(`${nodeUrl}/sync/snapshot?since=0`);
  const { records, maxUpdatedAt } = await response.json();
  
  // 批量导入
  for (const record of records) {
    await db.upsert(record);
  }
  
  // 保存同步状态
  await saveSyncState({
    nodeId: nodeUrl,
    lastSeq: 0,
    lastUpdatedAt: maxUpdatedAt
  });
}

```

### 5.2 增量同步流程（推荐）

Hub 定期（如每分钟）执行增量同步：

1. 获取 Node 的同步状态
2. 调用 `GET /sync/events?since=lastSeq`
3. 按顺序应用每个事件
4. 更新 `lastSeq`

**伪代码：**

```javascript
async function syncNode(nodeUrl: string, state: NodeSyncState) {
  const response = await fetch(
    `${nodeUrl}/sync/events?since=${state.lastSeq}&limit=100`
  );
  const { events, maxSeq } = await response.json();
  
  for (const event of events) {
    await applyEvent(event);
    state.lastSeq = event.seq;
  }
  
  await saveSyncState(state);
}

function applyEvent(event: NodeEvent) {
  switch (event.type) {
    case "create":
    case "update":
      // 幂等 upsert
      return db.upsert(event.snapshot);
    case "delete":
      // 标记删除
      return db.markDeleted(event.recordId);
  }
}

```

**事件应用规则：**

| **type**  | **行为**  |
|---|---|
| `create`  | upsert record  |
| `update`  | upsert record  |
| `delete`  | 标记 `record.deleted = true`  |

所有操作必须幂等。

---

## 6. 示例实现

### 6.1 Node 侧（Express.js）

```javascript
// node.ts
import express from "express";

const app = express();
app.use(express.json());

// 内存存储（实际应使用数据库）
let records: Record<string, Record> = {};
let events: NodeEvent[] = [];
let seq = 0;

// 发出事件
function emit(type: "create" | "update" | "delete", record: Record) {
  events.push({
    seq: ++seq,
    type,
    recordId: record.id,
    snapshot: type === "delete" ? null : record,
    ts: Date.now()
  });
}

// 创建/更新记录
app.post("/record", (req, res) => {
  const record: Record = {
    ...req.body,
    updatedAt: Date.now()
  };
  
  const isNew = !records[record.id];
  records[record.id] = record;
  
  emit(isNew ? "create" : "update", record);
  res.json(record);
});

// 删除记录
app.delete("/record/:id", (req, res) => {
  const record = records[req.params.id];
  if (record) {
    record.deleted = true;
    record.updatedAt = Date.now();
    emit("delete", record);
  }
  res.json({ success: true });
});

// Snapshot API
app.get("/sync/snapshot", (req, res) => {
  const since = Number(req.query.since || 0);
  const list = Object.values(records)
    .filter(r => r.updatedAt > since)
    .sort((a, b) => a.updatedAt - b.updatedAt);
  
  res.json({
    records: list,
    maxUpdatedAt: list.length > 0 
      ? Math.max(...list.map(r => r.updatedAt))
      : since
  });
});

// Event API
app.get("/sync/events", (req, res) => {
  const since = Number(req.query.since || 0);
  const limit = Number(req.query.limit || 100);
  const list = events
    .filter(e => e.seq > since)
    .slice(0, limit);
  
  res.json({
    events: list,
    maxSeq: seq
  });
});

app.listen(3001);

```

### 6.2 Hub 侧（同步 Worker）

```javascript
// hub-sync-worker.ts
import { NodeSyncState } from "./types";

// 同步单个 Node
async function syncNode(nodeUrl: string, state: NodeSyncState) {
  try {
    const response = await fetch(
      `${nodeUrl}/sync/events?since=${state.lastSeq}&limit=100`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const { events, maxSeq } = await response.json();
    
    // 按顺序应用事件
    for (const event of events) {
      await applyEvent(event);
      state.lastSeq = event.seq;
    }
    
    // 保存同步状态
    await saveSyncState(nodeUrl, state);
    
    return { success: true, processed: events.length };
  } catch (error) {
    console.error(`Failed to sync ${nodeUrl}:`, error);
    return { success: false, error };
  }
}

// 应用事件
async function applyEvent(event: NodeEvent) {
  switch (event.type) {
    case "create":
    case "update":
      if (event.snapshot) {
        // 幂等 upsert
        await db.upsert({
          nodeId: event.nodeId,
          recordId: event.recordId,
          ...event.snapshot
        });
      }
      break;
      
    case "delete":
      // 标记删除
      await db.markDeleted(event.recordId);
      break;
  }
}

// 定时同步任务
setInterval(async () => {
  const nodes = await getAllNodes();
  
  for (const node of nodes) {
    const state = await getSyncState(node.id);
    await syncNode(node.url, state);
  }
}, 60000); // 每分钟同步一次

```

---

## 7. 错误恢复与重建

### 7.1 Hub 重建流程

Hub 可随时丢弃本地数据并重新执行：

```javascript
snapshot → replay events → rebuild index

```

**伪代码：**

```javascript
async function rebuildNode(nodeUrl: string) {
  // 1. 获取完整快照
  const snapshot = await fetch(`${nodeUrl}/sync/snapshot?since=0`);
  const { records } = await snapshot.json();
  
  // 2. 清空本地数据
  await db.clearNodeData(nodeUrl);
  
  // 3. 导入快照
  for (const record of records) {
    await db.upsert(record);
  }
  
  // 4. 重放事件（可选，用于确保一致性）
  const state = await getSyncState(nodeUrl);
  await syncNode(nodeUrl, { ...state, lastSeq: 0 });
}

```

### 7.2 Node 数据保留要求

Node 必须保证：

- **Snapshot 永远可用**：即使事件流丢失，也能通过快照恢复
- **Event Log 至少保留一个安全窗口**：建议保留 7-30 天的事件日志
- **数据可追溯**：`updatedAt` 和 `seq` 必须保持单调递增

---

## 8. 扩展能力

协议允许以下扩展：

### 8.1 鉴权

```javascript
GET /sync/events?since=100
Authorization: Bearer <node-token>

```

### 8.2 事件类型过滤

```javascript
GET /sync/events?since=100&types=create,update

```

### 8.3 分类/分片支持

```javascript
GET /sync/events?since=100&category=photo
GET /sync/snapshot?since=0&category=album

```

### 8.4 压缩传输

```javascript
GET /sync/events?since=100
Accept-Encoding: gzip

```

---

## 9. 架构意义

该协议将系统抽象为：

```javascript
[ Node A ] ─┐
[ Node B ] ─┼─▶  NHSP  ─▶  [ Hub X ]
[ Node C ] ─┘                |
                              ├── Search
                              ├── Feed
                              └── Discovery

```

它使：

- **Node 成为"个人数据主权节点"**
- **Hub 成为"去中心化网络的索引器"**
- **整个系统具备：**
- 
  - Web2 的可用性
  - Web3 的主权边界
  - 可组合的 Blocklet / DApp 形态

### 9.1 数据主权在 Node

Node 拥有数据的完整控制权，Hub 只是"镜像"和"索引"。

### 9.2 网络价值在 Hub

Hub 通过聚合多个 Node，提供搜索、推荐、发现等网络价值。

### 9.3 协议粘合一切

NHSP 作为 L0 协议层，使不同 Node 和 Hub 可以无缝协作。

### 9.4 节点可组合

一个 Node 可以同时被多个 Hub 聚合，一个 Hub 可以聚合多个 Node。

### 9.5 网络可生长

新的 Node 和 Hub 可以随时加入网络，无需修改现有节点。

---

## 10. 结语

NHSP 不是一个"同步接口"，而是一个去中心化网络的**最小共识层**：

- 它不规定你存什么
- 只规定你"如何让世界看到你"

每一个 Node 都是一个宇宙，
每一个 Hub 都是一张星图，
而 NHSP，是星际之间的光。

---

## [GLofter：基于 ArcBlock 的去中心化摄影师工作室平台](/posts/d3c9ab8a-7959-42d5-911b-e1c33cef5fb7/)
