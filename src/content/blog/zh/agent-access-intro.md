---
title: 'Agent Access 从入门到实战：让 AI Agent 连接 ARC Blocklet'
description: '如果说 Blocklet 解决的是“应用如何运行”，AFS 解决的是“数据和能力如何组织”，AUP 解决的是“Agent 如何理解和操作界面”，那么 Agent Access 解决的就是最后一个问题：外部 AI Agent 如何真正连接到一个运行中的 Blocklet，并按照它允…'
pubDate: '2026-09-22'
tags: ['AFS', 'AUP', 'Blocklet', 'AI']
---

![ChatGPT Image 2026年9月22日 08_45_37.jpg](/images/posts/bafkreiettmit7betihutaezukz7t47d6kg6mwlycjj4srdlahzdp7trc7u.webp)

如果说 Blocklet 解决的是“应用如何运行”，AFS 解决的是“数据和能力如何组织”，AUP 解决的是“Agent 如何理解和操作界面”，那么 **Agent Access 解决的就是最后一个问题：外部 AI Agent 如何真正连接到一个运行中的 Blocklet，并按照它允许的范围读取和操作数据。**

这也是 ARC 进入 Agent 原生应用时代之后非常重要的一层。

传统 Web 应用主要面对浏览器，API 主要面对程序，而 Agent Access 面对的是一种新的调用者：能够自主发现服务、理解工具、读取数据、调用操作，并根据授权执行任务的 AI Agent。

ARC 的设计并不是简单地给 Blocklet 增加一个 `/mcp` 接口，而是把 **发现、连接、授权、数据访问、内容发布和权限控制** 组合成了一套完整的访问模型。

---

## 一、先理解 Agent Access 到底是什么

在 ARC 中，一个正在运行的 Blocklet，会自动获得一组面向 Agent 的访问入口。

最核心的是：

```javascript
Blocklet Host
│
├── /mcp
│   └── MCP / Streamable HTTP
│
├── /api/afs/rpc
│   └── AFS JSON-RPC
│
├── /llms.txt
│   └── 面向纯文本 Agent 的发现入口
│
└── /.well-known/
    ├── mcp.json
    ├── oauth-protected-resource
    ├── oauth-authorization-server
    └── api-catalog

```

这些入口由 ARC Runtime 提供，而不是每个 Blocklet 自己重新实现。

因此，开发者不需要在 Blocklet 中额外实现一个 MCP Server，才能让 Agent 访问它。

只要 Blocklet 运行在 ARC 上，Runtime 就会提供 Agent Access 的基础协议面。

但这里有一个非常重要的区别：

**Runtime 决定 Agent“可以怎么连接”，Blocklet 决定 Agent“能够看到什么”。**

这句话基本可以作为理解 Agent Access 的核心。

---

# 二、Agent Access 的整体架构

可以把 ARC 中 Agent 与 Blocklet 的关系理解成：

```javascript
                    AI Agent
                       │
          ┌────────────┼────────────┐
          │            │            │
        MCP         AFS RPC      llms.txt
          │            │            │
          └────────────┼────────────┘
                       │
                ARC Runtime
                       │
                ┌──────┴──────┐
                │   Blocklet  │
                └──────┬──────┘
                       │
                Blocklet Manifest
                       │
          ┌────────────┼────────────┐
          │            │            │
        Collections    AFS         Provider
          │            │            │
          └────────────┴────────────┘
                       │
                     Data

```

这里有三个关键层次：

**第一层是协议层。**

Agent 可以通过 MCP、AFS JSON-RPC 或文本发现面进入。

**第二层是 Blocklet 声明层。**

Blocklet 决定哪些内容集合可以被 Agent 看到，以及这些内容通过哪些接口暴露。

**第三层是 AFS 数据层。**

真正的数据访问最终仍然落到 AFS 的 path、provider 和 capability 上。

所以 Agent Access 并没有创造一个新的数据系统。

它更像是：

```javascript
Agent
  ↓
MCP / HTTP
  ↓
Agent Access
  ↓
AFS
  ↓
Provider
  ↓
Data

```

这也是为什么学习 Agent Access 之前，最好已经理解 AFS 和 Blocklet。

---

# 三、一个 Agent 有三种进入 ARC 的方式

ARC 当前提供三种主要访问面。

