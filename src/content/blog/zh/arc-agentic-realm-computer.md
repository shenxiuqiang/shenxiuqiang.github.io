---
title: 'ArcBlock 正式推出 ARC 架构：Agentic Realm Computer 将取代 Blocklet Server，开启去中心化 AI Agent 新时代'
description: '北京时间 2026 年 4 月 16 日讯（Grok 科技报道）'
pubDate: '2026-04-16'
tags: ['AFS', 'Blocklet', 'AI']
cover: '/images/covers/arc-agentic-realm-computer.jpg'
---

北京时间 2026 年 4 月 16 日讯（Grok 科技报道）

 ArcBlock 创始人兼 CEO Robert Mao 于 4 月 12 日在 X 平台（原 Twitter）上正式宣布：ARC（Agentic Realm Computer，代理式领域计算机） 将全面取代原有的 Blocklet Server，成为 ArcBlock 平台的核心运行时环境。所有新功能开发将转向 ARC，而 Blocklet 架构继续保留，形成 ARC + Blocklets = ArcBlock 的全新组合。Blocklet Server 将被完全开源（含完整文档），以便开发者平滑过渡。

这一宣布标志着 ArcBlock 从“区块链 + 模块化微服务”向“区块链 + 自主 AI Agent”战略转型的里程碑。创始人 Mao 表示：“Ethereum 的‘世界计算机’已演变为全球公共账本，而 ArcBlock 正在重新定义真正的代理式领域计算机——ARC。”ARC 架构：从提示工程到全系统 Agentic 工程的完整栈ARC 采用高度模块化的分层设计，与 ArcBlock 自研的 AIGNE（AI Agent 框架） 深度融合，形成清晰的进化路径：

- AIGNE：Prompt Engineering（提示工程）层，负责 AI Agent 的逻辑构建和技能转移。
- AFS：Context Engineering（上下文工程）层，即 Agentic File System（代理式文件系统）。
- AOS：Harness Engineering（控制工程）层，即 Agentic Operating System（代理式操作系统），提供工具调用、沙箱执行和状态管理。
- ARC：Agentic Engineering（代理式工程）层，整合上述模块，实现端到端自主 Agent 系统。

官方栈表述为：AIGNE → AFS → AOS → ARC。这一设计让 AI Agent 从“被动响应提示”进化到“长时间自主规划、执行、迭代”的真正代理式计算能力。Mao 近期在 X 上分享，ARC 已支持 AI Agent 自主运行 5+ 小时、完成包含 22 阶段 TDD 测试的复杂工作流，甚至实现“Agents building ARC on ARC”的自举开发。

@mave99a

AFS：一切皆上下文的革命性文件系统ARC 的核心创新之一是 AFS（Agentic File System），其设计灵感来源于 Unix“一切皆文件”的哲学，却专为 Agentic AI 打造。2025 年底，ArcBlock 与 CSIRO Data61、University of Tasmania 联合发表的 arXiv 论文《Everything is Context: Agentic File System Abstraction for Context Engineering》（arXiv:2512.05470）正式提出了这一抽象。

arxiv.org

AFS 将内存、工具、知识库、外部 API、人类输入等异构资源全部统一为虚拟文件/路径（典型命名空间 /context），支持动态挂载 Provider（如本地文件、SQLite 记忆、GitHub MCP 服务）。开发者只需通过统一 API（如 afs_read("/context/memory/episodic.db")）即可访问一切，无需学习不同后端接口。最核心的是 AFS 上下文工程管道（Context Engineering Pipeline），一个闭环系统，解决 GenAI 的三大约束（Token Window 限制、无状态、输出非确定性）：

1. Context Constructor（上下文构造器）：按相关性、时效性筛选、排序、压缩上下文，并生成带 provenance（血统）的清单。
2. Context Updater（上下文更新器/Loader）：支持静态注入、增量流式、自适应刷新、多 Agent 隔离。
3. Context Evaluator（上下文评估器）：验证一致性、检测幻觉、持久化有效结果，低置信度时自动触发人类审查。

管道确保所有上下文可审计、可追溯，形成“持久化仓库 → Token Window → 验证回写”的完整闭环。论文已在开源 AIGNE 框架中完整实现，支持五类记忆分类（临时 Scratchpad、会话 Episodic、事实 Fact 等）。与 Blocklet 及现有生态的无缝集成ARC 并非颠覆式替换，而是高层次抽象：

- Blocklet 架构保留：所有现有 Blocklet（模块化微服务组件）可在 ARC 上直接运行，并可作为 AFS Provider 挂载。
- AIGNE 深度融合：Agent 可无缝调用 Blocklet 工具、DID/OCAP 身份系统，实现智能 DApp、Agentic Commerce 等场景。
- 部署灵活：基于 Node.js，支持本地、云端、Docker、Raspberry Pi 等环境，继承 ArcBlock 云节点抽象优势。

创始人强调：“Blocklet Server 将开源完整文档化版本，开发者可继续使用现有方案，但未来所有创新都围绕 ARC 展开。”早期访问采用邀请制，ABT 持有者可通过少量质押优先参与。

@ArcBlock_io

开发者意义与行业影响对开发者而言，ARC + AIGNE 意味着：

- 用更少的代码构建更智能、更自主的应用。
- 上下文不再是瞬态碎片，而是可治理、可审计的第一类基础设施。
- 支持多 Agent 协作、长时间自主运行，真正实现“人类中心”的 AI 共创。

这一升级将加速去中心化 AI 落地，推动智能 DApp、自主工作流、Agentic 支付等新场景。结合 ArcBlock 现有 DID、区块链、ABT 网络，ARC 有望成为下一代“AI-native 基础设施”。当前进展：ARC 已进入 v1.11.0-beta.13 阶段，AFS 与 AOS 模块同步上线。完整技术文档和 API 参考预计随开源迭代陆续发布。ArcBlock 官方建议开发者关注

@mave99a

@ArcBlock_io

及官网 [https://www.arcblock.io](https://www.arcblock.io) 更新。

arcblock.io

ArcBlock 的 ARC 战略，不仅是技术迭代，更是将区块链与 Agentic AI 深度融合的愿景落地。创始人 Mao 曾言：“我们正在从控制马匹，走向管理整个系统——道路、站点、骑手。”在 ARC 时代，AI Agent 将真正成为去中心化世界的自主参与者。（报道完）
参考来源：ArcBlock 官方 X 公告、arXiv 论文、AIGNE 框架文档及创始人最新动态。如需技术迁移指南或代码示例，欢迎持续关注官方渠道。
