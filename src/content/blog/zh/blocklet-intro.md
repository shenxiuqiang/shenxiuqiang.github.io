---
title: 'Blocklet 从入门到实战：理解 ARC 的应用单元与运行模型'
description: '在 ArcBlock 的技术体系中，Blocklet 是一个非常容易被误解的概念。'
pubDate: '2026-09-21'
tags: ['AFS', 'AUP', 'Blocklet']
cover: '/images/posts/bafkreibqs65o2giwkre3shg66lwot7sauwc5m7ogemyszbftnygwcloz2q.webp'
---

在 ArcBlock 的技术体系中，Blocklet 是一个非常容易被误解的概念。

很多人第一次接触 Blocklet，会把它理解成“ArcBlock 版本的 Docker 容器”，或者简单理解成“可以部署到 ArcBlock 的 Web 应用”。这样的理解并不完全错误，但已经不足以解释 ARC 2.0 的 Blocklet。

现在更准确的理解是：

**Blocklet 是 ARC 中用于打包和运行应用或服务的基本单元。**

一个 Blocklet package 保存应用的身份、代码、资源和能力声明；当它被本地运行、部署或绑定运行环境之后，就形成一个具体的 instance。

可以先用一张图理解：

```javascript
源码 / 配置
    ↓
Blocklet Package
    ↓
check / build / inspect
    ↓
┌───────────────┬───────────────┐
│               │               │
▼               ▼               ▼
本地 Instance   Web Surface     AUP / Agent / AFS
│               │               │
▼               ▼               ▼
运行中的应用     Website / UI    数据与能力

```

这也是理解 ARC 的一个关键入口：**Blocklet 不是 AUP、Web Device 或 AFS 的同义词，而是把这些能力组合起来形成应用的 package-and-instance 单元。**

---

# 一、Blocklet 到底是什么？

如果把传统软件开发拆开：

```javascript
代码
配置
依赖
资源
运行环境
数据
服务

```

通常需要很多不同工具把它们组合起来。

Blocklet 的目标之一，就是给 ARC 一个统一的应用封装边界：

```javascript
Blocklet
├── Identity
├── Manifest
├── Application
├── Web / AUP Surface
├── Agent
├── AFS
├── Settings
└── Runtime Requirements

```

因此，一个 Blocklet 可以只是一个非常简单的静态 package，也可以包含完整的 Web 应用、AUP App、Agent、AFS 数据和运行时能力。

例如当前官方 `minimal-app` recipe 就可以同时包含：

```javascript
blocklet.yaml
pages/
.web/
.aup/
agents/
seed/settings/

```

也就是说：

**Blocklet 是容器，但不是只有“容器”这一层含义；它更像 ARC 中一个具有身份、能力和运行契约的应用 package。**

---

# 二、先搞清楚 Package 和 Instance

这是 ARC 2.0 Blocklet 最重要的概念。

可以把它类比成：

```javascript
Package  ≈ npm package / 容器镜像
Instance ≈ 安装并运行后的实例

```

Package 是可以版本化、复制和发布的应用产物，而 Instance 是这个 package 的一次具体运行或部署。

例如：

```javascript
my-app
│
├── blocklet.yaml
├── pages/
├── .web/
└── .aup/

```

这是 Package。

执行：

```javascript
arc blocklet run ./my-app

```

ARC 为它启动一个实际运行环境，并打印访问地址，这时候得到的是一个 Instance。

所以：

```javascript
源码修改
    ↓
Package 改变

端口 / 主机 / 配置 / 运行数据
    ↓
Instance 改变

```

这一区分非常重要。

**不要把“build 成功”理解成“应用已经部署完成”。**

Build 产生的是 Package 产物；真正运行起来，还需要 Instance。

---

# 三、Blocklet 与 AUP、Web Device、AFS 的关系

如果已经阅读过前面的两篇教程，现在可以把 ARC 的几个核心概念放在一起：

```javascript
                     Blocklet
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       AUP          Web Device           AFS
        │                │                │
   Semantic UI       Website          Data / Provider
        │                │                │
        └────────────────┼────────────────┘
                         │
                       ARC
                         │
                     Instance

```