| Agent 能力  | 访问方式  | 适合场景  |
|---|---|---|
| 支持 MCP  | `/mcp`  | Claude、Codex 等现代 Agent  |
| 能发送 HTTP，但没有 MCP Tool Calling  | `/api/afs/rpc`  | 自己编写的 Agent、脚本、服务  |
| 只能读取文本  | `/llms.txt`  | 简单 Agent、文本抓取器  |

三者不是三套不同的数据。

它们最终访问的是同一个 Blocklet 和同一套 AFS 数据。

因此可以简单理解为：

```javascript
                  Blocklet
                      │
                     AFS
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
        MCP        AFS RPC     llms.txt

```

如果客户端支持 MCP，官方建议优先使用 `/mcp`。

---

# 四、第一种方式：MCP

MCP 是目前 Agent Access 最重要的入口。

一个运行中的 Blocklet：

```javascript
https://example.com

```

它的 MCP 地址就是：

```javascript
https://example.com/mcp

```

MCP 使用 Streamable HTTP。

与传统 MCP Server 最大的区别之一，是这里不需要把 Blocklet 包装成一个本地 stdio MCP Server。

Agent 可以直接访问远程 Blocklet。

例如 Claude Code：

```javascript
claude mcp add --transport http arc https://<host>/mcp

```

然后可以检查：

```javascript
claude mcp list

```

Codex CLI 则可以直接：

```javascript
codex mcp add arc --url https://<host>/mcp

```

再检查：

```javascript
codex mcp list

```

因此整个连接过程可以变成：

```javascript
Claude / Codex
      ↓
https://your-blocklet.com/mcp
      ↓
ARC Runtime
      ↓
Blocklet

```

这也是 ARC 从“本地 Agent 调用工具”走向“远程 Agent 调用应用”的关键一步。

---

# 五、连接 Blocklet 不等于登录 Blocklet

这里是 Agent Access 最容易理解错的地方。

连接一个 Blocklet，本身不需要凭证。

例如直接：

```javascript
curl -s -X POST https://<host>/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

```

就可以执行：

```javascript
tools/list

```

而且不需要：

```javascript
Authorization

```

也不需要先执行：

```javascript
initialize

```

ARC 当前 MCP Endpoint 是无状态的，不要求客户端维护 `mcp-session-id`。

这对于长期运行的 Agent 很重要。

Agent 不需要因为 Runtime 重启而重新建立 MCP Session。

---

# 六、tools/list 能看到什么？

一个最小 Blocklet 至少会暴露一组通用 AFS 工具：

```javascript
afs_read
afs_list
afs_write
afs_delete
afs_search
afs_exec
afs_stat
afs_explain

```

如果 Blocklet 进一步声明了内容集合，还会出现：

```javascript
search_content
list_content
get_content

```

于是 Agent 看到的工具可能变成：

```javascript
AFS Tools
├── afs_read
├── afs_list
├── afs_write
├── afs_delete
├── afs_search
├── afs_exec
├── afs_stat
└── afs_explain

Content Tools
├── search_content
├── list_content
└── get_content

```

这里有一个非常重要的设计：

**Agent 看到哪些工具，并不是由 Token 决定的，而是由 Blocklet 自己决定的。**

Token 解决的是“你是谁、你以什么身份访问”。

Blocklet 声明解决的是“这个应用愿意向网络 Agent 暴露什么”。

---

# 七、AFS Tools：Agent 直接操作 AFS

通用 AFS Tools 可以理解为 Agent 操作 ARC 数据空间的基础工具。

例如：

```javascript
afs_list

```

用于查看路径。

```javascript
afs_read

```

用于读取内容。

```javascript
afs_search

```

用于搜索。

```javascript
afs_stat

```

用于查看路径和 Provider 的能力。

```javascript
afs_explain

```

用于解释一个路径。

而：

```javascript
afs_write
afs_delete
afs_exec

```

属于更敏感的变更或执行能力。

因此 Agent Access 并不是简单地：

> “只要拿到 MCP 就拥有整个 Blocklet。”
> 

实际情况恰恰相反。

ARC 默认采用 **fail-closed** 思路。

没有明确允许的能力，不应该因为 Agent 猜到了接口名称就自动获得权限。

---

# 八、第二种方式：AFS over HTTP

并不是所有 Agent 都拥有 MCP Client。

对于这种情况，ARC 提供：

```javascript
POST /api/afs/rpc

```

例如：

