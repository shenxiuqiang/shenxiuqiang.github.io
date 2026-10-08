---
title: 'InfoPoint Whitepaper - A DID-Native Spatial Discovery and AI Retrieval Infrastructure'
description: 'Version 0.9 Draft'
pubDate: '2026-05-22'
tags: ['Blocklet', 'InfoPoint', 'DID', 'AI']
---

Version 0.9 Draft

---

# Executive Summary

InfoPoint is a decentralized spatial discovery and semantic retrieval infrastructure designed for the AI-native internet.

The system transforms physical spaces into machine-readable semantic entities through:

- BLE nearby discovery
- LoRa spatial synchronization
- DID-based spatial identity
- Blocklet spatial runtimes
- AI-native semantic retrieval

Unlike traditional IoT systems, InfoPoint does not attempt to convert edge hardware into miniature web servers. Instead, InfoPoint adopts a stateless spatial beacon architecture:

- edge nodes broadcast spatial identity
- nearby nodes synchronize lightweight spatial indexes
- cloud runtimes host applications and services
- mobile applications maintain local spatial graphs for AI retrieval

This architecture is optimized for:

- scalability
- low hardware cost
- realtime contextual discovery
- semantic interoperability
- AI-native spatial search

The system is applicable across:

- retail
- restaurants
- hospitality
- exhibitions
- tourism
- creator economy
- smart venues
- urban semantic infrastructure

---

# 1. Problem

Modern internet infrastructure indexes webpages rather than physical space.

Discovery of nearby information still depends on:

- centralized map providers
- manual search
- QR codes
- closed ecosystems
- platform-controlled ranking systems

Physical spaces lack:

- globally addressable identity
- semantic interoperability
- realtime spatial state
- AI-readable metadata
- decentralized discovery mechanisms

Traditional beacon systems failed because they only broadcast URLs and lacked:

- identity layer
- semantic layer
- trust layer
- runtime layer
- AI retrieval capability

The result is a fragmented and largely non-programmable physical environment.

---

# 2. Design Principles

InfoPoint follows several architectural principles:

## 2.1 Minimal Edge Hardware

Edge devices should not host complex applications, AI models, or databases.

The node should only:

- broadcast spatial identity
- synchronize lightweight nearby indexes
- participate in spatial awareness

---

## 2.2 Decentralized Spatial Identity

Each physical space should possess:

- a DID
- ownership
- verifiable identity
- semantic metadata
- globally resolvable runtime endpoints

---

## 2.3 AI-Native Retrieval

The system is designed for semantic spatial retrieval rather than keyword search.

Spatial context becomes directly consumable by AI systems.

---

## 2.4 Local Spatial Intelligence

Spatial graphs should primarily exist on user devices rather than centralized cloud services.

This improves:

- privacy
- latency
- contextual awareness
- offline capability

---

# 3. System Architecture

InfoPoint consists of six layers.

| Layer  | Responsibility  |
|---|---|
| BLE Discovery Layer  | Nearby discovery  |
| LoRa Spatial Sync Layer  | Distributed nearby index synchronization  |
| DID Identity Layer  | Global spatial identity  |
| Spatial Resolver Layer  | DID → Runtime resolution  |
| Spatial Runtime Layer  | Blocklet application runtime  |
| AI Semantic Layer  | Retrieval and reasoning  |

---

# 4. Hardware Architecture

InfoPoint hardware is intentionally lightweight.

The node is not a web server.

The node does not:

- host AI
- store media
- run databases
- serve rich applications

The node only:

- broadcasts BLE discovery packets
- synchronizes spatial indexes via LoRa
- optionally provisions network configuration

---

## 4.1 Recommended Hardware

### BLE + LoRa Integrated Devices

Recommended development boards:

- Heltec WiFi LoRa 32 V4
- ESP32-C3 + SX1262
- Nordic nRF52 + LoRa module

---

## 4.2 Required Capabilities

| Capability  | Required  |
|---|---|
| BLE Advertising  | Yes  |
| LoRa Communication  | Yes  |
| Minimal Flash Storage  | Yes  |
| WiFi Provisioning  | Optional  |
| GPS  | Optional  |

---

# 5. Spatial Discovery

## 5.1 BLE Discovery

BLE is used exclusively for nearby discovery.

BLE advertisements contain:

- InfoPoint UUID
- node identifier
- protocol version
- compressed semantic metadata

Example:

```javascript
{
  "v":1,
  "id":"cafe001",
  "t":"cafe"
}

```

The app scans nearby BLE packets and discovers nearby InfoPoint nodes.

---

## 5.2 QR Code Discovery

InfoPoint also supports QR-based entry.

QR codes provide:

- compatibility with existing user behavior
- instant onboarding
- explicit user interaction
- table-level or object-level addressing

Example restaurant deployment:

| Object  | Binding  |
|---|---|
| Restaurant  | Main Space DID  |
| Table  | Sub-space QR  |
| Menu  | Runtime Plugin  |
| Payment  | Commerce Plugin  |

A restaurant may deploy:

```javascript
Restaurant DID
↓
Table QR Code
↓
Specific Runtime Context
↓
Order Session

```

This enables:

- table-specific ordering
- localized interactions
- multi-session runtime contexts

