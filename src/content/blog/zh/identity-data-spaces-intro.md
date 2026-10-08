---
title: 'Identity & Data Spaces 从入门到实战：理解 ARC 的身份、DID Space 与用户数据'
description: '在传统 Web 应用中，用户登录后通常得到一个 userId，应用再根据这个 ID 查询数据库：'
pubDate: '2026-09-22'
tags: ['AFS', 'DID']
---

在传统 Web 应用中，用户登录后通常得到一个 `userId`，应用再根据这个 ID 查询数据库：

```javascript
User → userId → Database → User Data

```

ARC 的思路有所不同。一次请求首先需要确定**是谁在调用**，Runtime 根据调用者身份建立 Session，再决定这个调用者能够看到哪些数据，最终通过 AFS Provider 访问实际资源：

```javascript
Credential → CallerInfo → Session → AFS View → DID Space → Data

```

这就是 ARC Identity &amp; Data Spaces 最核心的模型。

---

## 一、Data Space 到底是什么？

第一次阅读 ARC 文档时，很容易把 Data Space 理解成一个独立的 SDK 或数据库产品。实际上并不是。

当前 ARC 文档中的 **Data Space 更像一个架构概念**，用于描述“当前调用者的数据上下文和可见视图”。它不是一个需要单独创建、初始化或 `import` 的 `DataSpace` API。

真正参与运行时工作的主要是：

- **CallerInfo**：当前请求是谁发起的；
- **Session**：当前调用者能看到哪些数据视图；
- **DID Space**：按 DID 作用域组织的数据空间；
- **AFS Provider**：真正提供数据访问能力。

因此可以这样记：

```javascript
Data Space  = 数据上下文概念
DID Space   = DID 作用域的数据存储面
Session     = 当前调用者的数据视图
AFS         = 数据与能力访问层

```

---

## 二、ARC 身份与数据空间的整体架构

把整个模型压缩成一张图：

```javascript
Request
  ↓
Credential
  ↓
CallerInfo
  ↓
Session
  ├── /user
  ├── /tmp
  └── /space
        ↓
      AFS
        ↓
   DID Space / Provider
        ↓
       Data

```

其中：

| 层  | 作用  |
|---|---|
| Credential  | 证明请求者身份  |
| CallerInfo  | Runtime 解析出的当前调用者  |
| DID  | 标识调用者  |
| Roles  | 描述调用者角色  |
| Session  | 建立当前数据访问视图  |
| `/user`  | 当前应用中的用户持久数据  |
| `/tmp`  | 当前 Session 的临时数据  |
| `/space`  | 当前调用者的 DID Space 视图  |
| DID Space  | DID 作用域的数据空间  |
| AFS Provider  | 提供实际的数据操作能力  |

---

## 三、CallerInfo：Runtime 眼中的“当前用户”

用户不会直接在请求中告诉服务器：

```javascript
{
  "did": "z..."
}

```

然后让服务器相信这个 DID。

正确的流程是：

```javascript
Browser / Agent
      ↓ Credential
ARC Runtime
      ↓
CallerInfo

```

`CallerInfo` 可以包含：

```javascript
did
roles
authMethod
instanceDid
displayName
authSource

```

其中最重要的是 `did`、`roles` 和 `instanceDid`。

例如一个请求携带登录 Cookie 或 Bearer Token：

```javascript
Authorization: Bearer <JWT>

```

Runtime 验证凭据后，才生成可信的：

```javascript
CallerInfo.did
CallerInfo.roles

```

因此客户端传入的 `did` 不能成为真正的安全依据。

不要设计成：

```javascript
POST /api/profile
{
  "did": "用户自己填写的 DID"
}

```

而应该让 Runtime 根据可信 Credential 得到：

```javascript
Credential
   ↓
CallerInfo.did
   ↓
/user

```

这也是 ARC 身份模型与简单 `userId` 模型的重要区别。

---

## 四、DID 在这里有什么作用？

DID 在 Identity &amp; Data Spaces 中主要承担两个角色：

**第一，表示是谁。**

```javascript
DID A → User A
DID B → User B

```

**第二，划分数据作用域。**

```javascript
DID A → DID Space A
DID B → DID Space B

```

因此可以理解成：