```javascript
curl -s -X POST https://<host>/api/afs/rpc \
  -H 'Content-Type: application/json' \
  -d '{"type":"list","path":"/"}'

```

返回类似：

```javascript
{
  "ok": true,
  "data": [
    {
      "id": "instance",
      "path": "/instance"
    }
  ]
}

```

这里的本质仍然是 AFS。

区别只是：

```javascript
MCP
→ tools/list
→ tools/call
→ afs_read

AFS RPC
→ type: read
→ path: ...

```

也就是说：

```javascript
             同一套 AFS
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
      MCP               JSON-RPC

```

如果自己开发 Agent，或者使用一个没有 MCP SDK 的服务，AFS RPC 会非常有用。

---

# 九、第三种方式：llms.txt

ARC 还提供：

```javascript
https://<host>/llms.txt

```

它不是整个网站的复制品。

它更像一张“Agent 地图”。

例如：

```javascript
# ArcBlock

## For agents

- MCP: https://<host>/mcp
- Server card: https://<host>/.well-known/mcp.json
- AFS over HTTP: https://<host>/api/afs/rpc
- Tools: search_content, list_content, get_content
- Collections: articles, docs, glossary, products

```

Agent 首先读取这一小份文本，就能知道：

```javascript
这里有没有 MCP？
MCP 在哪里？
有没有 AFS RPC？
有哪些内容集合？
应该进一步读取哪个内容分片？

```

ARC 还支持按 collection 拆分的：

```javascript
/llms-<collection>.txt
/llms-<collection>-full.txt

```

以及：

```javascript
/llms-full.txt

```

这种设计的意义在于：

**不要让 Agent 为了寻找一个信息，先把整个网站塞进 Context。**

先发现，再按需读取。

---

# 十、Discovery：Agent 怎么发现一个 Blocklet？

如果 Agent 只知道：

```javascript
https://example.com

```

它还可以访问：

```javascript
https://example.com/.well-known/mcp.json

```

这个文件可以理解成 Blocklet 的 MCP Server Card。

例如：

```javascript
{
  "name": "arc",
  "url": "https://<host>/mcp",
  "transport": "streamable-http",
  "authentication": {
    "required": false,
    "schemes": ["bearer"]
  }
}

```

另外还有：

```javascript
/.well-known/oauth-protected-resource
/.well-known/oauth-authorization-server
/.well-known/api-catalog

```

它们分别帮助 Agent 理解：

```javascript
MCP 在哪里？
谁负责授权？
OAuth 支持什么方式？
这个 Host 上有哪些 API 服务？

```

所以 ARC 的 Agent Discovery 可以理解成：

```javascript
Agent
  │
  │  已知 Host
  ↓
/.well-known/mcp.json
  │
  ├── MCP Endpoint
  ├── Authentication
  └── Tool information
       │
       ↓
     /mcp

```

这比要求用户手工配置大量 API 信息更加适合 Agent。

---

# 十一、真正重要的问题：Agent 到底能访问什么？

这时候就进入 Agent Access 最核心的部分。

ARC 把一次请求是否成功拆成四道独立的“闸门”。

```javascript
请求
 ↓
① 方法白名单
 ↓
② Credential
 ↓
③ Blocklet 路径策略
 ↓
④ Provider Capability
 ↓
成功

```

这四道闸由不同层决定。

因此：

**拥有 Token ≠ 拥有所有权限。**

---

# 十二、第一道闸：Method Allowlist

首先 Runtime 会判断：

> 这个 MCP 方法是否允许匿名调用？
> 

例如：

```javascript
tools/list

```

属于公开发现能力。

而：

```javascript
afs_write
afs_delete
afs_exec

```

属于敏感操作。

匿名调用这些操作时，通常不会进入真正的 Tool，而是直接返回：

```javascript
401 Unauthorized

```

同时：

```javascript
WWW-Authenticate:
Bearer resource_metadata="https://<host>/.well-known/oauth-protected-resource"

```

这个 `401` 并不只是一个错误。

它实际上是在告诉 Agent：

> 这个操作需要授权，授权信息在这里。
> 

于是 `401` 本身就成为 OAuth Discovery 的入口。

---

# 十三、第二道闸：Credential

接下来才是身份认证。

ARC 当前支持的 Agent 授权模型基于 OAuth。

典型流程：

