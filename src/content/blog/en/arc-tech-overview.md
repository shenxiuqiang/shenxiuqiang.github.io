---
title: 'The ARC Technology Overview: Agentic Realm Computer, Mapped'
description: 'One page for the whole ArcBlock ARC surface: ARC Runtime, AFS, AUP, Web Device, Blocklet, Identity and Data Spaces, Agent Access — each layer with its official documentation entry point and the matching tutorial on this site, so you can survey first and dive later.'
pubDate: '2026-10-12'
tags: ['ARC', 'AFS', 'AUP', 'Blocklet', 'AI']
cover: '/images/covers/arc-tech-overview.jpg'
---

ArcBlock's vocabulary has moved fast over the last two years: ARC, AFS, AUP, AOS, AIGNE, Web Device, Blocklet, DID Space, Agent Access. Every one of them has documentation. Very few places show them **on a single map**.

The result: to answer "which layer should I start from?", you have to read five documents first.

This is the overview page. It does four things:

1. Explains the ARC layers in one diagram;
2. Lists every technology, what problem it solves, and where its official documentation lives;
3. Attaches the matching tutorial already published on this site to each entry, so you can jump from the survey straight into detail;
4. Uses **the official documentation site itself** as a live example — it runs on ARC and speaks MCP, so an agent can call it directly.

If you want exactly one link, it is the official documentation: **<https://www.arcblock.io/en/docs/>**. This article's job is the map. The official docs' job is the current contract.

---

## 1. ARC in one sentence

> **ARC (Agentic Realm Computer) is ArcBlock's application runtime: it turns the data, identity, capabilities, and interfaces an application needs into path-addressable resources, so that people and AI agents can run the same application against the same resources.**

Unpacked into three statements:

- **For an application**, ARC is the runtime — you package the app as a **Blocklet** and hand it to ARC.
- **For data**, ARC turns everything into **paths**, addressed uniformly by **AFS** (Agentic File System), no matter whether the backing system is a local file, a database, a DID Space, or an external API.
- **For agents**, ARC makes applications natively reachable — every Blocklet ships **an MCP endpoint** and discovery documents, so an external agent can find and read it without you writing any extra integration.

Against the traditional approach:

```text
Traditional: app = code + database + deploy scripts + integrations
ARC:         app = Blocklet (declarations) + path-addressable resources (AFS) + identity (DID)

Traditional: one UI for humans, a separate API for agents
ARC:         one set of resources; Web Device renders it for people, MCP / AFS exposes it to agents
```

---

## 2. Summary overview

### 2.1 The layer map

```text
┌──────────────────────────────────────────────────────────────┐
│  Entry        arc CLI  ·  arc service  ·  AFS Explorer        │
├──────────────────────────────────────────────────────────────┤
│  Application  Blocklet (package / instance)                   │
├──────────────────────────────────────────────────────────────┤
│  Interface    AUP (interactive) · Web Device (static) · AFS UI│
├──────────────────────────────────────────────────────────────┤
│  Identity     DID  ·  DID Space  ·  Session  ·  CallerInfo    │
│  & Data                                                       │
├──────────────────────────────────────────────────────────────┤
│  Resource     AFS (Path → Mount → Provider → Capability)      │
├──────────────────────────────────────────────────────────────┤
│  Runtime      ARC Runtime                                     │
├──────────────────────────────────────────────────────────────┤
│  Protocols    MCP  ·  AFS over HTTP  ·  llms.txt  ·  OAuth    │
└──────────────────────────────────────────────────────────────┘
```

Read top-down when you are building an application. Read bottom-up when you need to know which layer provides a capability.

### 2.2 Three invariants

Three things in ARC barely change. Understand them and everything else is a corollary.

| Invariant | Meaning | Consequence |
| --- | --- | --- |
| **Everything is a resource, every resource has a path** | AFS addresses data and capabilities through paths | You do not learn a new API per data source |
| **Identity is DID; authorization is capability** | Identity and permission are separate concerns | A successful login does not mean you can write |
| **Every capability is declared** | Providers and Blocklets must declare what they support | Unsupported operations are not faked into looking supported |

The second is the most misunderstood and the biggest departure from ordinary web applications: **in ARC, "who you are" and "what you may do" are decided by different layers, and a credential only settles the first one.**

### 2.3 Five pairs of names that get confused