```javascript
DID
 ↓
DID-scoped storage

```

一个应用可以根据当前调用者的 DID 自动获得对应的数据上下文，而不需要在每个 API 中自己拼接：

```javascript
/users/{userId}/...

```

---

## 五、DID Space：真正的数据存储面

如果说 Data Space 是概念，那么 **DID Space 是实际参与数据访问的 AFS Provider / 存储面**。

可以简单理解为：

```javascript
DID Space
├── profile
├── documents
├── photos
├── settings
└── application data

```

不同 DID 对应不同的数据作用域：

```javascript
did:alice
   ↓
Alice's DID Space

did:bob
   ↓
Bob's DID Space

```

但要注意：

> DID Space 并不是“挂载以后什么都能做”的万能数据库。
> 

最终能够执行什么操作，还取决于 Provider 和它的 Capability。

例如一个 Provider 可能支持：

```javascript
list
read
stat
search

```

却不支持：

```javascript
write
delete
exec

```

所以：

```javascript
Mounted ≠ Everything Allowed

```

真正的访问能力仍然是：

```javascript
DID Space
  ↓
Provider
  ↓
Capabilities
  ↓
Actual Operations

```

---

## 六、Session：身份如何变成数据视图

CallerInfo 解决：

> 谁在调用？
> 

Session 进一步解决：

> 这个调用者现在能看到什么？
> 

ARC Runtime 会根据调用者上下文建立 Session View，其中最重要的几个逻辑路径是：

```javascript
/user
/tmp
/space

```

它们的含义完全不同。

### `/user`：当前用户的数据

`/user` 可以理解成当前认证用户在应用中的持久数据空间。

例如 Todo 应用：

```javascript
/user
└── todos
    ├── 001.json
    ├── 002.json
    └── 003.json

```

Alice 登录时：

```javascript
Alice → /user → Alice's data

```

Bob 登录时：

```javascript
Bob → /user → Bob's data

```

应用代码仍然访问：

```javascript
/user/todos

```

但 Runtime 根据当前 Caller 提供不同的数据视图。

### `/tmp`：Session 临时数据

`/tmp` 用于当前 Session 的临时数据，例如：

- Agent 中间文件
- 上传处理过程
- 临时缓存
- 临时计算结果

因此：

```javascript
/user → 用户持久数据
/tmp  → Session 临时数据

```

### `/space`：DID Space 视图

`/space` 更接近当前调用者整个 DID Space 的视图。

例如：

```javascript
/space
├── documents
├── photos
├── app-a
└── app-b

```

但需要特别注意：

**`/space`** **并不意味着整个 DID Space 默认可任意读写。**

它属于可选的数据视图，并且受到当前 Scope、Provider Capability 以及写入保护机制的限制。

所以不要把：

```javascript
/space

```

理解成：

```javascript
“整个用户数据空间已经完全开放给应用。”

```

---

## 七、三个路径一张表看懂

| 路径  | 生命周期  | 典型用途  |
|---|---|---|
| `/user`  | 用户级  | 当前应用的用户数据  |
| `/tmp`  | Session 级  | 临时文件、Agent 中间数据  |
| `/space`  | DID 级  | 当前用户的 DID Space 视图  |

最简单的记忆方式：

```javascript
/user   → 我的应用数据
/tmp    → 这次 Session 的临时数据
/space  → 我的 DID Space

```

---

## 八、角色与权限

CallerInfo 中还可能包含角色，例如：

```javascript
guest → member → admin → owner

```

这些角色帮助 Runtime 理解当前调用者属于什么身份等级。

但千万不要把：

```javascript
owner

```

理解成：

```javascript
拥有所有 AFS 权限

```

一次操作最终能否成功，至少还涉及：

```javascript
Credential
   ↓
Caller
   ↓
Role / Membership
   ↓
Path Policy
   ↓
Provider Capability
   ↓
Operation

```

因此：

> **身份正确，不等于路径开放；路径开放，也不等于 Provider 支持该操作。**
> 

这也是 ARC 安全模型中非常重要的一点。

---

## 九、DID Connect 与 CallerInfo

DID Connect 可以理解成 ARC 的身份接入机制之一，但它并不等于整个 Runtime 身份模型。