它们解决的是不同问题：

| 技术  | 解决的问题  |
|---|---|
| Blocklet  | 应用如何被打包、声明和运行  |
| AUP  | UI 如何被描述和理解  |
| Web Device  | 网站和 Web 内容如何被渲染  |
| AFS  | 数据、文件和 Provider 如何被寻址和访问  |
| Agent  | 应用中的智能能力如何运行  |
| ARC  | 这些能力如何组成一个运行环境  |

因此：

```javascript
Blocklet ≠ AUP
Blocklet ≠ Web Device
Blocklet ≠ AFS

```

而是：

```javascript
Blocklet
   ↓
组合 AUP + Web + Agent + AFS + Settings
   ↓
形成一个可运行的 ARC 应用

```

官方文档也明确强调，Blocklet 可以同时包含 AUP 页面、Web Device 路由、Agent、Settings 和 AFS mount，但这些是 package 内的不同 surface 和能力。

---

# 四、创建第一个 Blocklet

现在直接动手。

当前 ARC 2.0 推荐使用：

```javascript
arc blocklet create

```

创建 Blocklet。

例如：

```javascript
arc blocklet create ./hello-blocklet \
  --recipe minimal-app \
  --name hello-blocklet

```

`init` 是 `create` 的别名，因此也可以使用：

```javascript
arc blocklet init ./hello-blocklet \
  --recipe minimal-app \
  --name hello-blocklet

```

官方当前提供的 recipe 包括：

```javascript
basic
blank
blog
agent
minimal-app
agent-workspace
support-community

```

可以先查看：

```javascript
arc blocklet recipe list

```

查看某个 recipe：

```javascript
arc blocklet recipe explain minimal-app

```

`basic` 更接近一个最小 package，而 `minimal-app` 则已经包含 Web、AUP、Agent 和 Settings 等典型能力。

---

# 五、一个最小 Blocklet 长什么样？

使用：

```javascript
arc blocklet create ./demo-basic \
  --recipe basic \
  --name demo-basic

```

最小 package 可以非常简单：

```javascript
demo-basic/
└── blocklet.yaml

```

当前 ARC 2.0.0-beta.28 验证的最小 manifest 类似：

```javascript
specVersion: 2
id: demo-basic
name: demo-basic
did: did:blocklet:demo-basic
version: 0.1.0
description: ""

```

这里已经包含了一个 Blocklet 最基本的身份信息：

```javascript
specVersion
id
name
did
version
description

```

这些字段不是普通的项目配置，而是 Blocklet package 的身份边界。

---

# 六、blocklet.yaml 是 Blocklet 的“身份证”

如果说：

```javascript
package.json

```

是 Node.js 项目的重要描述文件，那么：

```javascript
blocklet.yaml

```

就是 Blocklet package 的核心声明文件。

它不仅描述：

```javascript
应用叫什么
版本是多少
是谁创建的

```

还可以进一步声明：

```javascript
scope
mounts
sites
surfaces
instance
cron
replicated
networkRead
index
entrypoint

```

这些字段已经从“项目 metadata”进入到“运行时能力声明”的范围。

因此，不应该把 `blocklet.yaml` 当成一份简单的项目介绍文件。

更准确的理解是：

**blocklet.yaml 是 Package 与 ARC Runtime 之间的能力契约。**

---

# 七、Identity：Blocklet 为什么需要 DID？

Blocklet 的身份信息中有：

```javascript
id: demo-basic
name: demo-basic
did: did:blocklet:demo-basic
version: 0.1.0

```

其中：

```javascript
id

```

是稳定的 package 标识。

```javascript
version

```

用于区分不同版本。

而：

```javascript
did

```

则为 Blocklet 提供了更明确的去中心化身份。

因此可以把 Blocklet 理解为：

```javascript
代码
 +
版本
 +
身份
 +
能力声明
 =
Blocklet Package

```

这也是它与一个普通 GitHub 项目目录的重要区别。

---