```javascript
Agent
  ↓
调用受保护 Tool
  ↓
401
  ↓
protected-resource metadata
  ↓
authorization-server metadata
  ↓
Dynamic Client Registration
  ↓
User Authorization
  ↓
Access Token
  ↓
再次调用 MCP

```

Authorization Server 元数据中包括：

```javascript
authorization_endpoint
token_endpoint
device_authorization_endpoint
registration_endpoint

```

并支持：

```javascript
authorization_code
refresh_token
device_code

```

同时支持：

```javascript
PKCE S256

```

Token Endpoint 不要求 client secret，而是使用 PKCE 等机制完成客户端授权。

---

# 十四、为什么 ARC 要使用这种方式？

传统 API 经常要求：

```javascript
API Key
↓
复制
↓
粘贴
↓
配置环境变量
↓
开始调用

```

对于 AI Agent 来说，这种模式并不理想。

ARC 希望 Agent 可以自己完成：

```javascript
发现
 ↓
连接
 ↓
发现需要授权
 ↓
打开授权页面
 ↓
用户确认
 ↓
获得 Credential
 ↓
继续调用

```

所以一个支持 OAuth 的 MCP Client，可以把授权流程隐藏在连接体验中。

例如 Codex：

```javascript
codex mcp add arc --url https://<host>/mcp

```

客户端可以启动授权流程，用户在浏览器中确认之后，继续使用。

Claude Code 则可以：

```javascript
claude mcp add --transport http arc https://<host>/mcp

```

然后：

```javascript
claude mcp login arc

```

完成授权。

---

# 十五、第三道闸：Blocklet 自己的路径策略

这是理解 ARC Agent Access 最关键的一层。

假设 Agent 已经拿到了：

```javascript
owner

```

级别的 Credential。

很多人会自然认为：

> owner 什么都能做。
> 

ARC 并不是这么设计的。

例如：

```javascript
afs_write /instance/notes.txt

```

即使使用 owner Credential，也可能得到：

```javascript
AFS_FORBIDDEN

```

原因不是 Token 错了。

而是：

**Blocklet 没有声明这条路径允许网络 Agent 写入。**

所以：

```javascript
Credential

```

和：

```javascript
Path Policy

```

是两个完全不同的问题。

---

# 十六、第四道闸：Provider Capability

最后还有 Provider 本身。

例如某个路径：

```javascript
/packages

```

它背后的 Provider 可能声明：

```javascript
{
  "capabilities": [
    "list",
    "read",
    "stat",
    "search"
  ]
}

```

那么即使：

```javascript
Agent 有 Credential
Blocklet 允许访问

```

也不代表：

```javascript
write

```

一定存在。

因此一次操作最终能否成功：

```javascript
Method
  ×
Credential
  ×
Path Policy
  ×
Provider Capability

```

四者都满足才行。

---

# 十七、最容易混淆的两个概念

可以把它浓缩成：

```javascript
“你是谁？”
        ↓
Credential

“你能访问哪条路径？”
        ↓
Blocklet Policy

“这条路径支持什么操作？”
        ↓
Provider Capability

```

这三个问题必须分开。

所以如果 Agent：

```javascript
401

```

首先检查认证。

如果：

```javascript
200 + isError + AFS_FORBIDDEN

```

就不要继续折腾 Token。

这意味着请求已经到达 Tool，真正的问题是：

```javascript
Blocklet 没有向网络 Agent 开放这条路径。

```

如果：

```javascript
200 + isError

```

并且 `afs_stat` 显示 Provider 不支持某项能力，那么问题就在 Provider。

---

# 十八、Blocklet 如何告诉 Agent “我有什么内容”？

这就是前面 Blocklet 教程中的：

```javascript
collections:

```

例如：

```javascript
collections:
  docs:
    scope: /packages
    indexable:
      - "content/docs/**/content.md"
      - "content/docs/**/content.zh.md"

    readRole: guest

    defaultLocale: en

    fields:
      nav-group: $.nav-group

    summary:
      - $.name
      - $.summary

    faces:
      web: true
      sitemap: true
      llms: true
      mcp: [search, list, get]

```

这段声明非常重要。

它不是单纯告诉网站：

> “这里有一些 Markdown。”
> 

而是在告诉 ARC：

> “这是一个叫 docs 的内容集合，它位于某个 AFS scope 下，它包含哪些文件，并且应该通过哪些 Agent / Web / Sitemap 面暴露。”
> 

于是同一份内容可以形成：