| Name | What it is | What it is not |
| --- | --- | --- |
| **ARC** | The application runtime (Agentic Realm Computer) | Not a blockchain; not Circle's Arc chain |
| **AFS** | ARC's path-addressable resource layer | Not a Linux filesystem, and not "all data in one store" |
| **AUP** | A declarative semantic interface contract | Not a UI component library, not a React/Vue replacement |
| **Web Device** | A provider that renders AFS resources into a static site | Not another name for AUP, not a general frontend framework |
| **Blocklet** | The application package-and-run unit (package + instance) | Not a synonym for AUP, Web Device, or Provider |

Names that sit *outside* ARC but get mixed in just as often:

| Name | Relationship |
| --- | --- |
| **AIGNE** | An AI agent framework (the prompt-engineering layer) upstream of the ARC stack, not ARC itself |
| **AOS** | Agentic Operating System (the harness-engineering layer), a lower abstraction in the ARC stack |
| **ArcBlock Chain** | ArcBlock's Layer 1 chain, running as ABT Network — a separate thing from ARC |
| **Circle Arc** | Circle's blockchain, unrelated to ArcBlock's ARC |
| **Blocklet Server** | The pre-ARC runtime; capabilities carry forward but are not equivalent |

> There is an official page for exactly this: [Product lineage and boundaries](https://www.arcblock.io/en/docs/architecture/product-lineage/). When an older article says Blocklet Server, check it there.

---

## 3. The ARC technology list

Below, technologies are grouped by layer. Each row gives **what problem it solves**, the **official documentation**, and the **tutorial on this site**.

### 3.1 Runtime layer

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **ARC Runtime** | The environment hosting AFS, identity, providers, and Blocklets | [ARC Architecture](https://www.arcblock.io/en/docs/architecture/) · [ARC product page](https://www.arcblock.io/en/arc/) | [ARC architecture announcement](./arc-agentic-realm-computer/) |
| **ARC 2.0 layer model** | The system map, layer ownership, and reading order | [Mental model](https://www.arcblock.io/en/docs/architecture/mental-model/) · [Product layers](https://www.arcblock.io/en/docs/architecture/product-layers/) | Section 2 of this article |
| **Contracts and evidence** | Separating "current contract" from lineage, so a source directory is not mistaken for a public API | [Contracts and evidence](https://www.arcblock.io/en/docs/architecture/contracts-and-evidence/) | — |

ArcBlock's documentation has a habit worth copying: **past tense, present tense, and planned work are kept apart**, and each page states the version it was checked against. Read that version boundary before you rely on a detail.

### 3.2 Entry layer: arc CLI

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **arc CLI** | The command line into the ARC Runtime | [ARC CLI](https://www.arcblock.io/en/docs/arc-cli/) · [Install](https://www.arcblock.io/en/docs/arc-cli/install/) | [ARC Runtime / arc CLI architecture teardown](./arc-runtime-cli-architecture/) |
| **arc service** | Running the runtime as a long-lived service | [serve / service reference](https://www.arcblock.io/en/docs/arc-cli/command-reference-service/) | Same as above |
| **Command groups** | `arc afs` / `arc blocklet` / `arc did` / `arc space` / `arc vault` / `arc provider` / `arc mcp` / `arc deploy` / `arc dsl` / `arc skill` | [Command reference](https://www.arcblock.io/en/docs/arc-cli/command-reference-blocklet/) | Same as above |
| **AFS Explorer** | Browsing AFS paths graphically | [AFS Explorer](https://www.arcblock.io/en/docs/afs/explorer/) | [AFS from zero to practice](./afs-intro/) |

One boundary that is easy to miss: **the CLI is an entry point; the Runtime is the capability.** Do not treat each command group as a separate product just because there are many of them.

### 3.3 Resource layer: AFS

This is ARC's central abstraction and the layer most worth your time.

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **AFS** | The path-addressable resource and capability layer | [AFS overview](https://www.arcblock.io/en/docs/afs/) | [AFS from zero to practice](./afs-intro/) |
| **Path** | A virtual address for a resource | [Core contract](https://www.arcblock.io/en/docs/afs/core-contract/) | Same as above |
| **Mount** | Binding a path prefix to a provider | [Providers and mounts](https://www.arcblock.io/en/docs/afs/providers/) | Same as above |
| **Provider** | The module that executes operations and declares what it supports | [Author a provider](https://www.arcblock.io/en/docs/afs/author-a-provider/) · [Provider catalog](https://www.arcblock.io/en/docs/afs/provider-catalog/) | Same as above |
| **Capability** | The set of operations a provider declares (read, write, search, exec…) | [Core contract](https://www.arcblock.io/en/docs/afs/core-contract/) | Same as above |
| **Operations** | list / read / write / delete / rename / stat / search / exec / explain | [Core contract](https://www.arcblock.io/en/docs/afs/core-contract/) | Same as above |
| **search vs query** | Free-text retrieval and structured query are different things | [Search and query](https://www.arcblock.io/en/docs/afs/search-and-query/) | Same as above |
| **Runtime boundaries** | When a path "exists" but an operation is still unavailable | [Runtime boundaries](https://www.arcblock.io/en/docs/afs/runtime-boundaries/) | Same as above |

Three judgements to keep:

1. **A path is an interface boundary, not evidence that all data lives in one store.** The provider decides how it stores data.
2. **`list`, `search`, and `query` are not interchangeable.** Enumeration, structured query, and free-text search are three capabilities; a provider may support only some.
3. **A package under `providers/` in the source tree is implementation inventory, not a public support catalog.** The official docs say this explicitly.

### 3.4 Interface layer: AUP, Web Device, AFS UI

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **AUP** | A declarative semantic interface contract (Agentic UI Protocol) | [AUP overview](https://www.arcblock.io/en/docs/aup/) · [Concepts](https://www.arcblock.io/en/docs/aup/concepts/) | [AUP from zero to practice](./aup-intro/) |
| **Semantic Tree** | The heart of AUP: an interface tree a machine can understand | [Semantic Tree](https://www.arcblock.io/en/docs/aup/semantic-tree/) | Same as above |
| **AUP DSL** | A more human-friendly authoring form, plus validate/generate/migrate | [Author with DSL](https://www.arcblock.io/en/docs/aup/author-with-dsl/) · [DSL generate/lint/migrate](https://www.arcblock.io/en/docs/aup/dsl-generate-lint-migrate/) | Same as above |
| **Session / Patch / Scene** | Why AUP is a dynamic interface | [Events, state, bindings](https://www.arcblock.io/en/docs/aup/events-state-bindings/) | Same as above |
| **DeviceCaps / Degradation** | How one interface adapts across devices | [Device capabilities and degradation](https://www.arcblock.io/en/docs/aup/device-capabilities-degradation/) | Same as above |
| **Primitive support matrix** | Which nodes are genuinely supported on which target | [Primitive support matrix](https://www.arcblock.io/en/docs/aup/primitive-support-matrix/) | Same as above |
| **Caller identity and safety** | The UI is not the permission system | [Caller identity and safety](https://www.arcblock.io/en/docs/aup/caller-identity-safety/) | Same as above |
| **Web Device** | The provider that renders an AFS resource tree into a static site | [Web Device overview](https://www.arcblock.io/en/docs/web-device/) · [Author](https://www.arcblock.io/en/docs/web-device/author/) | [Web Device from zero to practice](./web-device-intro/) |
| **Content Object** | The structured content unit that separates content from pages | [Web Device authoring](https://www.arcblock.io/en/docs/web-device/author/) | Same as above |
| **Components and overrides** | Site components and theme overrides | [Built-in components](https://www.arcblock.io/en/docs/web-device/built-in-components/) · [Component overrides](https://www.arcblock.io/en/docs/web-device/components-overrides/) | Same as above |
| **AFS UI** | The architectural lens relating UI concerns back to AFS | [AFS UI](https://www.arcblock.io/en/docs/architecture/afs-ui/) | — |

One misconception worth pinning down here:

> **AUP ≠ Web Device.** AUP describes an *interactive interface tree*; Web Device *renders structured resources into a static site*. The two compose (you can write a Web Device layout in AUP), but they are not the same layer. AFS UI is not a third peer board either — it is only an architectural lens.

### 3.5 Application layer: Blocklet

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **Blocklet** | ARC's unit for packaging and running an application | [Blocklets overview](https://www.arcblock.io/en/docs/blocklets/) | [Blocklet from zero to practice](./blocklet-intro/) |
| **Package and instance** | The immutable reusable unit vs one configured run | [Package and instance](https://www.arcblock.io/en/docs/blocklets/package-and-instance/) | Same as above |
| **blocklet.yaml / manifest** | The application's identity card and capability declaration | [Manifest and capabilities](https://www.arcblock.io/en/docs/blocklets/manifest-and-capabilities/) | Same as above |
| **Local create and run** | Scaffold and accept locally without remote deployment | [Create and run locally](https://www.arcblock.io/en/docs/blocklets/create-run-locally/) | Same as above |
| **check / build / inspect** | Validate, build, and inspect the artifact | [Check, build, and inspect](https://www.arcblock.io/en/docs/blocklets/check-build-inspect/) | Same as above |
| **Data and AFS** | How a Blocklet mounts and uses AFS | [Data and AFS](https://www.arcblock.io/en/docs/blocklets/data-and-afs/) | Same as above |
| **Surfaces** | One Blocklet can expose several faces (web / AUP / agent) | [Web surface](https://www.arcblock.io/en/docs/blocklets/web-surfaces/) | Same as above |
| **Lifecycle and publishing** | The boundary between local acceptance and deployment | [Lifecycle](https://www.arcblock.io/en/docs/blocklets/lifecycle/) · [Publish and deploy](https://www.arcblock.io/en/docs/blocklets/publish-deploy/) | Same as above |
| **Reference applications** | What real packages in the ARC tree look like | [Reference applications](https://www.arcblock.io/en/docs/blocklets/reference-applications/) | — |

ARC takes a clear stance on Blocklets: **local first.** The documented day-to-day loop is a local directory plus an isolated ARC environment:

```bash
arc blocklet create ./my-app --recipe minimal-app --name my-app
arc dsl validate ./my-app
arc blocklet check ./my-app --profile minimal-app
arc service start --blocklet ./my-app --port 4939
# open http://my-app.localhost:4939/
```

That loop proves the source, the declared contract, and the surfaces the local runtime accepts. It does **not** prove the remote publish path works on your machine. Keeping those two apart saves a lot of confusion.

### 3.6 Identity and data layer

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **Identity & Data Spaces** | Who is calling, and which data view they get | [Overview](https://www.arcblock.io/en/docs/identity-data-spaces/) · [Core model](https://www.arcblock.io/en/docs/identity-data-spaces/core-model/) | [Identity & Data Spaces from zero to practice](./identity-data-spaces-intro/) |
| **CallerInfo** | The runtime's view of "the current caller" | [Caller context](https://www.arcblock.io/en/docs/identity-data-spaces/caller-context/) | Same as above |
| **DID** | A verifiable subject identifier | [Identity overview](https://www.arcblock.io/en/docs/identity-data-spaces/) | Same as above |
| **DID Space** | The DID-scoped persistent storage provider | [DID Space](https://www.arcblock.io/en/docs/identity-data-spaces/did-space/) | Same as above |
| **Session data views** | The `/user`, `/tmp`, and `/space` views | [Session data](https://www.arcblock.io/en/docs/identity-data-spaces/session-data/) · [Session views](https://www.arcblock.io/en/docs/identity-data-spaces/session-views/) | Same as above |
| **Data Space** | The documentation term for a caller's data context | [Data Space term](https://www.arcblock.io/en/docs/identity-data-spaces/data-space-term/) | Same as above |
| **DID Connect** | The identity handshake between an app and a wallet | [DID Connect](https://www.arcblock.io/en/docs/identity-data-spaces/did-connect/) | Same as above |
| **arc space / arc did / arc vault** | Inspecting identity, data spaces, and secrets locally | [space reference](https://www.arcblock.io/en/docs/arc-cli/command-reference-space/) | [arc CLI teardown](./arc-runtime-cli-architecture/) |

One sentence for this layer:

> **Who (CallerInfo) → sees what (Session) → whose data it is (DID Space) → what may be done (Provider Capability).**

### 3.7 Protocol layer: Agent Access

| Technology | In one line | Official docs | Tutorial here |
| --- | --- | --- | --- |
| **Agent Access** | How an external agent discovers, connects to, authorizes against, and uses a Blocklet | [Agent Access overview](https://www.arcblock.io/en/docs/agent-access/) | [Agent Access from zero to practice](./agent-access-intro/) |
| **`POST /mcp`** | The MCP endpoint every Blocklet ships (streamable HTTP, stateless) | [Connect a client](https://www.arcblock.io/en/docs/agent-access/connect-a-client/) · [Endpoints](https://www.arcblock.io/en/docs/agent-access/endpoints/) | Same as above |
| **`POST /api/afs/rpc`** | The same operations as JSON-RPC, for clients without MCP | [AFS over HTTP](https://www.arcblock.io/en/docs/agent-access/afs-over-http/) | Same as above |
| **`GET /llms.txt`** | A plain-text pointer naming the two above | [llms.txt](https://www.arcblock.io/en/docs/agent-access/llms-txt/) | Same as above |
| **Discovery documents** | Machine-readable declarations under `/.well-known/` | [Discovery surfaces](https://www.arcblock.io/en/docs/agent-access/discovery-surfaces/) | Same as above |
| **Access tiers (four gates)** | Method allowlist → credential → path policy → provider capability | [Access tiers](https://www.arcblock.io/en/docs/agent-access/access-tiers/) | Same as above |
| **Tool declaration** | Anonymous `tools/list` publishes write tools too | [Tools](https://www.arcblock.io/en/docs/agent-access/tools/) | Same as above |
| **Authorization and device grant** | OAuth / PKCE, and how to obtain credentials without a browser | [Authorize a client](https://www.arcblock.io/en/docs/agent-access/authorize-a-client/) · [Device grant](https://www.arcblock.io/en/docs/agent-access/device-grant/) | Same as above |
| **Client onboarding** | Wiring up Claude Code, Codex CLI, and others | [Clients](https://www.arcblock.io/en/docs/agent-access/clients/) | Same as above |
| **Error triage** | The difference between `401` and `200 + isError` | [Errors](https://www.arcblock.io/en/docs/agent-access/errors/) | Same as above |

Two counter-intuitive facts to remember from this layer:

- **`200` does not mean success.** Check `result.isError` on every `tools/call`.
- **A credential is not a write switch.** Even holding an owner credential, you are refused when the Blocklet has not opened that path.

---

## 4. Quick lookup: which layer owns my task

The sections above answer "what exists". This table answers "which one do I use".

| I want to… | Layer | Start here |
| --- | --- | --- |
| Run, package, and ship an application | Blocklet | [Blocklet from zero to practice](./blocklet-intro/) |
| Let agents read my application's content | Agent Access | [Agent Access from zero to practice](./agent-access-intro/) |
| Reach many data sources through one path scheme | AFS | [AFS from zero to practice](./afs-intro/) |
| Describe an interface a machine can understand | AUP | [AUP from zero to practice](./aup-intro/) |
| Build a static website | Web Device | [Web Device from zero to practice](./web-device-intro/) |
| Understand who the user is and where data lives | Identity & Data Spaces | [Identity & Data Spaces from zero to practice](./identity-data-spaces-intro/) |
| Just learn how the CLI relates to the runtime | ARC CLI / Runtime | [ARC Runtime / arc CLI teardown](./arc-runtime-cli-architecture/) |
| See a real ARC application in the wild | The official docs site itself | Section 6 · <https://www.arcblock.io/llms.txt> |
| Follow ARC-related technical news | — | [ARC architecture announcement](./arc-agentic-realm-computer/) |

---

## 5. Recommended reading orders

Two routes, depending on whether you want to build first or understand first.

**Route A — build first (best if you need to ship something now)**

```text
① install the arc CLI
        ↓
② Blocklet from zero to practice    ← get an app running
        ↓
③ AFS from zero to practice         ← how resources are addressed
        ↓
④ Identity & Data Spaces            ← whose data it is
        ↓
⑤ Agent Access                      ← let agents in
```

**Route B — understand first (best if you are evaluating the architecture)**

```text
① this article (ARC technology overview)
        ↓
② ARC Runtime / arc CLI teardown
        ↓
③ AFS from zero to practice
        ↓
④ AUP → Web Device                  ← the two interface paths
        ↓
⑤ Blocklet                          ← how an app is assembled
        ↓
⑥ Identity & Data Spaces → Agent Access
```

Either way, read the overview before the details. The hard part of ARC is not any single concept — it is knowing which layer each concept belongs to.

---

## 6. The best live example: the official docs site is itself an ARC application

Everything above is implemented once, for real, by the official documentation site. That is the one point worth its own section:

> **arcblock.io runs on ARC, and it speaks MCP natively.**

Which means the whole stack — Blocklet, AFS, MCP, Agent Access, capability declarations, anonymous read plus authorized write — genuinely exists on the server you already consult for docs. If you want to check whether ARC is really "a runtime for agents", you do not need to install anything first: **just ask the official docs site.**

### 6.1 Discovery in three steps

Any MCP client (Claude Code, Codex CLI, and others) connects like this:

```text
① https://www.arcblock.io/llms.txt                     ← read this first
       │
       │  it names the addresses below
       ▼
② https://www.arcblock.io/.well-known/mcp.json         ← the server card
       │
       │  name / transport / authentication / tools
       ▼
③ POST https://www.arcblock.io/mcp                     ← the actual endpoint
```

`llms.txt` returns exactly the contract described in section 3.7:

```text
## For agents

- MCP (Streamable HTTP): https://www.arcblock.io/mcp
- Server card: https://www.arcblock.io/.well-known/mcp.json
- AFS over HTTP (JSON-RPC): POST https://www.arcblock.io/api/afs/rpc
- Tools: search_content, list_content, get_content
- Collections available to agents: publications, learn, articles, docs, glossary, products, technologies
- Anonymous public read; writes require DID-Connect auth
```

`.well-known/mcp.json` is a standard server card that states its authentication requirements up front:

```json
{
  "name": "ArcBlock Site",
  "url": "https://www.arcblock.io/mcp",
  "transport": "streamable-http",
  "authentication": {
    "required": false,
    "oauth_protected_resource": "https://www.arcblock.io/.well-known/oauth-protected-resource"
  },
  "tools": {
    "anonymous": ["search_content", "list_content", "get_content",
                  "afs_read", "afs_list", "afs_search", "afs_stat", "afs_explain"],
    "authenticated": ["afs_write", "afs_delete", "afs_exec"]
  }
}
```

Look at the shape of that card: it encodes "identity and capability are separate" as plain fields. **What anonymous callers may do and what authenticated callers may do are two tool lists, not one switch.**

### 6.2 Three kinds of tool, three layers

| Tool | Layer | What it does |
| --- | --- | --- |
| `list_content` / `search_content` / `get_content` | Content discovery | List, search, and fetch documents per collection |
| `afs_list` / `afs_read` / `afs_stat` / `afs_search` / `afs_explain` | AFS path access | Walk AFS operations directly by path |
| `afs_write` / `afs_delete` / `afs_exec` | Authorized write | Requires a DID-Connect session |

In other words, the `list` / `read` / `stat` / `search` / `explain` operations from the AFS section can each be tried by hand here.

### 6.3 Run it yourself

All you need is `curl` — no SDK:

```bash
# 1. list the anonymous tools (no credentials, no initialize)
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# 2. list the docs collection (this exposes the AFS path and provider behind it)
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call",
       "params":{"name":"list_content","arguments":{"collection":"docs","limit":3}}}'

# 3. use AFS stat to read a path's real capability declaration
curl -s -X POST https://www.arcblock.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call",
       "params":{"name":"afs_stat","arguments":{"path":"/packages/content/docs/afs"}}}'
```

Step 2 reveals that the content actually lives in a DID Space:

```json
{
  "tool": "list_content",
  "collection": "docs",
  "path": "/packages/content/docs",
  "result": {
    "data": [
      { "id": "afs", "path": "/packages/content/docs/afs",
        "meta": { "kind": "did-space:directory",
                  "provenance": { "provider": "did-space-user" } } },
      { "id": "agent-access", "path": "/packages/content/docs/agent-access", "...": "..." }
    ],
    "total": 58
  }
}
```

Step 3 is the payoff — it lays this article's thesis out in a single output:

```text
NODE /packages/content/docs/afs
KIND did-space:directory
UPDATED 2026-08-07T07:32:10.783Z
META_CAPABILITIES ["list","read","stat","search","exec","explain"]
META_ACCESSMODE readonly
META_WITHHELDCAPABILITIES ["write","delete"]
SIDE_EFFECT NONE
```

What did we just read?

- **Path, provider, capability, and access mode are all here.** Exactly the four things from section 3.3.
- **`META_ACCESSMODE readonly` and `META_WITHHELDCAPABILITIES ["write","delete"]`** show that "what may be done" is *declared*, not guessed.
- It also explains the line from section 3.7 — **a credential is not a write switch**: the path itself is read-only, so no credential writes to it. Writing means the authenticated tools and a path that permits it.

One honest caveat, because the official docs site has no superpowers either: its `search_content` works in index mode, and in my own testing several queries against the `docs` collection returned zero hits, while `list_content` and the `afs_*` tools worked. Which is itself the boundary the AFS docs keep repeating:

> Do not assume every provider is searchable; **search coverage, index strategy, and ranking are decided by the provider.**

Run `afs_stat` first to see what a path can do, then decide whether to depend on an operation. That is the working method the AFS documentation insists on — and the official docs site demonstrates it.

### 6.4 What this shows

Treat the official docs site as an ordinary website and it is just documentation.

Once you know it runs on ARC, ships MCP, stores content in a DID Space, and declares its read/write boundary through capabilities, its nature changes:

> **It is not only a site for people to read. It is simultaneously an application an agent can use directly.**

That is precisely ARC's goal — **one application, one set of data, one set of capability declarations, with people and agents entering through their own doors.** People read the docs in a browser; agents read the same content over MCP.

If you want to show your team what ARC actually buys you, the cheapest demo is probably not an architecture talk. Point their agent at `https://www.arcblock.io/mcp`.

---

## 7. Official documentation index

The official docs are the only source of contract. Every link in this article can be re-entered from here:

| Entry | Address | Covers |
| --- | --- | --- |
| **Docs home** | <https://www.arcblock.io/en/docs/> | All developer documentation |
| **ARC Architecture** | <https://www.arcblock.io/en/docs/architecture/> | System map, mental model, lineage |
| **AFS** | <https://www.arcblock.io/en/docs/afs/> | Paths, operations, providers, boundaries |
| **AUP** | <https://www.arcblock.io/en/docs/aup/> | Interface tree, DSL, sessions, degradation |
| **Web Device** | <https://www.arcblock.io/en/docs/web-device/> | Static sites, content, components, themes |
| **Blocklets** | <https://www.arcblock.io/en/docs/blocklets/> | Package, instance, local run, publishing |
| **Identity & Data Spaces** | <https://www.arcblock.io/en/docs/identity-data-spaces/> | CallerInfo, DID Space, sessions |
| **Agent Access** | <https://www.arcblock.io/en/docs/agent-access/> | MCP, authorization, discovery, tools |
| **ARC CLI** | <https://www.arcblock.io/en/docs/arc-cli/> | All command groups and exit codes |
| **Legacy docs** | <https://www.arcblock.io/en/docs-legacy/> | Earlier writing and old product names |
| **ARC product page / download** | <https://www.arcblock.io/en/arc/> · <https://arc.afsd.io/> | Positioning and the install entry point |
| **Glossary** | <https://www.arcblock.io/en/glossary/> | Terminology |
| **Agent entry (llms.txt)** | <https://www.arcblock.io/llms.txt> | The machine-readable pointer for agents |
| **MCP server card** | <https://www.arcblock.io/.well-known/mcp.json> | Transport, authentication, tool lists |
| **MCP endpoint** | <https://www.arcblock.io/mcp> | The Streamable HTTP endpoint to call |
| **AFS over HTTP** | `POST https://www.arcblock.io/api/afs/rpc` | The same operations as JSON-RPC |
| **Full text** | <https://www.arcblock.io/llms-full.txt> · <https://www.arcblock.io/llms-docs.txt> | Complete document indexes for agents |

One line from the docs is worth carrying with you: **"The English and Chinese versions are authoritative; other language versions are automatically translated by AI."** When they disagree, the version ArcBlock designates prevails.

---

## 8. How to actually use this map

Do not try to memorise every term at once. A better loop:

1. Memorise the **layer diagram in section 2** (seven layers, top to bottom).
2. When you meet a new term, first ask: **which layer is it on?**
3. Then return to the **technology list in section 3** and find its official docs and the tutorial here.
4. Only when you must make a concrete decision, read the detail page in the official docs — that is where version boundaries are stated.

ARC's stack looks term-heavy, but the structure is restrained: **resources addressed by path, identity by DID, capabilities by declaration, applications packaged as Blocklets, interfaces split into interactive and static, and a single MCP-based way in for agents.**

Hold those seven layers in your head and everything else is just documentation lookup.