整体关系是：

```javascript
DID Connect
     ↓
Credential / Identity
     ↓
ARC Runtime
     ↓
CallerInfo
     ↓
Session
     ↓
AFS

```

因此：

- **DID Connect**：解决身份接入；
- **CallerInfo**：表示 Runtime 解析出的当前调用者；
- **Session**：把调用者身份转换成数据访问视图；
- **AFS**：执行最终的数据操作。

另外不要把 `arc did` 与用户登录混为一谈。

`arc did` 更多用于 Blocklet、Provider、Entity 等实体身份工作流，而运行时用户身份主要通过 Credential → CallerInfo → Session 这条链路处理。

---

## 十、Identity &amp; Data Spaces 与 Agent Access

这一部分与上一章的 Agent Access 可以直接连接起来。

一个 AI Agent 通过 MCP 访问 Blocklet：

```javascript
AI Agent
   ↓
MCP
   ↓
Agent Access
   ↓
Credential
   ↓
CallerInfo
   ↓
Session
   ↓
/user
   ↓
AFS
   ↓
DID Space

```

例如用户授权 Agent 管理自己的 Todo，Agent 调用：

```javascript
afs_list("/user/todos")

```

它看到的是**当前调用者自己的 Todo**，而不是整个应用所有用户的 Todo。

如果 Agent 要写入：

```javascript
afs_write("/user/todos/012")

```

还需要同时满足：

```javascript
Credential
+
Path Policy
+
Provider Capability

```

所以：

> **OAuth Token 是身份凭据，不是万能钥匙。**
> 

这也是为什么 Agent Access 和 Identity &amp; Data Spaces 必须结合起来理解。

---

## 十一、Web、AUP、Agent 可以共享同一份数据

ARC 的一个重要特点，是不同访问方式可以建立在同一套 AFS 数据之上。

例如：

```javascript
                    /user/profile
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
         Web Device      AUP         Agent
             │            │            │
             ↓            ↓            ↓
           Web UI        UI        MCP / Tools

```

用户通过 Web 修改资料：

```javascript
Web → AFS

```

AUP 应用修改：

```javascript
AUP → AFS

```

Agent 修改：

```javascript
MCP → AFS

```

最终操作的是同一套数据模型。

因此 ARC 并不是为 Web、AUP 和 Agent 分别建立三套数据库，而是让不同访问面共享统一的数据和身份上下文。

---

## 十二、一个 Todo Blocklet 的完整例子

假设我们开发一个 Todo Blocklet。

数据属于用户，因此可以设计成：

```javascript
DID Space
└── user data
    └── todos
        ├── 001
        ├── 002
        └── 003

```

用户登录后：

```javascript
Credential
    ↓
CallerInfo
    ↓
Session
    ↓
/user/todos

```

Alice 看到 Alice 的 Todo，Bob 看到 Bob 的 Todo，而应用代码访问的仍然是：

```javascript
/user/todos

```

如果加入 Agent：

```javascript
User
 ↓
AI Agent
 ↓ MCP
Todo Blocklet
 ↓
CallerInfo
 ↓
Session
 ↓
/user/todos

```

于是 Agent 可以执行：

> “列出我今天创建的 Todo。”
> 

最终访问的仍然是当前调用者自己的：

```javascript
/user/todos

```

而不是通过客户端传递一个 `userId` 再自己查询数据库。

---

## 十三、`arc space`：查看本地 DID Space

ARC CLI 提供：

```javascript
arc space

```

用于查看和管理本地 DID Space 数据。

常用命令包括：

```javascript
arc space list
arc space tree
arc space path
arc space rm
arc space sync

```

对于 folder-backed space，还包括：

```javascript
arc space init
arc space check
arc space repair
arc space set
arc space migrate

```

例如：

```javascript
arc space list \
  --root-path /tmp/arc-space-test \
  --user-did z1fixtureIdentityDocs000000000000001

```

开发时建议使用独立的 `--root-path` 做实验，不要直接拿真实的 `~/.afs/spaces` 做破坏性测试。

需要注意：

```javascript
arc space
   ↓
本地 DID Space 检查 / 管理

Session
   ↓
Runtime 当前请求的数据视图

```

二者不是同一个概念。

---

