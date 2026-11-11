---
title: 'ARC 代理配置指南'
description: '通过环境变量为 ARC 后台实例设置 HTTP 和 HTTPS 代理，配置本地地址例外，并验证实例的出站连接。'
pubDate: '2026-11-11'
tags: ['ARC', 'Networking', 'macOS']
cover: '/images/covers/arc-proxy-configuration.jpg'
---

在启动 ARC 后台进程时传入 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`。前两个变量分别用于 HTTP 和 HTTPS 目标，`NO_PROXY` 指定保持直连的主机。变量的作用范围取决于发起请求的网络组件是否支持它们。 [代理环境变量参考](https://bun.com/guides/http/proxy#environment-variables)

## 1. 验证本地代理

使用实际的 HTTP 代理地址和端口替换下面的示例。用一次 HTTPS 请求检查代理端口是否可用。

```sh
curl --fail --silent --show-error --max-time 15 \
  --noproxy '' --proxy http://127.0.0.1:3128 \
  https://example.com/ -o /dev/null
```

命令退出码为 `0` 表示请求成功。连接失败时，检查代理地址、监听端口和代理是否允许连接目标地址。

## 2. 给一个 ARC 实例启用代理

用 `arc service list` 找到要重启的实例，替换示例中的 `my-arc`。把需要直连的本机或内网主机加到 `NO_PROXY`。重启会短暂断开连接，继续使用已记录的实例目录、端口和 Blocklet。 [ARC 服务命令](https://www.arcblock.io/en/docs/arc-cli/command-reference-service/)

```sh
instance=my-arc
proxy=http://127.0.0.1:3128
bypass="${no_proxy:-${NO_PROXY:-}}"
bypass="${bypass:+$bypass,}localhost,127.0.0.1,::1,.localhost"

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
proxy=http://127.0.0.1:3128
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

## 4. 验证实例和出站连接

```sh
instance=my-arc
arc service status --instance "$instance"
arc afs ls / --instance "$instance"
```

上述命令验证 ARC 后台实例和本机 AFS 连接。要验证代理，从该实例读取一个会触发远程 HTTP 请求的 AFS 资源。在请求进行时，用 `lsof -nP -a -p ARC_PID -iTCP` 检查后台进程是否连接了代理端口。将 `ARC_PID` 替换为 `arc service status` 输出的 PID。 [ARC AFS 命令](https://www.arcblock.io/en/docs/arc-cli/command-reference-afs/)
