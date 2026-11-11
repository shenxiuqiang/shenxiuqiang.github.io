---
title: '给 ARC 配置代理：从链查询超时到按进程分流'
description: '用 v2rayN 和 HTTP_PROXY、HTTPS_PROXY 为 ARC 后台实例配置代理，保留本机服务直连，并验证 DIDMail 的链查询。'
pubDate: '2026-11-11'
tags: ['ARC', 'AFS', 'DIDMail', 'macOS']
---

在 macOS 上，浏览器能通过 v2rayN 访问链服务，ARC 后台的 DIDMail 仍可能报链查询超时。一次排查中，同一个 Beta 链 GraphQL 查询经本地代理约 0.6 秒返回，直连在 14 秒内没有收到响应。ARC 进程当时直接连接了链服务的公网地址。

macOS 系统代理需要应用主动读取设置。v2rayN 的域名规则会处理进入代理客户端的连接。TUN 则可以通过虚拟网卡和系统路由接管更广的流量。只想调整 ARC 时，可以先给它的启动进程传入代理环境变量。以下命令在 macOS 和 ARC `2.0.0-beta.74` 上验证。 [Bun 代理环境变量](https://bun.com/guides/http/proxy#environment-variables) · [sing-box TUN 路由](https://sing-box.sagernet.org/configuration/inbound/tun/#auto_route)

## 1. 验证本地代理

确认客户端的 HTTP 或混合代理监听端口。下面用 `127.0.0.1:10808` 举例。在 v2rayN 的活动路由中，`domain:abtnetwork.io` 的代理规则覆盖 `beta.abtnetwork.io`。使用其他客户端时，按相同的域名后缀配置分流。

```sh
curl --fail --silent --show-error --max-time 15 \
  --noproxy '' --proxy http://127.0.0.1:10808 \
  https://beta.abtnetwork.io/api/ \
  -H 'Content-Type: application/json' \
  --data '{"query":"{getChainInfo{code info{network}}}"}'
```

返回的 `getChainInfo.code` 应为 `OK`。如果这一步失败，先检查监听端口、活动节点和域名规则。

## 2. 给一个 ARC 实例启用代理

用 `arc service list` 找到实例名。以现有的 `didmail-server` 为例，保留已有的代理排除规则，并补上本机回环地址。重启会短暂断开该实例的连接，继续使用已记录的实例目录、端口和 Blocklet。 [ARC 服务命令](https://www.arcblock.io/en/docs/arc-cli/command-reference-service/)

```sh
instance=didmail-server
proxy=http://127.0.0.1:10808
bypass="${no_proxy:-${NO_PROXY:-}}"
bypass="${bypass:+$bypass,}localhost,127.0.0.1,::1,.localhost,didmail-server.localhost"

HTTP_PROXY="$proxy" http_proxy="$proxy" \
HTTPS_PROXY="$proxy" https_proxy="$proxy" \
NO_PROXY="$bypass" no_proxy="$bypass" \
  arc service restart --instance "$instance"
```

环境变量需要传给启动后台进程的命令。后来在终端里设置变量，再运行 `arc afs read`，只会影响这次运行的客户端。

## 3. 给以后启动的 ARC 服务设置默认代理

如果 ARC 安装器把真实入口放在 `$HOME/.arc/current/arc`，可以新建独立的 `$HOME/.arc/bin/arc` 启动脚本。先运行 `mkdir -p "$HOME/.arc/bin"`，已有同名脚本时先合并。确认真实入口可执行后，保存以下内容并运行 `chmod +x "$HOME/.arc/bin/arc"`。

```sh
#!/bin/sh
proxy=http://127.0.0.1:10808
http_proxy=${http_proxy:-${HTTP_PROXY:-$proxy}}
https_proxy=${https_proxy:-${HTTPS_PROXY:-$proxy}}
HTTP_PROXY=$http_proxy
HTTPS_PROXY=$https_proxy

bypass=${no_proxy:-}
if [ -n "${NO_PROXY:-}" ] && [ "$NO_PROXY" != "$bypass" ]; then
  bypass=${bypass:+$bypass,}$NO_PROXY
fi
NO_PROXY=${bypass:+$bypass,}localhost,127.0.0.1,::1,.localhost
no_proxy=$NO_PROXY
export HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy
exec "$HOME/.arc/current/arc" "$@"
```

在 zsh 中，把 `export PATH="$HOME/.arc/bin:$PATH"` 放到 `~/.zshenv` 的 ARC 路径设置之后。如果 `~/.zshrc` 又把真实 ARC 目录移到前面，在那段设置后也补上同一行。开一个新终端，用 `command -v arc` 确认命中 `~/.arc/bin/arc`，再逐一重启需要应用设置的现有实例。通过绝对路径调用 ARC 的 GUI、任务或服务，需要在各自的启动配置中传入相同的环境变量。

要撤销这项默认设置，移除新增的 PATH 行，并从没有代理变量的环境重新启动受影响的实例。保留 `~/.arc/current/arc`，以便 ARC 升级后继续使用同一个启动入口。

## 4. 验证后台查询和本机服务

```sh
instance=didmail-server
arc service status --instance "$instance"
time arc afs read /dev/chain/beta/config --instance "$instance" --json >/dev/null
```

请按实例实际挂载的网络替换 `beta`。在查询期间，可以用 `lsof -nP -a -p ARC_PID -iTCP` 查看实例进程是否连接了本地代理。用 `arc service status` 输出的 PID 替换 `ARC_PID`。DIDMail 还应检查部署地址下的 `/api/health`，确认服务仍可直接访问。 [ARC AFS 命令](https://www.arcblock.io/en/docs/arc-cli/command-reference-afs/)

进程环境变量覆盖遵循它们的网络组件。实测确认了 ARC 通过本地代理建立 Beta 链 HTTPS 隧道，也观察到 ARC 进程仍有通向链公网地址的连接。判断某类请求是否提速时，以该请求的结果和实际连接为准。