## 十四、开发 ARC Blocklet 时应该怎么设计？

如果现在开始开发一个新的 ARC Blocklet，可以按下面的顺序思考。

### 1. 先确定身份

这个功能需要知道“谁”吗？

如果需要，使用 Runtime 提供的 Caller 上下文，而不是相信客户端提交的 DID。

### 2. 再确定数据归属

数据属于：

```javascript
当前用户 → /user
当前 Session → /tmp
整个 DID Space 视图 → /space

```

### 3. 检查 Provider Capability

不要只确认路径存在，还要确认 Provider 是否支持：

```javascript
read
write
delete
list
search
exec

```

### 4. 再设计 Agent 权限

明确：

```javascript
Agent 可以读取什么？
Agent 可以搜索什么？
Agent 可以修改什么？
哪些操作必须经过用户授权？

```

### 5. 最后设计 Web / AUP

把 UI 建立在已经确定的身份、数据和权限模型之上：

```javascript
Identity
   ↓
Data
   ↓
Policy
   ↓
UI / Agent

```

而不是先做 UI，最后才考虑权限。

---

## 十五、最容易犯的几个错误

理解 ARC Identity &amp; Data Spaces 时，下面这些假设都应该避免。

**错误一：Data Space 是一个独立 SDK。**

目前它主要是架构概念，不应该寻找一个独立的 `DataSpace` API。

**错误二：有 DID 就拥有数据。**

DID 只是身份标识，真正的数据访问还要经过 Session、Path Policy 和 Provider Capability。

**错误三：有 Token 就拥有全部权限。**

Credential 解决身份认证，不自动授予所有 AFS 操作权限。

**错误四：****`/space`** **就是整个 DID Space 的完全读写权限。**

`/space` 是数据视图，实际操作仍受 Scope、Provider 和写入保护机制限制。

**错误五：UI 中有** **`$session.did`** **就代表已经完成授权。**

Session 信息可以帮助 UI 理解当前上下文，但真正的安全边界仍然必须由 Runtime 和 Provider 强制执行。

---

## 十六、把 ARC 的身份数据模型串起来

到这里，可以把 Identity &amp; Data Spaces 压缩成一张图：

```javascript
                      User / Agent
                           │
                       Credential
                           ↓
                     ARC Runtime
                           │
                      CallerInfo
                           │
                 ┌─────────┼─────────┐
                 ↓         ↓         ↓
                DID      Roles   Instance DID
                 └─────────┼─────────┘
                           ↓
                        Session
                           │
                 ┌─────────┼─────────┐
                 ↓         ↓         ↓
              /user      /tmp      /space
                 └─────────┼─────────┘
                           ↓
                          AFS
                           ↓
                   DID Space / Provider
                           ↓
                          Data

```

如果再把前面几篇 ARC 教程放进来：

```javascript
Blocklet
   │
   ├── AUP
   ├── Web Device
   ├── Agent Access
   └── Identity & Data Spaces
                │
                ↓
               AFS

```

它们并不是几个互相独立的功能，而是在共同构建 ARC 的 Agent Native Application Runtime。

---

# 十七、总结：记住这五句话

如果整篇文章只需要记住五句话：

**第一，CallerInfo 解决“谁在调用”。**

**第二，Session 解决“当前调用者能看到什么”。**

**第三，DID Space 解决“用户数据如何按 DID 作用域组织”。**

**第四，AFS Provider 决定“这些数据实际支持什么操作”。**

**第五，Data Space 是描述这一整套数据上下文的架构概念，而不是一个独立 API。**

最终模型就是：

```javascript
谁？
 ↓
CallerInfo

看到什么？
 ↓
Session

数据属于谁？
 ↓
DID Space

能做什么？
 ↓
AFS Provider Capability

通过什么访问？
 ↓
Web / AUP / Agent

```

这套模型理解之后，再回头看 ARC 的 Agent Access、AUP、Web Device 和 Blocklet，就会发现它们实际上共享同一条底层逻辑：

> **同一个 Blocklet、同一套身份与数据空间，可以同时服务人类用户、Web 界面和 AI Agent。**
> 

这正是 ARC 从传统应用 Runtime 走向 **Agent Native Application Runtime** 的关键所在。
