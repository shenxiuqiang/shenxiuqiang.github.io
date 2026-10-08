---
title: '在 ArcBlock 平台上实现动态 NFT 显示的最佳实践：使用 Mustache 模板技术'
description: '在 ArcBlock 平台上开发 NFT 应用时，我们面临一个常见挑战：如何让 NFT 的显示内容随着数据的变化而动态更新？传统方案依赖第三方服务，存在可用性风险。在 GLofter Hub 项目中，我们探索并实现了一种基于 Mustache 模板的解决方案，通过更新 NFT 的…'
pubDate: '2026-01-08'
tags: ['Blocklet', 'GLOFTER', 'NFT']
cover: '/images/covers/dynamic-nft-mustache.jpg'
---

## 前言

在 ArcBlock 平台上开发 NFT 应用时，我们面临一个常见挑战：如何让 NFT 的显示内容随着数据的变化而动态更新？传统方案依赖第三方服务，存在可用性风险。在 GLofter Hub 项目中，我们探索并实现了一种基于 Mustache 模板的解决方案，通过更新 NFT 的 `data` 字段来实现动态 SVG 显示，完全避免了对外部服务的依赖。

本文将详细介绍这个解决方案的技术实现、核心技巧，并向 ArcBlock 团队提出一些建议，希望能够在平台层面更好地支持这种动态 NFT 展示方式。

![image.png](/images/posts/bafkreidqrdjzxlqaqsncui7hgmpe2zz3xiqpnsmyxggxkgpahydztsf4bq.webp)

![image.png](/images/posts/bafkreifkhq6w6be2pjmbpszztwzslnp5ekti4jvbmghy4c7fb73z7b63wa.webp)

## 问题分析

### ArcBlock NFT 的限制

在 ArcBlock 平台上，NFT 资产具有以下特性：

- **`data`** **字段可更新**：开发者可以通过 `updateAsset` 接口更新 NFT 的 `data` 字段
- **`display`** **字段不可更新**：NFT 创建后，`display` 字段（包括 SVG 内容）是只读的，无法修改

这个设计在保证数据完整性的同时，也带来了动态显示的挑战。

### 传统方案及其问题

要实现动态数据展示，最常见的方法是将 `display` 设置为一个 URL，指向第三方服务：

```javascript
{
  "display": {
    "type": "url",
    "content": "https://api.example.com/nft/12345.svg"
  }
}

```

展示时，客户端从该 URL 拉取 SVG 内容。这种方式存在明显问题：

1. **第三方服务依赖**：如果服务下线或不可用，NFT 将无法展示
2. **额外的基础设施成本**：需要维护和管理额外的服务器和 API
3. **性能问题**：每次展示都需要额外的网络请求
4. **数据同步问题**：需要确保第三方服务的数据与链上数据一致

### 我们的目标

我们希望实现：

- ✅ 通过更新 `data` 字段来动态更新 SVG 显示
- ✅ 不依赖任何第三方服务
- ✅ 展示逻辑完全基于链上数据
- ✅ 即使后端服务失效，NFT 仍能正常展示

## 解决方案：Mustache 模板方案

### 技术思路

我们的核心思路是：**将 SVG 作为模板存储，展示时使用模板引擎动态渲染**。

1. **SVG 作为模板**：在 Factory 创建时，`display.content` 中存储的是包含 Mustache 模板变量的 SVG 模板
2. **动态渲染**：展示时，使用 Mustache 引擎将 NFT 的 `data` 数据注入模板，生成最终的 SVG
3. **数据更新**：当 `data` 更新时，重新渲染模板即可获得新的 SVG 内容

### 实现原理

整个流程可以用以下图表表示：

```javascript
┌─────────────────┐
│  Factory 创建   │
│  (SVG 模板)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   NFT 铸造       │
│ (保留模板变量)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  更新 data       │─────▶│  前端渲染    │
│  (链上数据)      │      │ Mustache     │
└─────────────────┘      │  .render()   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  最终 SVG    │
                         │  (动态内容)   │
                         └──────────────┘

```

### 关键技术：Factory data 中的模板变量

在实现过程中，我们遇到了一个关键问题：**如何在 Factory 创建时保留模板变量？**

如果在 Factory 的 SVG 模板中直接使用 `{{data.endpoint}}`，当创建 NFT 时，由于 Factory 的 `data` 为空，Mustache 渲染会将模板变量替换为空字符串，最终生成的 NFT 的 SVG 中就不包含模板变量了。