# 八、Manifest 不只是 Metadata

Blocklet 的 manifest 中有一类字段特别值得关注：

```javascript
scope:
mounts:
sites:
surfaces:
instance:
cron:
replicated:
networkRead:

```

它们不是“写了以后看起来比较完整”。

它们实际上是在告诉 ARC：

> 这个应用需要什么能力？
> 

例如：

```javascript
mounts:
  - uri: "ash://"
    target: /ash
    required: true

```

表达的是：

```javascript
Blocklet
   ↓
需要某个 AFS Provider
   ↓
挂载到 /ash

```

因此：

**Manifest 是能力声明，而不是愿望清单。**

当前 ARC 解析器真正接受什么字段，应以当前 `BlockletManifest` 和 CLI 检查器为准，而不是依赖旧版文档或历史字段。

---

# 九、Scope：应用运行在哪个范围？

Blocklet 可以声明：

```javascript
scope: app

```

也可以使用：

```javascript
user
root
agent

```

可以先简单理解：

```javascript
app
  ↓
普通应用 package

user
  ↓
与调用者用户作用域相关

root
  ↓
更高范围的 host AFS

agent
  ↓
面向 Agent 的 package

```

默认是：

```javascript
app

```

这也是为什么不能随意写：

```javascript
scope: root

```

Scope 不只是一个标签，它会改变应用能够看到和操作的数据空间。

尤其涉及 AFS 时，必须明确区分：

```javascript
Package
/instance
/user
/root

```

不同路径空间。

---

# 十、AFS：Blocklet 如何访问数据？

这是 Blocklet 和传统 Web 应用非常不同的地方。

传统应用经常直接绑定：

```javascript
MySQL
PostgreSQL
MongoDB
SQLite
S3

```

于是应用代码很容易与具体数据库结构绑定。

ARC 的思路是：

```javascript
Blocklet
    ↓
AFS Path
    ↓
Provider
    ↓
具体存储实现

```

例如：

```javascript
/instance/app/content/posts

```

对应用来说，这是一个 AFS 路径。

底层可以由不同 Provider 实现，而 Blocklet 不需要把公开契约写成：

```javascript
SELECT * FROM posts

```

这就是 AFS 的一个核心价值：

**应用依赖的是路径、操作和能力，而不是某个具体存储引擎。**

---

# 十一、Package 数据和 Instance 数据必须分开

这是开发 Blocklet 时非常容易踩坑的地方。

可以简单理解：

```javascript
Package
│
├── blocklet.yaml
├── pages/
├── .web/
└── seed/
       ↓
    初始数据

Instance
│
└── /instance
       ↓
    实际运行数据

```

`seed/` 是初始化输入。

它不是线上 Instance 数据库的替代品。

例如：

```javascript
seed/settings/

```

可以提供默认设置。

但应用真正运行以后产生的数据，应该进入 Instance 所拥有的数据空间。

官方文档特别强调：如果 package 声明需要 `/instance`，但运行环境没有真正绑定的 instance DID Space，就不能把 seed 文件冒充成活跃的 instance 数据空间；有状态能力应该 fail closed。

---

# 十二、Mount：把能力挂进 Blocklet

如果 Blocklet 需要某个 Provider，可以通过：

```javascript
mounts:
  - uri: "ash://"
    target: /ash
    required: true

```

声明。

可以把它理解成：

```javascript
Provider
    ↓
Mount
    ↓
/ash
    ↓
Blocklet

```

应用代码只需要面对：

```javascript
/ash

```

而不需要关心 Provider 的内部实现。

这实际上让 Blocklet 的数据依赖从：

```javascript
应用
 ↓
具体数据库

```

变成：

```javascript
应用
 ↓
AFS
 ↓
Provider
 ↓
Storage

```

从架构上形成了一层很清晰的解耦。

---

# 十三、一个 Blocklet 可以拥有多个 Surface

这是 ARC 2.0 非常有意思的地方。

一个 Blocklet 不一定只有一个页面。

例如：

