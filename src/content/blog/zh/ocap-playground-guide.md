---
title: '从零到一：OCAP Playground 完全指南 - 掌握 DID Wallet 开发的声明式配置艺术'
description: '- 声明式配置深度解析'
pubDate: '2025-12-31'
tags: ['Blocklet', 'NFT', 'DID', 'OCAP']
---

> **OCAP Playground** 是 ArcBlock 官方提供的 DID Wallet 和 OCAP SDK 综合演示项目。通过声明式配置模式，开发者可以快速实现各种认证场景，包括用户信息获取、数字签名、可验证凭证（VC）、NFT 资产等。本教程将带你从零开始，深入理解这个强大的开发模式。
> 

## 📚 目录

- 项目概览
- 快速开始
- 核心概念
- 声明式配置深度解析
- 实际示例详解
- 高级特性
- 最佳实践
- 常见问题解答
- 总结与下一步

---

## 项目概览

### 什么是 OCAP Playground？

OCAP Playground 是一个功能丰富的演示项目，展示了如何使用 ArcBlock 的 OCAP（Open Chain Access Protocol）和 DID Wallet V2 构建去中心化应用。它包含了 60+ 个实际场景示例，涵盖了：

- **用户认证**：Profile、签名、DID 创建
- **可验证凭证（VC）**：发行、验证、过滤
- **NFT 资产**：铸造、转移、交换
- **高级功能**：质押、委托、多链交互

### 项目信息