```javascript
                 Collection
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
      Web           MCP          llms.txt
       │             │             │
     页面        content tools     文本

```

这就是 ARC 很重要的一个思想：

**数据只有一份，面可以有多个。**

---

# 十九、为什么需要 Collection？

假设 GLOFTER Studio 有：

```javascript
articles
photos
tutorials
products
events
private-notes

```

并不是所有东西都应该交给 Agent。

例如：

```javascript
articles
tutorials
products

```

可以开放。

而：

```javascript
private-notes

```

可能完全不应该出现在 Agent 面。

因此可以做：

```javascript
GLOFTER Studio

Public
├── articles       → Web + MCP + llms
├── tutorials      → Web + MCP + llms
└── products       → Web + MCP

Private
└── private-notes  → Web only

```

这比给整个网站简单地增加一个：

```javascript
/mcp

```

要细致得多。

Agent Access 的核心不是：

> “把网站变成 MCP。”
> 

而是：

> **让 Blocklet 有能力声明哪些数据和能力值得被 Agent 使用。**
> 

---

# 二十、Agent Access 与 AUP、Web Device、AFS、Blocklet 的关系

到这里，可以把前面几个 ARC 核心概念串起来。

```javascript
                    ARC
                     │
       ┌─────────────┼─────────────┐
       │             │             │
     Blocklet        AFS           AUP
       │             │             │
       │          Data/能力       UI/交互
       │             │             │
       └─────────────┼─────────────┘
                     │
                Agent Access
                     │
              ┌──────┼──────┐
              ↓      ↓      ↓
             MCP   AFS RPC  llms
              │
              ↓
             Agent

```

可以用一句话区分：

| 技术  | 主要解决的问题  |
|---|---|
| Blocklet  | 应用如何被组织和运行  |
| AFS  | 数据、资源和能力如何组织  |
| AUP  | Agent 如何理解 UI 和交互  |
| Web Device  | Web 内容和页面如何被访问  |
| Agent Access  | 外部 Agent 如何连接 Blocklet  |
| MCP  | Agent 与工具之间如何通信  |

因此 Agent Access 不是替代 MCP。

更准确地说：

**MCP 是 Agent Access 的一个协议入口，而 Agent Access 是 ARC 面向外部 Agent 的完整访问体系。**

---

# 二十一、实际动手：检查一个 Blocklet

假设你有：

```javascript
https://example.com

```

第一步，不要马上接 Claude。

先检查：

```javascript
curl -s https://example.com/.well-known/mcp.json

```

确认里面的：

```javascript
url
transport
authentication
tools

```

第二步：

```javascript
curl -s -X POST https://example.com/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

```

确认 Agent 能看到哪些工具。

第三步，如果存在内容集合，再观察：

```javascript
search_content
list_content
get_content

```

是否出现。

第四步，用：

```javascript
curl -s https://example.com/llms.txt

```

检查文本 Agent 能看到哪些内容。

第五步，如果需要写入，再测试受保护 Tool。

这时候出现：

```javascript
401

```

是正常现象。

不要把 `401` 简单理解成：

> “ARC MCP 有问题。”
> 

它可能恰恰说明授权流程正在正常工作。

---

# 二十二、用 Claude Code 连接

最简单：

```javascript
claude mcp add --transport http arc https://<host>/mcp

```

检查：

```javascript
claude mcp list

```

如果只需要公开读取内容，到这里通常就可以开始使用。

如果需要授权：

```javascript
claude mcp login arc

```

浏览器打开授权页面。

用户确认后，Claude Code 获得对应 Blocklet 的 Credential。

之后可以继续调用受保护能力。

退出授权：

```javascript
claude mcp logout arc

```

删除 MCP Server：

```javascript
claude mcp remove arc

```

---

# 二十三、用 Codex CLI 连接

Codex CLI 的方式更加直接：

```javascript
codex mcp add arc --url https://<host>/mcp

```

然后：

```javascript
codex mcp list

```

如果需要重新授权：

```javascript
codex mcp login arc

```

退出：

```javascript
codex mcp logout arc

```

因此一个 ARC Blocklet 可以成为 Codex 的远程工具源：

```javascript
Codex
  │
  │ MCP
  ↓
GLOFTER Studio
  │
  ├── search_content
  ├── get_content
  ├── afs_read
  └── ...

```

这意味着 Agent 不再需要知道 GLOFTER 的内部 API。

它只需要知道：