```javascript
Blocklet
│
├── /
│    ↓
│  Web Device
│
├── /app
│    ↓
│  AUP
│
├── /api
│    ↓
│  API
│
└── /agent
     ↓
   Agent

```

因此可以把：

```javascript
Surface

```

理解成：

**一个 Blocklet 对外暴露的具体应用界面或能力入口。**

官方文档把 AUP 和 Web Device 明确作为不同的 Web surface：AUP 负责语义 UI，而 Web Device 负责 Web 站点和内容树渲染。它们可以共存在同一个 Blocklet 中。

---

# 十四、AUP 和 Web Device 在 Blocklet 中怎么组合？

例如：

```javascript
my-app/
│
├── .aup/
│   └── app.aup
│
├── pages/
│   └── index/
│       └── layout.aup
│
├── .web/
│   └── components/
│
└── blocklet.yaml

```

可以理解成：

```javascript
Blocklet
      │
      ├── AUP
      │     ↓
      │   应用 UI
      │
      └── Web Device
            ↓
          网站

```

所以一个产品完全可以同时拥有：

```javascript
产品官网
+
用户应用
+
Agent
+
数据服务

```

而不是把这些能力拆成四个完全独立的项目。

这正是 Blocklet 作为 package-and-instance 单元的价值之一。

---

# 十五、Web Route：谁负责 `/`？

如果 Blocklet 同时存在 AUP 和 Web Device，就必须明确：

```javascript
/

```

到底交给谁。

Web Device 通常使用：

```javascript
.route/web

```

例如：

```javascript
site: my-site
path: /
source: .
handler: web

```

那么：

```javascript
/

```

就进入 Web Device。

如果没有 Web route，直接访问 Blocklet URL 时，可能寻找的是 AUP 入口。

所以：

```javascript
.route/web

```

并不是普通 Web 项目的“路由配置文件”。

它是在告诉 ARC：

**这个 URL Surface 应该由 Web Device 处理。**

---

# 十六、创建一个真正的 Minimal App

如果你希望一次看到 Blocklet 的多个能力，可以创建：

```javascript
arc blocklet create ./demo-min \
  --recipe minimal-app \
  --name demo-min

```

然后：

```javascript
cd demo-min

```

你会看到类似：

```javascript
demo-min/
├── blocklet.yaml
├── .aup/
├── pages/
├── .web/
├── agents/
└── seed/

```

可以把它理解成：

```javascript
minimal-app
│
├── Manifest
├── AUP
├── Web
├── Agent
└── Settings

```

这比从一个空目录开始更适合学习 ARC 2.0 的整体应用模型。

---

# 十七、第一件事不是运行，而是 Validate

创建完成以后，不要马上：

```javascript
arc blocklet run .

```

先检查。

第一步：

```javascript
arc dsl validate .

```

它主要验证：

```javascript
AUP / DSL

```

是否可以正确解析。

然后：

```javascript
arc blocklet check . --profile minimal-app

```

它验证：

```javascript
Blocklet package
+
recipe/profile contract

```

例如当前 `minimal-app` profile 会检查 AUP pages、Web sections、Agent 和 settings 等内容。

---

# 十八、check、build、run 到底有什么区别？

这三个命令非常容易混淆。

可以记住：

```javascript
check
  ↓
这个 Package 符合契约吗？

build
  ↓
这个 Package 能生成构建产物吗？

run
  ↓
这个 Package 实际能运行吗？

```

完整流程：

```javascript
arc dsl validate
        ↓
arc blocklet check
        ↓
arc blocklet build
        ↓
arc blocklet run
        ↓
Browser

```

每一步证明的是不同事情。

例如：

```javascript
build 成功

```

并不能证明：

```javascript
浏览器页面正确

```

同样：

```javascript
GET / 返回 HTTP 200

```

也不能证明：

```javascript
Instance 数据写入成功

```

这就是 ARC 2.0 文档现在非常强调的“证据边界”。

---

# 十九、Build 到底生成了什么？

执行：

```javascript
arc blocklet build .

```

默认会产生：

```javascript
dist/

```

并生成：

```javascript
dist/.afs/manifest.json
dist/blocklet.dist.json

```