**解决方案**：在 Factory 的 `data` 字段中设置模板变量字符串。

```javascript
// Factory 配置中的关键部分
{
  data: {
    type: 'json',
    value: {
      endpoint: '{{data.endpoint}}',  // 关键：设置为模板变量字符串
      region: '{{data.region}}',
      pricing: {
        basic: '{{data.pricing.basic}}',
        // ...
      },
      // ...
    }
  }
}

```

这样，在创建 NFT 时，Mustache 会将 SVG 模板中的 `{{data.endpoint}}` 替换为字符串 `"{{data.endpoint}}"`，从而在最终 NFT 的 SVG 中保留了模板变量。

## 核心实现细节

### 1. Factory 创建配置

在 GLofter Hub 项目中，Factory 的创建配置如下：

```javascript
// mock/create-glofter-hub-node-nft-factory.ts

const buildFactory = (
  token: { address: string; value: string },
  issuerAddress: string,
  pricing: Pricing,
  capacity: HubCapacity,
  rules: HubRules,
) => ({
  name: "GLofter Hub Node",
  // ...
  output: {
    moniker: "GLofterHubNode #{{ctx.id}}",
    data: {
      type: "json",
      value: {
        endpoint: "{{input.endpoint}}",
        region: "{{input.region}}",
        pricing: {
          basic: `${pricing.basic}`,
          pro: `${pricing.pro}`,
          // ...
        },
        stake: `${defaultStakeAmount}`,
        capacity: `${capacity}`,
        rules: `${rules}`,
      },
    },
    display: {
      type: "svg",
      content: buildNodeSVG(), // SVG 模板，包含 {{data.*}} 变量
    },
    // ...
  },
  // 关键：Factory 的 data 中设置模板变量字符串
  data: {
    type: "json",
    value: {
      endpoint: "{{data.endpoint}}", // 保留模板变量
      region: "{{data.region}}",
      pricing: {
        basic: "{{data.pricing.basic}}",
        pro: "{{data.pricing.pro}}",
        premium: "{{data.pricing.premium}}",
        enterprise: "{{data.pricing.enterprise}}",
      },
      stake: "{{data.stake}}",
      capacity: "{{data.capacity}}",
      rules: "{{data.rules}}",
    },
  },
});

```

**关键点说明**：

- `output.data.value` 中的值在创建 NFT 时会被实际数据替换（如 `{{input.endpoint}}` 会被用户输入的 endpoint 替换）
- `data.value` 中的模板变量字符串（如 `'{{data.endpoint}}'`）会被原样保留到 NFT 的 SVG 中
- 这样，NFT 创建后，其 SVG 中仍然包含模板变量，后续可以动态渲染

### 2. SVG 模板结构

SVG 模板使用 Mustache 语法定义变量：

```javascript
// api/src/utils/node-nft-svg.ts

export function buildNodeSVG(): string {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 315">
    <!-- ... -->
    <text x="25" y="116" font-size="11" fill="#cbd5e1">
      {{data.endpoint}}
    </text>
    <text x="300" y="116" font-size="11" fill="#cbd5e1">
      {{data.region}}
    </text>
    <!-- ... -->
    <text x="25" y="160" font-size="11" fill="#cbd5e1">
      <tspan>Basic: {{data.pricing.basic}}</tspan>
      <tspan dx="8">|</tspan>
      <tspan dx="8">Pro: {{data.pricing.pro}}</tspan>
      <!-- ... -->
    </text>
    <!-- ... -->
  </svg>`;

  return compressSVG(svgContent);
}

```

模板变量包括：

- `{{ctx.id}}` - NFT ID（在创建时由系统提供）
- `{{data.endpoint}}` - 端点地址
- `{{data.region}}` - 区域信息
- `{{data.pricing.*}}` - 价格信息
- `{{data.capacity}}` - 容量
- `{{data.stake}}` - 质押金额
- `{{data.rules}}` - 规章内容

### 3. 前端渲染实现

在前端展示时，使用 Mustache 引擎渲染 SVG 模板：

```javascript
// src/pages/manage/NodeStatus/components/NodeSvgDisplay.tsx