```javascript
这是一个 MCP Server

```

然后通过工具描述理解它能做什么。

---

# 二十四、如果 Agent 没有浏览器怎么办？

还有一种情况：

```javascript
服务器上的 Agent
CI/CD
无人值守任务
CLI

```

它没有办法打开浏览器。

这时候可以使用：

```javascript
Device Grant

```

基本流程是：

```javascript
Agent
 ↓
device_authorization
 ↓
device_code
user_code
verification_uri
 ↓
用户在另一台设备确认
 ↓
Agent polling token endpoint
 ↓
access_token

```

得到的最终仍然是：

```javascript
Authorization: Bearer blocklet-...

```

需要注意的是，当前文档中 device grant 返回的 access token 没有 `expires_in`，也没有 `refresh_token`。因此不要把它设计成一个自动刷新 Token 的传统 OAuth Session；如果凭证失效，需要重新授权。

---

# 二十五、为什么“登录成功”之后仍然可能不能写？

这是 ARC Agent Access 最值得记住的一句话：

> **Credential 是身份，不是万能钥匙。**
> 

例如：

```javascript
Agent
  ↓
OAuth 登录
  ↓
owner
  ↓
afs_write
  ↓
AFS_FORBIDDEN

```

完全可能发生。

原因是：

```javascript
Credential
      ↓
通过第 2 道闸

Blocklet Path Policy
      ↓
第 3 道闸失败

```

也就是说：

```javascript
身份正确
≠
路径开放

```

如果开发者真的希望 Agent 可以写入，那么应该从 Blocklet 的网络访问声明、resolver overlay 或 Blocklet 内部代码设计数据写入路径，而不是试图通过提升 Token role 来解决。

---

# 二十六、如何排查 Agent Access 问题？

实际开发中，可以按照下面顺序排查。

### 1. Host 是否正确？

```javascript
curl -s https://<host>/.well-known/mcp.json

```

如果这里都访问不了，先不要看权限。

---

### 2. MCP 是否正常？

```javascript
curl -s -X POST https://<host>/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

```

正常应该得到：

```javascript
200

```

---

### 3. Tool 是否存在？

如果：

```javascript
search_content

```

根本没有出现在：

```javascript
tools/list

```

那么问题可能不是权限。

更可能是：

```javascript
Blocklet 没有声明对应 collection

```

---

### 4. 返回 401？

检查：

```javascript
WWW-Authenticate

```

跟随：

```javascript
/.well-known/oauth-protected-resource

```

继续授权流程。

---

### 5. 返回 200 + isError？

检查：

```javascript
AFS_FORBIDDEN

```

如果是：

```javascript
AFS_FORBIDDEN

```

说明已经进入 Tool。

此时继续修改 Token 通常没有意义。

---

### 6. Provider 是否支持？

执行：

```javascript
afs_stat

```

检查：

```javascript
{
  "capabilities": [
    "list",
    "read",
    "stat",
    "search"
  ]
}

```

如果没有：

```javascript
write

```

那么这个 Provider 本身就没有提供写能力。

---

# 二十七、ARC Agent Access 的真正价值

如果把传统 Web 应用和 Agent 原生应用放在一起看，会发现一个很明显的变化。

传统应用：

```javascript
Browser
   ↓
HTML
   ↓
JavaScript
   ↓
API
   ↓
Database

```

Agent 应用：

```javascript
Agent
   ↓
Discovery
   ↓
MCP
   ↓
Tools
   ↓
AFS
   ↓
Provider
   ↓
Data

```

传统应用首先需要设计：

```javascript
页面
按钮
API

```

Agent 原生应用首先需要设计：

```javascript
Agent 能发现什么？
Agent 能读取什么？
Agent 能搜索什么？
Agent 能修改什么？
Agent 以谁的身份修改？

```

这是一种完全不同的应用设计方式。

---

# 二十八、以 GLOFTER 为例

如果把 GLOFTER Studio 做成一个 ARC Blocklet，那么未来可以让 Agent 直接访问：

```javascript
GLOFTER Studio
│
├── Photographer Profile
├── Portfolio
├── Tutorials
├── Fine Art Prints
├── Locations
└── Articles

```

例如声明：

```javascript
collections:
  portfolio:
    scope: /studio/portfolio
    readRole: guest
    faces:
      web: true
      llms: true
      mcp: [search, list, get]

  tutorials:
    scope: /studio/tutorials
    readRole: guest
    faces:
      web: true
      llms: true
      mcp: [search, list, get]

```