其中 `.afs/manifest.json` 描述构建后的 AFS 文件树，而 `blocklet.dist.json` 是 flat manifest。

例如：

```javascript
Blocklet
   ↓
arc blocklet build
   ↓
dist/
├── .afs/
│   └── manifest.json
└── blocklet.dist.json

```

因此 `dist/` 是 Package 的构建产物，而不是源码目录。

**不要直接手工修改 dist。**

源码修改以后应该重新执行 build。

---

# 二十、Inspect：看看你到底构建了什么

可以执行：

```javascript
arc blocklet inspect .

```

它可以帮助你看到：

```javascript
Blocklet ID
Version
DID
文件列表
Package 状态

```

例如：

```javascript
Blocklet: demo-basic
version: 0.1.0
did: did:blocklet:demo-basic
files: 1

```

这一步非常适合排查：

> “我以为打进去了，为什么运行时没有？”
> 

先 inspect：

```javascript
Package 里面到底有没有这个文件？

```

再去检查 Runtime。

而不是一上来怀疑浏览器。

---

# 二十一、Dev 和 Check 不一样

还有一个容易混淆的命令：

```javascript
arc blocklet dev .

```

它不是开发服务器。

它主要扫描 Blocklet 目录中的约定，并报告：

```javascript
Content type
Index
Mount
Pages
Agent

```

所以：

```javascript
arc blocklet dev

```

更像：

**“帮我看看这个 Blocklet 的目录结构被识别成了什么。”**

而不是：

```javascript
启动 Web Server

```

真正的本地运行应该使用：

```javascript
arc blocklet run .

```

或者：

```javascript
arc service start --blocklet .

```

---

# 二十二、运行第一个 Blocklet

完成检查后：

```javascript
arc blocklet run .

```

ARC 会打印实际访问地址。

也可以：

```javascript
arc service start \
  --blocklet . \
  --port 4939

```

然后访问：

```javascript
http://<实际输出的地址>/

```

当前官方验证的典型形式是：

```javascript
http://demo-min.localhost:4941/

```

而 Safari 等环境也可以使用：

```javascript
http://localhost:4941/?blocklet=demo-min

```

这一步的真正意义不是“看到一个网页”。

而是：

```javascript
Package
   ↓
ARC Runtime
   ↓
Instance
   ↓
HTTP Surface
   ↓
Browser

```

完整走通了。

---

# 二十三、一个 Blocklet 的完整生命周期

到这里，可以把 Blocklet 生命周期总结成：

```javascript
Create
  ↓
Edit
  ↓
Validate
  ↓
Check
  ↓
Build
  ↓
Inspect
  ↓
Run
  ↓
Browser Acceptance
  ↓
Publish / Deploy

```

但实际开发时，不需要每次修改都重新发布。

最常用的本地循环应该是：

```javascript
编辑
 ↓
validate
 ↓
check
 ↓
run
 ↓
浏览器验收
 ↓
继续修改

```

只有当你真正需要构建产物或进入发布流程时，才进入：

```javascript
build
 ↓
publish / deploy

```

官方当前生命周期文档也明确把“本地验收”和“发布/部署”分成不同阶段。

---

# 二十四、为什么 ARC 特别强调“本地优先”？

以前很多 Blocklet 教程容易让人形成一种印象：

```javascript
写代码
 ↓
部署到服务器
 ↓
才能测试

```

ARC 2.0 的开发路径明显更强调：

```javascript
本地 Package
 ↓
本地 Runtime
 ↓
本地 Instance
 ↓
浏览器

```

例如：

```javascript
arc blocklet create ./my-app \
  --recipe minimal-app \
  --name my-app

arc dsl validate ./my-app

arc blocklet check ./my-app \
  --profile minimal-app

arc blocklet run ./my-app

```

整个过程不需要先发布到远程 DID Space，也不需要先部署到 Cloudflare Pages。

这对于开发者非常重要：

**先证明应用本身正确，再决定把它发布到哪里。**

---

# 二十五、Stateless 和 Stateful

