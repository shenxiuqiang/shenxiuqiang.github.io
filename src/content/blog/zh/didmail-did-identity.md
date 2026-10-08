---
title: 'DIDMail采用去中心化身份（DID）'
description: 'DID（Decentralized Identifiers）是由 W3C 标准化的去中心化标识符规范，用于在不依赖中心化注册机构的情况下，唯一标识一个实体（个人、组织、设备、应用等）。DID 强调控制权归属实体自身，支持可验证的数字身份。'
pubDate: '2025-10-20'
tags: ['DIDMail', 'DID']
---

# 去中心化身份（DID）

DID（Decentralized Identifiers）是由 W3C 标准化的去中心化标识符规范，用于在不依赖中心化注册机构的情况下，唯一标识一个实体（个人、组织、设备、应用等）。DID 强调控制权归属实体自身，支持可验证的数字身份。

## 标准与规范

- **标准来源**：W3C Decentralized Identifiers (DIDs) v1.0（Recommendation 状态，稳定推荐版本）。v1.1 为 2025 年 9 月发布的 Working Draft（实验版本，不推荐实施）。
- **参考链接**：
- 
  - v1.0：[https://www.w3.org/TR/did-core/](https://www.w3.org/TR/did-core/)
  - v1.1（实验）：[https://www.w3.org/TR/did-1.1/](https://www.w3.org/TR/did-1.1/)
- **DID 方法**：DID 的语法为 `did:&lt;method&gt;:&lt;specific-id&gt;`，其中 `&lt;method&gt;` 表示底层实现方式（如 `abt`、`ethr`），`&lt;specific-id&gt;` 是方法特定的唯一字符串。不同方法需在 W3C DID 方法注册表中注册。
- **DID 文档**：每个 DID 对应一份 DID Document（通常为 JSON 或 JSON-LD 格式），包含公钥、验证方法、服务端点等元数据。DID 文档通过解析器（resolver）从可验证数据注册表（如区块链）中获取。

## 术语定义

- **DID 主体（Subject）**：DID 标识的实体（如用户）。
- **DID 控制器（Controller）**：控制 DID 文档的实体，可证明控制权。
- **验证方法（Verification Method）**：DID 文档中的公钥或密钥材料，用于签名和验证。
- **服务端点（Service Endpoint）**：DID 文档中定义的通信服务（如 API 或代理）。

## DID:ABT 方法

- DIDMail 采用 ArcBlock 生态的 DID 方法（DID:ABT），前缀为 `did:abt:`，后跟 Base58 编码字符串（以 "z" 开头）。
- **规范链接**：[https://arcblock.github.io/abt-did-spec/](https://arcblock.github.io/abt-did-spec/)
- **关键特性**：支持多种角色类型（账户、节点、设备、应用）、密钥类型（ED25519、secp256k1）和哈希函数（SHA3、SHA2）。DID 创建、更新和撤销通过区块链操作实现，支持扩展 DID 以提升隐私（例如，派生应用特定 DID 以减少相关性风险）。
- **最近更新**：ArcBlock 生态中，DID:ABT 相关功能如 DID 名称服务（DID Names）已添加多域名托管和更顺畅的管理支持（2025 年更新）。

## DID 的优势

- **去中心化**：无需中心化 CA 或注册局即可建立可信标识。
- **可验证**：通过公钥密码学验证 DID 所有权与签名。
- **可移植**：跨平台、跨系统通用，支持互操作性。
- **可扩展**：DID 文档支持多种服务端点与元数据拓展。
- **隐私增强**：支持成对 DID（pairwise DIDs）以最小化跟踪风险。

## DID 在 DIDMail 中的作用

- **账户标识**：用户以 DID 作为邮件系统的账户与身份标识，避免传统邮箱的中心化依赖。
- **密钥信任**：基于 DID 文档的公钥进行消息验签、密钥协商和加密，确保端到端安全。
- **集成细节**：在 DIDMail 中，DID:ABT 用于用户注册（生成 DID 并声明到区块链）、邮件签名（使用验证方法证明发送者）和接收方验证。密钥协商可通过服务端点实现，例如使用 DID 文档中的 `keyAgreement` 方法进行 Diffie-Hellman 交换。

## 示例

### DID 示例

- 通用 DID：`did:example:123456789abcdefghi`
- DID:ABT 示例：`did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z`

### DID 文档示例（JSON 格式）

```javascript
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z",
  "controller": "did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z",
  "verificationMethod": [
    {
      "id": "did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z#keys-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faizti5doHdNKNfs3YyD1C3p6r"
    }
  ],
  "authentication": ["did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z#keys-1"],
  "service": [
    {
      "id": "did:abt:z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z#mail",
      "type": "DIDMailService",
      "serviceEndpoint": "https://mail.example.com/endpoint"
    }
  ]
}

```

### DID 文档示例解释

**注意**：以上 DID 文档示例仅用于演示目的，并非实际可用的 DID 文档。实际 DID 文档应通过 DID 解析器从区块链或其他注册表中获取，且可能包含更多字段或更复杂的结构。根据具体方法（如 DID:ABT）和应用需求，文档内容会有所不同。

- **@context**：定义 JSON-LD 上下文，确保文档符合 W3C DID 规范的标准词汇表，便于互操作性。
- **id**：DID 标识符本身，表示文档所属的 DID。
- **controller**：指定控制该 DID 文档的实体，通常与 id 相同，但可指定多个控制器以支持委托控制。
- **verificationMethod**：数组，包含一个或多个验证方法。这里定义了一个 ED25519 类型的公钥，用于签名验证。字段包括方法 ID、类型、控制器和公钥（以 Multibase 编码）。
- **authentication**：引用验证方法，用于证明 DID 控制权（如登录或签名操作）。
- **service**：数组，定义服务端点。这里添加了一个自定义的 "DIDMailService" 服务，用于 DIDMail 应用中的邮件端点。

此示例展示了基本结构；在实际使用中，可能包括更多验证方法（如用于加密的 keyAgreement）、断言方法或其他扩展字段。

## 安全与隐私考虑

- **安全**：使用强加密（如 ED25519）防止重放攻击和中间人攻击。定期轮换验证方法以处理密钥泄露。
- **隐私**：避免在 DID 文档中包含可识别信息；使用成对 DID 减少跨上下文相关性。参考 W3C 规范，评估监视和相关风险。
- **DIDMail 特定**：确保邮件元数据不泄露 DID 关联；使用代理端点保护服务隐私。

## 参考资源

- W3C DID 用例：[https://www.w3.org/TR/did-use-cases/](https://www.w3.org/TR/did-use-cases/)
- DID 方法注册表：[https://w3c.github.io/did-spec-registries/](https://w3c.github.io/did-spec-registries/)
- ArcBlock DID 常见问题：[https://www.staging.arcblock.io/blog/docs/abt-did-spec/en/abt-did-spec-faq](https://www.staging.arcblock.io/blog/docs/abt-did-spec/en/abt-did-spec-faq)
- 常见 DID 方法比较：

| **方法**  | **底层技术**  | **示例**  | **优势**  |
|---|---|---|---|
| did:abt  | 区块链  | did:abt:z1...  | 集成 ArcBlock 生态  |
| did:ethr  | 以太坊  | did:ethr:0x123...  | 与 Web3 兼容  |

更多信息请参考 W3C 文档和 ArcBlock 博客更新。
