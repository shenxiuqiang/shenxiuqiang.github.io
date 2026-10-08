---
title: 'DIDMail 端到端加密（E2EE）原理与安全说明'
description: '端到端加密（E2EE）是一种通信安全模型：'
pubDate: '2025-10-19'
tags: ['DIDMail', 'DID']
cover: '/images/covers/didmail-e2ee.jpg'
---

## 一、什么是端到端加密（End-to-End Encryption）

端到端加密（E2EE）是一种通信安全模型：
邮件内容在发送者设备上被加密，只能由接收者设备解密。

在整个传输和存储过程中（包括服务器、网络节点、数据库等），任何中间环节都无法读取邮件明文内容。

即使服务器被攻击、网络被监听，攻击者也只能看到加密后的密文，无法恢复原始内容。

---

## 二、DIDMail 的去中心化信任机制

### 1. 去中心化身份（DID）

每个 DIDMail 用户都拥有一个 **去中心化身份（DID）**，它由加密算法生成的密钥对（公钥 + 私钥）组成。

- **公钥（Public Key）**：公开，用于加密和签名验证；
- **私钥（Private Key）**：仅存储于用户设备本地，用于解密与签名。

DIDMail 不在远端托管或存储任何用户私钥，只在客户端加密存储管理，这意味着只有用户本人能够读取邮件内容。

### 2. 可验证的信任来源

- 用户的公钥记录在 **DID 文档** 中，可公开验证；
- 所有算法均为公开标准，无专有或闭源实现；
- 任何人可独立验证 DIDMail 的加密结果是否正确。

---

## 三、使用的密码算法（公开标准）

| **算法**  | **功能**  | **标准来源**  |
|---|---|---|
| **Ed25519**  | 数字签名与身份认证（DID 身份）  | [RFC 8032](https://datatracker.ietf.org/doc/html/rfc8032)  |
| **Curve25519 / X25519**  | 密钥交换（ECDH）  | [RFC 7748](https://datatracker.ietf.org/doc/html/rfc7748)  |
| **XSalsa20**  | 高速流加密算法（保护邮件内容）  | [NaCl 加密库文档](https://nacl.cr.yp.to/)  |
| **Poly1305**  | 消息认证码（防篡改验证）  | [RFC 7539](https://datatracker.ietf.org/doc/html/rfc7539)  |

> 📘 以上算法均为国际加密标准，
> 被 WhatsApp、ProtonMail、Matrix、Signal 等系统采用。
> 

---

## 四、加密与解密原理

DIDMail 使用“公钥协商 + 对称加密”的组合模式，
在确保安全的同时保持高性能。

### 🔐 加密流程（发送方）

1. **准备明文** 将邮件正文转换为二进制数据。
2. **密钥协商** 使用发送方私钥与接收方公钥计算共享密钥。 该过程基于 [Curve25519](https://datatracker.ietf.org/doc/html/rfc7748) 椭圆曲线。
3. **随机数（Nonce）** 每封邮件生成唯一的 24 字节随机数，防止密文重复。
4. **加密与认证** 使用 **XSalsa20** 加密内容， 并通过 **Poly1305** 生成认证码（MAC）验证完整性。
5. **组合输出** 最终密文格式如下：

```javascript
[ nonce (24字节) || ciphertext (加密内容) ]

```

### 🔓 解密流程（接收方）

1. 从密文中读取 `nonce` 与 `ciphertext`；
2. 使用接收方私钥与发送方公钥生成共享密钥；
3. 验证 Poly1305 认证码以确保未被篡改；
4. 使用共享密钥解密得到原始明文。

---

## 五、DIDMail 加密通信流程图

下图展示了 DIDMail 邮件在发送、传输、接收全过程中的加密与解密逻辑：

![image.png](/images/posts/bafkreidv2qwtx2vsjp7uzc4rreivdpnxl5k7jewoane2ie3ephj757ozbe.webp)

> 服务器仅中转密文，不参与加解密，
> 无法读取或篡改任何用户邮件内容。
> 

---

## 六、邮件在服务器中的存储形式

DIDMail 服务器节点仅保存加密后的数据：

- 邮件信封标题、邮件正文件均为加密数据；
- 服务器无法解密任何内容；
- 所有加密、解密操作均在本地客户端执行。

---

## 七、长期密钥机制（无前向保密）

DIDMail 使用长期密钥对（长期公钥/私钥）进行加解密。
这意味着：

- 历史邮件可以在未来被用户本人重新解密；
- 邮件可以长期保存、备份与验证；
- 密钥体系简单清晰，兼容所有 DID 环境。

### 💡 为什么不采用“前向保密（PFS）”

- 邮件与即时通信不同，**需要长期可读性与可审计性**；
- 用户希望能够恢复历史邮件（如导出、迁移账户、存档等）；
- 若采用 PFS，每封邮件的解密密钥在会话后即被销毁，将导致邮件内容无法长期保存。

因此，DIDMail 选择**非前向保密模式**，以确保加密安全与长期可访问性之间的平衡。

---

## 八、数字签名与身份验证

DIDMail 使用 **Ed25519** 数字签名来保证邮件身份真实性。

1. **签名阶段**
2. 
  - 发送方使用私钥对邮件或摘要进行签名；
  - 签名结果附加在邮件元数据中。
3. **验证阶段**
4. 
  - 接收方使用发送方公钥验证签名；
  - 若验证通过，即可确认消息确实来自该 DID 身份。

验证函数示意：

```javascript
verify(signature, message, publicKey) → true / false

```

这确保：

- 邮件确实由对应的 DID 用户发送；
- 传输过程中未被任何人篡改。

---

## 九、信任链与可验证性

DIDMail 的信任体系完全透明：

1. **算法可公开验证** 所有算法来自 [TweetNaCl](https://github.com/dchest/tweetnacl-js) 或 [libsodium](https://doc.libsodium.org/)。 用户可自行用这些库验证密文能否正确解密。
2. **DID 文档公开可查** 每个用户的公钥写入 DID 文档，通过链上交互可查。
3. **零信任架构** DIDMail 服务器仅中转加密数据，无法伪造、篡改或生成任何加密内容。

---

## 十、公开验证示例

以下示例展示使用 `tweetnacl` 验证 DIDMail 的加密逻辑：

```javascript
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

// 生成密钥对
const alice = nacl.box.keyPair();
const bob = nacl.box.keyPair();

// Alice → Bob 加密
const message = util.decodeUTF8('Hello DIDMail!');
const nonce = nacl.randomBytes(nacl.box.nonceLength);
const ciphertext = nacl.box(message, nonce, bob.publicKey, alice.secretKey);

// Bob 解密
const decrypted = nacl.box.open(ciphertext, nonce, alice.publicKey, bob.secretKey);
console.log(util.encodeUTF8(decrypted)); // 输出: Hello DIDMail!

```

> 上述代码可直接验证 DIDMail 使用的算法标准与加密效果。
> 

---

## 📚 参考资料

- [NaCl 加密库官网](https://nacl.cr.yp.to/)
- [TweetNaCl.js 源代码](https://github.com/dchest/tweetnacl-js)
- [libsodium 文档](https://doc.libsodium.org/)
- [RFC 7748 - X25519: Diffie-Hellman](https://datatracker.ietf.org/doc/html/rfc7748)
- [RFC 8032 - Ed25519: Signatures](https://datatracker.ietf.org/doc/html/rfc8032)
- [RFC 7539 - Poly1305 and ChaCha20](https://datatracker.ietf.org/doc/html/rfc7539)