Blocklet 还需要理解一个非常重要的区别：

```javascript
Stateless

```

和：

```javascript
Stateful

```

例如一个只包含：

```javascript
HTML
CSS
JavaScript

```

的简单 Blocklet，可以不需要真实 Instance 数据空间。

而一个需要：

```javascript
用户数据
帖子
评论
设置
状态

```

的应用，则可能依赖：

```javascript
/instance

```

这时：

```javascript
arc blocklet build

```

可能报告：

```javascript
instance: requires /instance DID Space

```

这意味着：

**这个 Package 的某些能力必须依赖真正的 Instance 数据空间。**

因此不能因为：

```javascript
首页 HTTP 200

```

就认为：

```javascript
数据库写入已经正常

```

这是 ARC Blocklet 开发中特别重要的边界。

---

# 二十六、一个完整 Blocklet 可以是什么样？

假设我们要做一个：

**摄影师作品展示 + AI Agent + Web 网站**

那么完全可以设计成：

```javascript
GLOFTER Studio Blocklet
│
├── blocklet.yaml
│
├── .route/
│   └── web
│
├── .web/
│   ├── site.yaml
│   ├── components/
│   └── tokens.json
│
├── pages/
│   ├── index/
│   ├── works/
│   └── about/
│
├── .aup/
│   └── app.aup
│
├── agents/
│   └── photographer/
│
├── seed/
│   └── settings/
│
└── blocklet.yaml

```

于是它同时拥有：

```javascript
Website
+
Application UI
+
AI Agent
+
Settings
+
AFS Data

```

而不是分别部署五个完全独立的系统。

这也是 Blocklet 架构与传统“前端 + 后端 + CMS + AI Service + Database”拆分方式相比，很值得研究的地方。

---

# 二十七、Blocklet 的真正价值：组合能力

如果只把 Blocklet 当成：

```javascript
“部署一个 Web App 的容器”

```

它的价值其实并不突出。

真正值得关注的是它正在形成一个统一的组合边界：

```javascript
                 Blocklet
                    │
      ┌─────────────┼─────────────┐
      │             │             │
    UI            Web           Agent
    AUP        Web Device        AI
      │             │             │
      └─────────────┼─────────────┘
                    │
                   AFS
                    │
                 Data
                    │
                   ARC
                    │
                Instance

```

这意味着开发者不再只是“开发一个网页”。

而是在创建一个：

**具有身份、界面、数据、能力和运行环境的应用单元。**

---

# 二十八、Blocklet 与传统 Web App 最大的区别

传统 Web App 通常是：

```javascript
Frontend
    ↓
API
    ↓
Database

```

部署时再额外解决：

```javascript
Docker
Kubernetes
Cloud
DNS
CDN
Storage

```

而 Blocklet 的方向是：

```javascript
Blocklet Package
       ↓
Manifest
       ↓
ARC Runtime
       ↓
AFS / AUP / Web / Agent
       ↓
Instance

```

它把应用的很多运行契约前移到了 Package。

于是 Runtime 不需要“猜”：

```javascript
这个应用需要什么？

```

而可以从：

```javascript
blocklet.yaml

```

知道：

```javascript
需要什么数据
需要什么 mount
有哪些 surface
需要什么 instance
有哪些能力

```

这也是 Manifest 的真正价值。

---

# 二十九、最容易踩的几个坑

### 1. 把 Blocklet 当成 AUP

AUP 是 UI 语义层。

Blocklet 是应用 package + instance 层。

二者不是竞争关系。

### 2. 把 build 当成 deploy

```javascript
build ≠ deploy

```

Build 只是生成 Package 构建产物。

### 3. 把 run 当成远程部署

```javascript
arc blocklet run .

```

主要解决本地 Instance 和本地 Surface 验收。

### 4. 把 seed 当数据库

```javascript
seed ≠ instance data

```

Seed 是初始化输入。

### 5. 看到 HTTP 200 就认为全部正常

如果应用依赖 `/instance`，必须单独验证实际数据读写。

### 6. 随便添加 Manifest 字段