QR and BLE are complementary:

| BLE  | QR  |
|---|---|
| passive discovery  | explicit entry  |
| ambient awareness  | direct interaction  |
| nearby context  | precise targeting  |

---

# 6. LoRa Spatial Synchronization

LoRa is not used for content delivery.

LoRa is used for:

- distributed spatial index synchronization
- nearby awareness propagation
- semantic metadata gossip

Example synchronized index:

```javascript
{
  "did":"did:abt:cafe001",
  "type":"cafe",
  "lat":40.712,
  "lng":-73.99,
  "tags":["quiet","wifi","workspace"]
}

```

This allows a user to discover many nearby spaces through a single reachable node.

---

# 7. DID Identity and Resolution

Each space owns a DID.

Example:

```javascript
did:abt:cafe001

```

The DID represents:

- ownership
- trust
- identity
- routing anchor

InfoPoint uses ArcBlock DID infrastructure.

---

## 7.1 DID Resolution Flow

```javascript
BLE / QR
↓
DID
↓
InfoPoint Resolver
↓
Forge Account Metadata
↓
Runtime Endpoint
↓
Spatial Runtime

```

---

## 7.2 DID Metadata Structure

Example metadata:

```javascript
{
  "infopoint": {
    "runtime":"https://space.infopoint.ai/cafe001",
    "resolver":"https://resolver.infopoint.ai",
    "spaceType":"cafe",
    "services":[
      "menu",
      "booking",
      "event",
      "ai-guide"
    ]
  }
}

```

---

## 7.3 Resolver Design

The resolver layer is intentionally separated from DID ownership.

Blockchain provides:

- identity
- ownership
- authenticity

The resolver provides:

- dynamic runtime routing
- cache optimization
- geo-aware routing
- runtime migration

This separation enables runtime flexibility without modifying chain state.

---

# 8. Spatial Runtime

InfoPoint runtimes are implemented as Blocklet applications.

Each physical space corresponds to a programmable runtime.

---

## 8.1 Runtime Capabilities

Core runtime functions:

- profile
- events
- booking
- commerce
- messaging
- realtime state
- analytics
- AI interaction

---

## 8.2 Plugin System

The runtime uses a plugin architecture rather than fixed industry templates.

Examples:

| Industry  | Plugin  |
|---|---|
| Restaurant  | Menu  |
| Hotel  | Room  |
| Exhibition  | Booth  |
| Tourism  | Guide  |
| Retail  | Coupon  |
| Photography  | Booking  |
| Livehouse  | Event  |

This enables a single runtime framework to support multiple industries.

---

# 9. AI-Native Spatial Retrieval

The spatial graph is primarily maintained on the mobile application side.

The app gradually accumulates:

- nearby spatial graph
- semantic embeddings
- nearby memory cache
- user preference graph
- realtime spatial state

This architecture aligns with recent Spatial-RAG research.

---

## 9.1 Retrieval Pipeline

```javascript
User Query
↓
Semantic Parsing
↓
Spatial Filtering
↓
Local Spatial Graph
↓
Semantic Ranking
↓
AI Response

```

---

## 9.2 Example Query

User asks:

```javascript
Nearby quiet cafes suitable for work

```

The system combines:

- distance
- occupancy
- semantic tags
- WiFi availability
- realtime noise level
- user preference history

This produces contextual semantic recommendations rather than static map results.

---

# 10. Local Spatial Intelligence

InfoPoint prioritizes local spatial intelligence over centralized cloud indexing.

Advantages:

- lower latency
- privacy preservation
- offline capability
- personalized semantic memory
- reduced infrastructure cost

The app becomes a local AI-native spatial retrieval engine.

---

# 11. Security and Trust

InfoPoint uses DID-based ownership and identity verification.

The system separates:

| Layer  | Responsibility  |
|---|---|
| DID  | ownership  |
| Resolver  | routing  |
| Runtime  | services  |
| AI Layer  | retrieval  |

This minimizes coupling between trust, routing, and application execution.

---

# 12. Commercial Architecture

InfoPoint is infrastructure rather than a single-purpose application.

Potential commercial layers include:

- hardware sales
- hosted spatial runtimes
- plugin marketplace
- enterprise analytics
- AI services
- spatial search APIs
- DID registration services

The primary long-term value is:

- realtime spatial semantic data
- AI retrieval infrastructure
- urban spatial intelligence

---

# 13. Comparison

| System  | Nearby Discovery  | Identity  | Semantic Layer  | AI Retrieval  |
|---|---|---|---|---|
| QR Code  | Manual  | No  | No  | No  |
| BLE Beacon  | Partial  | Weak  | Weak  | No  |
| Google Maps  | Cloud-only  | Centralized  | Partial  | Limited  |
| InfoPoint  | Native  | DID  | Native  | Native  |

---

# 14. Conclusion

InfoPoint proposes a practical architecture for transforming physical spaces into decentralized semantic infrastructure.

The system combines:

- BLE discovery
- QR entry
- LoRa synchronization
- DID identity
- Blocklet runtimes
- AI-native retrieval

to create a new category of infrastructure:

AI-native spatial discovery and semantic retrieval.

Rather than connecting devices, InfoPoint semanticizes physical space.