const NodeSvgDisplay: React.FC = () => {
  const asset = useAtomValue(nodeNFTAssetState);

  const svg = useMemo(() => {
    if (!asset) return null;
    const content = asset.display?.content;
    if (!content) return null;

    // 解析 NFT 的 data 数据
    let data: Record<string, unknown> = {};
    if (asset.data?.value) {
      try {
        const rawValue = typeof asset.data.value === 'string'
          ? asset.data.value
          : String(asset.data.value);
        data = JSON.parse(rawValue);

        // 处理 HTML 实体编码（Mustache 转义导致的问题）
        data = {
          ...data,
          endpoint: (data.endpoint as string)?.replace(/&#x2F;/g, '/')
        };
      } catch (error) {
        console.error('Failed to parse asset data.value', error);
        return null;
      }
    }

    // 使用 Mustache 渲染 SVG 模板，将数据注入模板
    return Mustache.render(content, { data });
  }, [asset]);

  return (
    <Box>
      {svg ? (
        <SvgDisplay content={svg} maxWidth="500px" maxHeight="100%" />
      ) : (
        <Typography>暂无 SVG 内容</Typography>
      )}
    </Box>
  );
};

```

**渲染流程**：

1. 从 NFT 资产中获取 `display.content`（SVG 模板）
2. 解析 `data.value`（JSON 字符串）为对象
3. 使用 `Mustache.render(content, { data })` 渲染模板
4. 将渲染后的 SVG 内容传递给展示组件

### 4. HTML 实体编码的处理

在使用 Mustache 渲染时，需要注意 HTML 实体编码的问题。Mustache 默认会对值进行 HTML 转义，例如 `/` 会被转义为 `&amp;#x2F;`。

如果 `data.endpoint` 中的值已经被转义（例如从其他地方传递过来时），我们需要手动解码：

```javascript
data = {
  ...data,
  endpoint: (data.endpoint as string)?.replace(/&#x2F;/g, "/"),
};

```

**更好的做法**：在 SVG 模板中使用未转义语法 `{{{data.endpoint}}}` 或 `{{&amp;data.endpoint}}`，但要注意安全性。在我们的场景中，由于数据来源可信（链上数据），使用未转义语法是安全的。

## 完整的数据流

让我们通过一个完整的示例来说明整个流程：

### 步骤 1：创建 Factory

```javascript
// Factory 创建时
const factory = {
  output: {
    data: {
      value: {
        endpoint: "{{input.endpoint}}", // 创建时会被替换
      },
    },
  },
  display: {
      content: "<svg>...{{data.endpoint}}...</svg>", // SVG 模板
    },
  data: {
    value: {
      endpoint: "{{data.endpoint}}", // 保留模板变量
    },
  },
};

await client.createAssetFactory({ wallet, factory });

```

### 步骤 2：铸造 NFT

用户通过 Factory 铸造 NFT 时：

```javascript
// 用户输入
const input = {
  endpoint: "https://node.example.com",
  region: "AS-CN-BJ",
};

// ArcBlock 平台处理
// 1. 使用 input 数据渲染 output.data，得到：
const nftData = {
  endpoint: "https://node.example.com",
  // ...
};

// 2. 使用 Factory.data 渲染 output.display.content
// Factory.data.endpoint = '{{data.endpoint}}'
// 所以 SVG 中的 {{data.endpoint}} 被替换为 '{{data.endpoint}}'
const nftSvg = "<svg>...{{data.endpoint}}...</svg>"; // 模板变量被保留！

// 3. 创建 NFT
const nft = {
  data: { value: nftData },
  display: { content: nftSvg }, // 包含模板变量
};

```

### 步骤 3：更新 NFT data

```javascript
// 更新 NFT 的 data
await client.updateAsset({
  address: nftAddress,
  data: {
    typeUrl: "json",
    value: {
      endpoint: "https://new-node.example.com", // 新值
      // ... 其他字段
    },
  },
  wallet,
});

```

### 步骤 4：前端展示

```javascript
// 前端获取 NFT 并渲染
const asset = await client.getAssetState({ address: nftAddress });

// 解析 data
const data = JSON.parse(asset.state.data.value);

// 渲染 SVG
const svg = Mustache.render(asset.state.display.content, { data });
// 结果：<svg>...https://new-node.example.com...</svg>

// 显示 SVG
renderSVG(svg);

```

## 向 ArcBlock 团队的建议

基于我们的实践，我们建议 ArcBlock 平台在以下方面提供更好的支持：

### 1. 区块链浏览器支持模板渲染

建议在 ArcBlock 区块链浏览器展示 NFT 时，自动执行模板渲染：

```javascript
// 浏览器端渲染逻辑（建议）
function renderNFTDisplay(asset) {
  const svgTemplate = asset.display?.content;
  if (!svgTemplate) return defaultDisplay;

  // 检查是否包含 Mustache 模板变量
  if (svgTemplate.includes("{{")) {
    const data = parseAssetData(asset.data?.value);
    return Mustache.render(svgTemplate, { data });
  }

  return svgTemplate; // 普通 SVG，直接返回
}

```

### 2. 钱包应用支持模板渲染

建议在钱包应用中展示 NFT 时，也执行相同的模板渲染逻辑，确保：

- 用户在所有平台上看到的 NFT 显示一致
- 不需要每个应用都实现自己的渲染逻辑
- 统一的渲染行为，减少错误和兼容性问题

### 3. 带来的好处

在平台层面支持模板渲染将带来以下好处：

1. **更好的用户体验**：NFT 能够真实反映链上数据，用户看到的内容与数据同步
2. **减少外部依赖**：开发者不需要维护额外的 API 服务
3. **性能优化**：不需要额外的网络请求，展示更快
4. **数据一致性**：显示内容完全基于链上数据，不存在同步问题
5. **可靠性**：即使开发者服务下线，NFT 仍能正常展示

### 4. 标准化建议

建议 ArcBlock 团队考虑：

- 定义标准的模板语法（建议使用 Mustache，因为简单且广泛支持）
- 在文档中明确说明模板渲染的行为和限制
- 提供工具和示例，帮助开发者正确使用模板功能
- 考虑在 SDK 中提供模板渲染的辅助函数

## 应用场景与展望

这种动态 NFT 方案为区块链应用开发带来了更多可能性：

### 1. 动态数据展示

- **节点信息 NFT**：实时显示节点的状态、容量、价格等信息
- **游戏道具 NFT**：显示道具的等级、属性、使用次数等
- **身份认证 NFT**：显示认证信息、有效期等

### 2. 成长型 NFT

通过更新 `data` 字段，可以实现 NFT 的"成长"：

- **虚拟宠物**：随着时间推移，宠物的年龄、经验值等数据变化，外观也随之变化
- **成就系统**：随着用户完成更多任务，成就 NFT 的外观和内容逐步解锁
- **投资组合 NFT**：实时显示投资组合的价值和组成

### 3. 创意应用场景

- **艺术生成器**：通过调整 `data` 中的颜色、形状、尺寸等参数，生成独特的艺术作品
- **数据可视化**：将链上数据（如交易量、用户数等）可视化展示
- **状态指示器**：显示系统状态、投票结果等实时信息

### 4. 实现示例：生长的花朵 NFT

假设我们要创建一个"生长的花朵" NFT：

```javascript
// NFT data 结构
const flowerData = {
  stage: "seedling", // 生长阶段：seedling, bud, bloom, wilt
  age: 7, // 年龄（天）
  water: 85, // 水分（0-100）
  sunlight: 90, // 光照（0-100）
  color: "#FF69B4", // 花朵颜色
  size: 1.2, // 大小倍数
};

// SVG 模板根据 data 动态渲染
// - stage 决定使用哪个 SVG 路径（种子、花苞、盛开、枯萎）
// - color 设置花朵颜色
// - size 缩放整体大小
// - age、water、sunlight 显示在信息面板中

```

用户可以通过更新 `data` 来"培育"这朵花，每次更新后重新渲染，就能看到花朵的变化。

## 总结

通过在 ArcBlock 平台上使用 Mustache 模板技术，我们成功实现了动态 NFT 显示，完全避免了对外部服务的依赖。这个方案的核心技巧在于：

1. **SVG 作为模板存储**：在 Factory 创建时，SVG 中包含模板变量
2. **Factory data 中保留变量**：通过在 Factory 的 `data` 字段中设置模板变量字符串，确保模板变量被保留到最终 NFT 中
3. **动态渲染**：展示时使用 Mustache 引擎将链上数据注入模板

我们建议 ArcBlock 团队考虑在平台层面支持模板渲染，这将大大提升开发者体验，并为 NFT 应用带来更多创新可能性。

---

---

*本文基于 GLofter Hub 项目的实际开发经验撰写，希望对 ArcBlock 社区的开发者有所帮助。如有问题或建议，欢迎交流讨论。*