不要因为历史文档、旧项目或者某个博客出现过字段，就认为当前 ARC 支持。

应该：

```javascript
当前 parser
+
当前 check
+
当前 CLI

```

作为事实依据。

### 7. 把 hidden 当安全机制

例如：

```javascript
hidden: true

```

只影响目录 UI 中的可见性，并不是权限边界。

真正的安全边界仍然需要通过身份、Scope、AFS 和 Runtime Policy 等机制实现。

---

# 三十、推荐的 Blocklet 学习路线

如果第一次学习 Blocklet，不建议一开始就研究所有 Manifest 字段。

按照下面的顺序效率最高：

```javascript
① Package / Instance
        ↓
② blocklet create
        ↓
③ blocklet.yaml
        ↓
④ validate / check
        ↓
⑤ blocklet run
        ↓
⑥ build / inspect
        ↓
⑦ AFS
        ↓
⑧ AUP
        ↓
⑨ Web Device
        ↓
⑩ Agent
        ↓
⑪ Stateful Instance
        ↓
⑫ Publish / Deploy

```

先理解：

**“一个 Blocklet 怎么跑起来？”**

再理解：

**“一个 Blocklet 能拥有什么能力？”**

最后才是：

**“如何构建一个真正的 Agentic Application？”**

---

# 三十一、把三篇教程连起来

如果把前面的三篇教程放在一起，ARC 的架构已经可以形成一张完整的图：

```javascript
                       ARC Runtime
                            │
                        Blocklet
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
         AUP           Web Device           Agent
          │                 │                 │
      Semantic UI        Website              AI
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                           AFS
                            │
                         Data
                            │
                         Instance

```

可以这样记：

> **Blocklet 是应用的载体，AUP 是 UI 的语言，Web Device 是网站的 Renderer，AFS 是数据与资源空间，Agent 是智能能力，ARC 是把它们真正运行起来的 Runtime。**
> 

这比单独学习某一个 CLI 命令重要得多。

---

# 三十二、从“应用”走向“Agentic Application”

传统应用的核心是：

```javascript
用户
 ↓
UI
 ↓
API
 ↓
Database

```

而 ARC 的方向更接近：

```javascript
User / Agent
      ↓
  Blocklet
      ↓
┌─────┼─────┐
AUP   Web   Agent
 │     │      │
 └─────┼──────┘
       ↓
      AFS
       ↓
    Instance
       ↓
      ARC

```

这意味着未来一个应用可能不再只是：

```javascript
一个网站

```

而是：

```javascript
一个有身份的 Package
+
一个或多个 UI Surface
+
一套数据空间
+
一个或多个 Agent
+
一套可声明的运行能力

```

这也是 Blocklet 在 ARC 体系中真正值得关注的地方。

---

# 结语：Blocklet 不是“部署格式”，而是一种应用模型

如果只从过去的经验理解 Blocklet，很容易把它看成：

> “把 Web App 打包起来，然后部署到 ArcBlock。”
> 

但从 ARC 2.0 当前的设计来看，这个理解已经过于简单。

Blocklet 正在成为 ARC 中一个更完整的应用模型：

```javascript
Identity
+
Package
+
Capabilities
+
Surface
+
Data
+
Instance
+
Runtime

```

开发者首先创建一个 Package，然后通过 Manifest 声明它需要什么能力；AUP、Web Device、Agent 和 AFS 可以作为不同能力进入这个 Package；ARC Runtime 再把 Package 放入一个实际 Instance 中运行。

最终形成：

```javascript
Developer
    ↓
Blocklet Package
    ↓
Manifest + AUP + Web + Agent + AFS
    ↓
ARC Runtime
    ↓
Instance
    ↓
User / Agent

```

如果说 **AUP 解决的是“Agent 如何理解 UI”**，**Web Device 解决的是“如何把结构化资源变成 Web”**，那么 **Blocklet 解决的就是“这些能力如何组成一个可以被 ARC 运行、管理和发布的完整应用单元”。**

这三者结合起来，才是理解 ARC 2.0 应用架构的真正入口。