- **GitHub 地址**：[https://github.com/blocklet/ocap-playground](https://github.com/blocklet/ocap-playground)
- **在线演示**：[https://playground.staging.arcblock.io/](https://playground.staging.arcblock.io/)
- **技术栈**：
- 
  - 前端：React 19 + Vite + Material-UI
  - 后端：Express.js + Node.js
  - 区块链：OCAP SDK + DID Wallet V2
  - 框架：Blocklet

### 项目结构

```javascript
ocap-playground/
├── api/                    # 后端 API
│   ├── routes/            # 路由定义
│   │   └── auth/         # 认证处理器（60+ 个示例）
│   ├── libs/              # 核心库
│   │   └── auth.js       # 认证核心逻辑
│   └── functions/         # Express 应用配置
│       └── app.js         # 路由注册
├── src/                    # 前端代码
│   ├── pages/             # 页面组件
│   ├── components/        # UI 组件
│   └── libs/              # 前端工具库
└── tools/                 # 工具脚本

```

### 为什么学习这个项目？

1. **官方最佳实践**：ArcBlock 官方维护，代码质量高
2. **场景丰富**：60+ 个实际场景，覆盖大部分开发需求
3. **声明式配置**：优雅的配置模式，代码简洁易维护
4. **完整示例**：前后端完整代码，可直接参考

---

## 快速开始

### 环境准备

在开始之前，确保你的开发环境满足以下要求：

- **Node.js**：&gt;= 20.0.0
- **pnpm**：&gt;= 9.12.0（推荐使用 pnpm）
- **Blocklet CLI**：全局安装

### 安装步骤

#### 1. 安装 Blocklet CLI

```javascript
pnpm i @blocklet/cli -g
```

#### 2. 克隆项目

```javascript
git clone git@github.com:blocklet/ocap-playground.git
cd ocap-playground
```

#### 3. 安装依赖

```javascript
pnpm i
```

#### 4. 配置环境变量

```javascript
cp .env.bac .env
# 编辑 .env 文件，配置必要的环境变量
```

#### 5. 初始化 Blocklet Server

```javascript
blocklet server init -f --mode debug
blocklet server start
```

#### 6. 启动开发服务器

```javascript
blocklet dev
```

项目将在 `http://localhost:3000` 启动（具体端口可能不同，请查看终端输出）。

### 第一个示例体验

启动项目后，访问首页，你会看到各种功能按钮。让我们从最简单的开始：

1. **点击 "Profile" 按钮**
2. **使用 DID Wallet 扫码**
3. **在钱包中确认提供个人信息**
4. **查看后端日志**，你会看到用户信息被成功接收

这就是声明式配置的威力：**只需几行配置，就完成了完整的认证流程**！

---

## 核心概念

在深入代码之前，我们需要理解几个核心概念。

### DID Wallet 认证流程

DID Wallet 认证是一个多步骤的过程：

DID Wallet后端服务前端应用用户DID Wallet后端服务前端应用用户点击认证按钮POST /api/auth/{action}生成认证请求（claims）返回二维码/跳转链接显示二维码扫码/点击链接用户确认提供凭证POST /api/auth/{action} (callback)验证凭证执行 onAuth 回调返回结果显示成功/失败

### 声明式配置模式

传统的命令式编程需要你编写：

- 路由定义
- 请求处理
- 认证逻辑
- 回调处理

而声明式配置只需要你**声明需要什么**，框架会自动处理其余部分。

**对比示例**：

```javascript
// ❌ 传统方式（命令式）
app.post('/api/auth/profile', async (req, res) => {
  // 1. 生成认证请求
  const authRequest = generateAuthRequest(...);
  // 2. 生成二维码
  const qrCode = generateQRCode(authRequest);
  // 3. 返回给前端
  res.json({ qrCode });
  // 4. 处理回调
  app.post('/api/auth/profile/callback', async (req, res) => {
    // 5. 验证凭证
    const isValid = await verifyCredentials(req.body);
    // 6. 处理业务逻辑
    await handleAuth(req.body);
  });
});

// ✅ 声明式配置
module.exports = {
  action: 'profile',
  claims: {
    profile: () => ({ fields: ['fullName', 'email'] })
  },
  onAuth: async ({ userDid }) => {
    // 只需关注业务逻辑
  }
};

```

### Claims（声明）系统

**Claims** 是声明式配置的核心。它定义了应用需要用户提供什么类型的凭证：

| **声明类型**  | **用途**  | **示例**  |
|---|---|---|
| `profile`  | 用户基本信息  | 姓名、邮箱、电话  |
| `signature`  | 数字签名  | 签名任意数据或交易  |
| `verifiableCredential`  | 可验证凭证  | VC 证书、护照  |
| `asset`  | NFT 资产  | 证明拥有某个 NFT  |
| `keyPair`  | 密钥对  | 生成加密密钥  |
| `encryptionKey`  | 加密密钥  | 用于数据加密  |

### 认证回调机制

当用户完成认证后，`onAuth` 回调函数会被执行。这是你处理业务逻辑的地方：

```javascript
onAuth: async ({
  req,              // Express 请求对象
  userDid,          // 用户 DID
  userPk,           // 用户公钥
  claims,           // 用户提供的所有声明
  challenge,        // 挑战值（防重放）
  extraParams,      // 额外参数
}) => {
  // 你的业务逻辑
}

```

---

## 声明式配置深度解析

### walletHandlers.attach() 详解

这是整个系统的核心方法。让我们深入理解它的工作原理。

#### 初始化 WalletHandlers

```javascript
// api/libs/auth.js
const walletHandlers = new WalletHandlers({
  authenticator: walletAuth,      // 认证器：处理 DID 钱包认证
  tokenStorage,                    // 存储：保存会话 token
  onConnect: args => {            // 连接回调
    // 用户连接时的处理
  }
});

```

#### attach 方法的作用

```javascript
// api/functions/app.js
walletHandlers.attach(
  Object.assign({ app: router }, require('../routes/auth/claim-profile'))
);

```

`attach` 方法做了以下事情：

1. **读取配置对象**：从 require 的文件中获取配置
2. **注册路由**：根据 `action` 字段自动注册 Express 路由
3. **处理认证请求**：将 `claims` 转换为认证请求
4. **绑定回调**：将 `onAuth` 绑定为认证成功回调
5. **生成二维码**：自动生成二维码或跳转链接

#### Object.assign 的作用

```javascript
Object.assign({ app: router }, require('../routes/auth/claim-profile'))
```

这行代码合并了两个对象：

- `{ app: router }` - 提供 Express router
- `require('../routes/auth/claim-profile')` - 提供配置对象

最终传给 `attach` 的对象结构：

```javascript
{
  app: router,           // Express router（必需）
  action: 'profile',    // 动作名称（必需）
  claims: { ... },       // 声明配置（必需）
  onAuth: async () => {} // 回调函数（必需）
}

```

### 配置对象结构

每个认证处理器都是一个配置对象，包含三个核心字段：

```javascript
module.exports = {
  // 1. action：唯一标识符
  action: 'unique_action_name',
  
  // 2. claims：声明需要用户提供什么
  claims: {
    profile: () => ({ ... }),
    signature: async () => ({ ... }),
    // ...
  },
  
  // 3. onAuth：认证成功后的回调
  onAuth: async (params) => {
    // 业务逻辑
  }
};

```

#### action 字段

- **作用**：唯一标识符，用于路由注册和前端调用
- **命名规范**：使用下划线，全小写（如：`claim_profile`）
- **路由映射**：`action: 'profile'` → `/api/auth/profile`

#### claims 字段

claims 是一个对象，键是声明类型，值是一个函数：

```javascript
claims: {
  profile: async ({ userDid, userPk, extraParams }) => {
    // 返回声明配置
    return {
      description: '请提供您的个人信息',
      fields: ['fullName', 'email']
    };
  }
}

```

**函数参数**：

- `userDid`：用户 DID（如果已连接）
- `userPk`：用户公钥（如果已连接）
- `extraParams`：额外参数（从前端传递）
- `challenge`：挑战值

#### onAuth 字段

onAuth 是认证成功后的回调函数：

```javascript
onAuth: async ({
  req,              // Express 请求对象
  userDid,          // 用户 DID
  userPk,           // 用户公钥
  claims,           // 用户提供的声明数组
  challenge,        // 挑战值
  extraParams,      // 额外参数
}) => {
  // 处理业务逻辑
  // 可以返回数据给前端
  return { success: true };
}

```

### 数据流转过程

让我们通过一个完整的流程图来理解数据流转：

**详细步骤**：

1. **前端调用**：`&lt;PlaygroundAction action="profile" /&gt;`
2. **发送请求**：`POST /api/auth/profile`，携带 `extraParams`
3. **walletHandlers 处理**：
4. 
  - 读取 `action='profile'` 的配置
  - 调用 `claims.profile()` 生成认证请求
  - 生成二维码或跳转链接
5. **用户操作**：扫码或点击链接，在 DID Wallet 中确认
6. **钱包返回**：`POST /api/auth/profile` (callback)，携带 `claims`
7. **验证处理**：
8. 
  - 验证签名
  - 验证 challenge（防重放）
  - 调用 `onAuth()`
9. **业务执行**：在 `onAuth` 中处理业务逻辑
10. **返回结果**：返回数据给前端

---

## 实际示例详解

现在让我们通过几个实际示例来深入理解声明式配置。

### 示例 1：简单的 Profile 认证

**文件**：`api/routes/auth/claim-profile.js`

```javascript
module.exports = {
  action: 'profile',
  claims: {
    profile: () => ({
      description: 'Please provide your full profile',
      fields: ['fullName', 'email', 'phone', 'signature', 'avatar', 'birthday'],
    }),
  },

  onAuth: async ({ userDid, userPk }) => {
    logger.info('auth.onAuth', { userPk, userDid });
    // 这里可以保存用户信息到数据库
  },
};

```

**解析**：

1. **action**: `'profile'` - 路由为 `/api/auth/profile`
2. **claims.profile**: 返回一个简单对象，定义需要的字段
3. **onAuth**: 接收用户 DID 和公钥，可以在这里保存到数据库

**前端调用**：

```javascript
<PlaygroundAction 
  action="profile"
  title="获取用户信息"
  buttonText="点击认证"
/>

```

**适用场景**：用户注册、登录、信息更新

### 示例 2：数字签名认证

**文件**：`api/routes/auth/claim-signature.js`

这是一个更复杂的示例，展示了如何动态生成签名请求：

```javascript
module.exports = {
  action: 'claim_signature',
  claims: {
    signature: async ({ userDid, userPk, extraParams: { type } }) => {
      // 根据 type 参数生成不同的签名请求
      const params = {
        // 签名交易
        transaction: {
          type: 'fg:t:transaction',
          data: origin,  // 编码后的交易数据
        },
        
        // 签名文本
        text: {
          type: 'mime:text/plain',
          data: getRandomMessage(),
        },
        
        // 签名 HTML
        html: {
          type: 'mime:text/html',
          data: `<div>...</div>`,
        },
        
        // 签名摘要（用于大数据）
        digest: {
          digest: toBase58(hasher(data, 1)),
        },
      };
      
      return Object.assign(
        { description: `Please sign the ${type}` }, 
        params[type]
      );
    },
  },

  onAuth: async ({ req, userDid, userPk, claims }) => {
    const claim = claims.find(x => x.type === 'signature');
    
    // 验证签名
    if (claim.origin) {
      const isValid = await user.verify(claim.origin, claim.sig);
      if (!isValid) {
        throw new Error('签名验证失败');
      }
    }
    
    // 如果签名的是交易，可以发送到链上
    if (claim.meta && claim.meta.origin) {
      const tx = client.decodeTx(claim.meta.origin);
      const hash = await client.sendTransferV2Tx({
        tx,
        wallet: user,
        signature: claim.sig,
      });
      return { hash, tx: claim.meta.origin };
    }
  },
};

```

**关键点**：

1. **动态 claims**：根据 `extraParams.type` 返回不同的签名类型
2. **签名验证**：在 `onAuth` 中验证签名的有效性
3. **交易执行**：如果签名的是交易，可以直接发送到链上

**适用场景**：交易签名、文档签名、授权确认

### 示例 3：可验证凭证（VC）认证

**文件**：`api/routes/auth/test-vc-claim-filter.js`

这个示例展示了 VC 的新旧语法对比：

```javascript
const { verifyPresentation } = require('@arcblock/vc');

module.exports = {
  action: 'test_vc_claim_filter',
  claims: {
    verifiableCredential: ({ extraParams: { type } }) => {
      // 旧语法：使用 item
      if (type === 'old-online') {
        return {
          description: 'Please provide your node Blocklet Purchase NFT',
          item: ['BlockletPurchaseCredential'],  // 旧语法
          trustedIssuers: [wallet.address],
          tag: blockletDid,
        };
      }

      // 新语法：使用 filters（推荐）
      if (type === 'new-online') {
        return {
          description: 'Please provide your node Blocklet Purchase NFT',
          filters: [  // 新语法：支持多个过滤器（OR 关系）
            {
              type: ['BlockletPurchaseCredential'],
              trustedIssuers: [wallet.address],
              tag: blockletDid,
            },
          ],
        };
      }

      // 多个过滤器：用户可以提供任意一个
      if (type === 'new-online-offline') {
        return {
          description: 'Please provide your Blocklet Purchase Credential and node Fake Passport',
          filters: [
            {
              type: ['BlockletPurchaseCredential'],
              trustedIssuers: [wallet.address],
              tag: blockletDid,
            },
            {
              type: ['PlaygroundFakePassport'],
              trustedIssuers: [wallet.address],
            },
          ],
        };
      }

      throw new Error(`Unknown type ${type}`);
    },
  },
  
  onAuth: async ({ claims, challenge }) => {
    // 1. 从 claims 中提取 VC presentation
    const presentation = JSON.parse(
      claims.find(x => x.type === 'verifiableCredential').presentation
    );
    
    // 2. 验证 challenge（防重放攻击）
    if (challenge !== presentation.challenge) {
      throw Error('Verifiable credential presentation does not have correct challenge');
    }
    
    // 3. 验证 VC 本身
    await verifyPresentation({
      presentation,
      trustedIssuers: [wallet.address],
      challenge
    });
  },
};

```

**VC 声明语法对比**：

| **特性**  | **旧语法（item）**  | **新语法（filters）**  |
|---|---|---|
| 单个 VC 类型  | ✅ 支持  | ✅ 支持  |
| 多个 VC 类型（OR）  | ❌ 不支持  | ✅ 支持  |
| 信任发行者  | ✅ 支持  | ✅ 支持  |
| 标签过滤  | ✅ 支持  | ✅ 支持  |
| 推荐使用  | ❌ 已废弃  | ✅ 推荐  |

**适用场景**：身份验证、资格认证、权限检查

### 示例 4：NFT 资产认证

**文件**：`api/routes/auth/claim-asset.js`

这个示例展示了如何验证用户拥有某个 NFT：

```javascript
module.exports = {
  action: 'claim_asset',
  claims: {
    asset: async ({ userDid, extraParams: { type } }) => {
      // 传统方式：单一条件
      if (type === 'legacy') {
        return {
          description: 'Please provide asset and prove ownership',
          trustedParents: [factories.nftTest],  // 信任的父工厂
          trustedIssuers: [wallet.address],      // 信任的发行者
          tag: 'TestNFT',                        // 标签
        };
      }

      // 新方式：多个过滤器（OR 关系）
      if (type === 'either') {
        // 可以查询链上数据
        const { transactions: [tx] } = await client.listTransactions({
          accountFilter: { accounts: [userDid] },
          typeFilter: { types: ['create_asset'] },
          validityFilter: { validity: 'VALID' },
        });

        return {
          description: 'Please provide asset and prove ownership',
          filters: [
            // 过滤器 1：特定工厂和发行者
            {
              trustedParents: [factories.nftTest],
              trustedIssuers: [wallet.address],
              tag: 'TestNFT',
            },
            // 过滤器 2：特定标签
            {
              tag: 'NFTCreatedByMe',
            },
            // 过滤器 3：特定资产地址（如果用户创建过）
            tx ? { address: tx.tx.itxJson.address } : null,
          ].filter(Boolean),  // 移除 null
        };
      }

      throw new Error(`Unknown type ${type}`);
    },
  },

  onAuth: async ({ challenge, claims }) => {
    const claim = claims.find(x => x.type === 'asset');
    
    // 验证资产声明
    const assetState = await verifyAssetClaim({ claim, challenge });
    
    return { 
      successMessage: `You provided asset with tag: ${assetState.tags.join(',')}` 
    };
  },
};

```

**关键点**：

1. **动态查询**：可以在 claims 函数中查询链上数据
2. **多过滤器**：用户可以提供满足任意一个条件的 NFT
3. **资产验证**：在 `onAuth` 中验证资产的所有权和属性

**适用场景**：NFT 门控、资产证明、游戏道具验证

### 示例 5：多声明组合

有时候你需要用户同时提供多种凭证。例如：既需要用户信息，又需要签名确认。

```javascript
module.exports = {
  action: 'claim_multiple',
  claims: {
    // 声明 1：用户信息
    profile: () => ({
      description: 'Please provide your profile',
      fields: ['fullName', 'email'],
    }),
    
    // 声明 2：签名
    signature: async ({ extraParams: { message } }) => ({
      description: 'Please sign to confirm',
      data: message,
    }),
  },

  onAuth: async ({ userDid, claims }) => {
    // 获取所有声明
    const profile = claims.find(x => x.type === 'profile');
    const signature = claims.find(x => x.type === 'signature');
    
    // 处理业务逻辑
    await saveUser({ userDid, profile, signature });
    
    return { success: true };
  },
};

```

**注意**：当有多个声明时，用户需要在钱包中依次确认所有声明。

---

## 高级特性

### 动态 Claims

claims 函数可以是异步的，可以执行复杂逻辑：

```javascript
claims: {
  asset: async ({ userDid, extraParams }) => {
    // 1. 查询链上数据
    const assets = await client.listAssets({ owner: userDid });
    
    // 2. 根据业务逻辑决定需要什么
    if (assets.length === 0) {
      return {
        description: 'You need to create an asset first',
        // 可以引导用户先创建资产
      };
    }
    
    // 3. 返回动态配置
    return {
      description: 'Please provide one of your assets',
      filters: assets.map(asset => ({
        address: asset.address
      }))
    };
  }
}

```

### 错误处理

在 `onAuth` 中抛出错误会被框架捕获并返回给前端：

```javascript
onAuth: async ({ claims }) => {
  const claim = claims.find(x => x.type === 'signature');
  
  if (!claim) {
    throw new Error('Missing signature claim');  // 会被捕获并返回
  }
  
  // 验证失败也抛出错误
  if (!await verify(claim)) {
    throw new Error('Verification failed');
  }
}

```

### 自定义参数传递

前端可以通过 `extraParams` 传递自定义参数：

```javascript
<PlaygroundAction 
  action="claim_signature"
  extraParams={{ 
    type: 'transaction',
    message: 'Hello World'
  }}
/>

```

后端接收：

```javascript
claims: {
  signature: async ({ extraParams: { type, message } }) => {
    // 使用自定义参数
    return { data: message };
  }
}

```

### 返回数据给前端

`onAuth` 可以返回数据，前端可以通过回调获取：

```javascript
onAuth: async ({ claims }) => {
  // 处理逻辑...
  
  return {
    successMessage: '操作成功',
    data: { userId: '123', token: 'abc' },
  };
}

```

---

## 最佳实践

### 代码组织建议

1. **一个文件一个功能**：每个认证处理器放在单独的文件中
2. **命名规范**：文件名使用 kebab-case，action 使用 snake_case
3. **统一注册**：在 `api/functions/app.js` 中统一注册所有处理器

```javascript
// api/functions/app.js
walletHandlers.attach(
  Object.assign({ app: router }, require('../routes/auth/claim-profile'))
);
walletHandlers.attach(
  Object.assign({ app: router }, require('../routes/auth/claim-signature'))
);
// ...

```

### 命名规范

```javascript
// ✅ 好的命名
action: 'claim_profile'
action: 'claim_signature'
action: 'verify_vc'

// ❌ 不好的命名
action: 'claimProfile'      // 应该用下划线
action: 'CLAIM_PROFILE'     // 应该全小写
action: 'profile'           // 太简单，容易冲突

```

### 安全注意事项

1. **验证 Challenge**：始终验证 challenge 防止重放攻击

```javascript
onAuth: async ({ claims, challenge }) => {
  const presentation = JSON.parse(claims[0].presentation);
  if (challenge !== presentation.challenge) {
    throw new Error('Invalid challenge');
  }
}

```

1. **验证签名**：对于签名类型的声明，始终验证签名

```javascript
onAuth: async ({ userPk, claims }) => {
  const claim = claims.find(x => x.type === 'signature');
  const isValid = await user.verify(claim.data, claim.sig);
  if (!isValid) {
    throw new Error('Invalid signature');
  }
}

```

1. **验证发行者**：对于 VC 和 Asset，验证发行者是否可信

```javascript
claims: {
  verifiableCredential: () => ({
    filters: [{
      trustedIssuers: [wallet.address],  // 只信任特定发行者
    }]
  })
}

```

### 性能优化建议

1. **异步 Claims**：如果 claims 函数需要查询数据，使用异步

```javascript
claims: {
  asset: async ({ userDid }) => {
    // 异步查询，不阻塞
    const assets = await client.listAssets({ owner: userDid });
    return { filters: assets.map(...) };
  }
}

```

1. **缓存查询结果**：对于频繁查询的数据，考虑缓存

```javascript
const cache = new Map();

claims: {
  asset: async ({ userDid }) => {
    if (cache.has(userDid)) {
      return cache.get(userDid);
    }
    const result = await queryAssets(userDid);
    cache.set(userDid, result);
    return result;
  }
}

```

---

## 常见问题解答

### Q1: 如何调试认证流程？

**A**: 有几种方法：

1. **查看后端日志**：`onAuth` 中的 `logger.info` 会输出到控制台
2. **查看网络请求**：在浏览器开发者工具中查看 API 请求
3. **使用** **`console.log`**：在 claims 和 onAuth 函数中添加日志

```javascript
claims: {
  profile: () => {
    console.log('Generating profile claim');
    return { fields: ['fullName'] };
  }
}

onAuth: async ({ userDid, claims }) => {
  console.log('User authenticated:', userDid);
  console.log('Claims received:', claims);
}

```

### Q2: 如何找到某个功能的代码？

**A**: 按照以下步骤：

1. **在前端找到 action 名称**：查看 `src/pages/full.jsx` 中的 `PlaygroundAction` 组件
2. **在** **`api/routes/auth/`** **下找到同名文件**：如 `action="profile"` → `claim-profile.js`
3. **在** **`api/functions/app.js`** **中确认已注册**：查看 `walletHandlers.attach` 调用

### Q3: 如何添加新功能？

**A**: 按照以下步骤：

1. **创建配置文件**：在 `api/routes/auth/` 下创建新文件

```javascript
// api/routes/auth/my-feature.js
module.exports = {
  action: 'my_feature',
  claims: {
    profile: () => ({ fields: ['fullName'] })
  },
  onAuth: async ({ userDid }) => {
    // 业务逻辑
  }
};

```

1. **注册路由**：在 `api/functions/app.js` 中注册

```javascript
walletHandlers.attach(
  Object.assign({ app: router }, require('../routes/auth/my-feature'))
);

```

1. **前端调用**：使用 `PlaygroundAction` 组件

```javascript
<PlaygroundAction 
  action="my_feature"
  title="我的功能"
/>

```

### Q4: 为什么我的认证总是失败？

**A**: 检查以下几点：

1. **action 名称是否匹配**：前端和后端的 action 必须完全一致
2. **claims 配置是否正确**：检查返回的对象格式
3. **onAuth 是否抛出错误**：查看后端日志中的错误信息
4. **challenge 验证**：确保 challenge 验证逻辑正确

### Q5: 如何实现条件认证？

**A**: 在 claims 函数中根据条件返回不同的配置：

```javascript
claims: {
  verifiableCredential: async ({ userDid, extraParams: { level } }) => {
    if (level === 'basic') {
      return {
        filters: [{ type: ['BasicCredential'] }]
      };
    } else if (level === 'premium') {
      return {
        filters: [{ type: ['PremiumCredential'] }]
      };
    }
  }
}

```

### Q6: 如何处理多个声明？

**A**: 在 claims 对象中定义多个声明类型：

```javascript
claims: {
  profile: () => ({ fields: ['fullName'] }),
  signature: () => ({ data: 'Confirm' }),
  verifiableCredential: () => ({ filters: [...] })
}

```

用户需要在钱包中依次确认所有声明。

---

## 总结与下一步

### 学习路径建议

1. **初级阶段**（1-2 天）：
2. 
  - 理解声明式配置的基本概念
  - 运行项目并体验几个简单示例
  - 阅读 `claim-profile.js` 和 `claim-signature.js`
3. **中级阶段**（3-5 天）：
4. 
  - 深入理解 `walletHandlers.attach()` 的工作原理
  - 学习 VC 和 Asset 的声明方式
  - 尝试修改现有示例
5. **高级阶段**（1 周+）：
6. 
  - 实现自己的认证处理器
  - 理解安全最佳实践
  - 优化性能和用户体验

### 社区支持

- **GitHub Issues**：[https://github.com/blocklet/ocap-playground/issues](https://github.com/blocklet/ocap-playground/issues)
- **ArcBlock 社区**：加入 ArcBlock 开发者社区获取帮助

### 结语

OCAP Playground 展示了声明式配置的强大之处：**用最少的代码实现最复杂的功能**。通过本教程，你应该已经掌握了：

- ✅ 声明式配置的核心概念
- ✅ `walletHandlers.attach()` 的工作原理
- ✅ 各种声明类型的使用方法
- ✅ 实际项目的开发技巧

现在，你可以开始构建自己的 DID Wallet 应用了！记住：**最好的学习方式是实践**。尝试修改示例，创建自己的功能，遇到问题时查阅文档和社区。

祝你开发愉快！🚀