那么一个 Agent 就可以理解：

```javascript
这个摄影师是谁？
有哪些摄影作品？
在哪里拍摄？
有哪些教程？
有哪些作品可以购买？

```

进一步，还可以让 Blocklet 提供经过授权的操作：

```javascript
查询订单
创建订单
预约拍摄
管理作品

```

这时候 GLOFTER 就不再只是一个：

> “摄影网站”。
> 

它开始成为一个：

> **Agent 可以发现、理解和调用的摄影服务节点。**
> 

这也是 Agent Access 与 Blocklet 结合之后最值得关注的地方。

---

# 二十九、从开发者角度重新理解 ARC

经过前面的 AUP、Web Device、Blocklet 和 Agent Access 四篇教程，可以把 ARC 逐渐理解成一个完整的 Agent Native Application Runtime。

它不是简单地：

```javascript
一个服务器

```

而是：

```javascript
                         ARC
                          │
          ┌───────────────┼────────────────┐
          │               │                │
       Blocklet           AFS              AUP
          │               │                │
       应用运行          数据/能力          UI
          │               │                │
          └───────────────┼────────────────┘
                          │
                    Agent Access
                          │
              ┌───────────┼───────────┐
              ↓           ↓           ↓
             MCP        AFS RPC     llms.txt
              │
              ↓
             Agent

```

于是一个 Blocklet 同时可以面对：

```javascript
Human
  ↓
Web Device / AUP

Agent
  ↓
MCP / AFS / llms.txt

Application
  ↓
AFS / API

```

而底层仍然是同一个 Blocklet、同一个 AFS 数据空间和同一套身份与权限边界。

---

# 三十、最后：Agent Access 的学习重点

如果刚开始学习 ARC，不需要一开始就记住所有 OAuth Endpoint。

建议按照下面的顺序理解：

```javascript
① Blocklet
   ↓
② AFS
   ↓
③ Collections
   ↓
④ Agent Access
   ↓
⑤ MCP
   ↓
⑥ Discovery
   ↓
⑦ OAuth / PKCE
   ↓
⑧ Access Tiers
   ↓
⑨ Provider Capability

```

真正需要形成的心智模型只有一句话：

> **Agent Access 不是给 Blocklet 加一个 MCP 接口，而是建立了一套从“发现 Blocklet”到“连接 Blocklet”，再到“认证身份”，最后根据 Blocklet 声明和 AFS Provider 能力执行操作的完整访问模型。**
> 

对于 ARC 开发者来说，这意味着一个新的 Blocklet 从一开始就不应该只考虑：

> “浏览器打开之后长什么样？”
> 

还应该考虑：

> “如果一个 Agent 第一次遇到这个 Blocklet，它能发现什么？能理解什么？能读取什么？经过用户授权以后，又能做什么？”
> 

这正是 Agent Native Application 与传统 Web Application 的一个重要区别。

---

## 总结

把整个 ARC Agent Access 压缩成一张图：

```javascript
                         Agent
                           │
                  发现 Blocklet Host
                           │
                           ↓
                /.well-known/mcp.json
                           │
                           ↓
                    ┌────────────┐
                    │    /mcp    │
                    └─────┬──────┘
                          │
                    tools/list
                          │
              ┌───────────┴───────────┐
              ↓                       ↓
          AFS Tools              Content Tools
              │                       │
              └───────────┬───────────┘
                          ↓
                    是否需要授权？
                     /           \
                   否             是
                   │              │
                   │             401
                   │              ↓
                   │       OAuth / PKCE
                   │              ↓
                   │          Credential
                   │              │
                   └──────┬───────┘
                          ↓
                   Blocklet Path Policy
                          ↓
                  Provider Capability
                          ↓
                    AFS Operation
                          ↓
                         Data

```

理解了这张图，ARC 的 Agent Access 基本就掌握了。

而下一步真正值得研究的，就不是“怎么连接 MCP”这么简单，而是：

**如何设计一个 Blocklet，使它从一开始就成为一个真正适合 Agent 使用的应用。**

这会涉及 **Collections、AFS Provider、Agent Tool Design、身份、授权、AUP，以及 Agent 与 Web 用户共享同一应用状态**。这也是 ARC 从“能运行 Blocklet”进一步走向“Agent Native Application”的关键。
