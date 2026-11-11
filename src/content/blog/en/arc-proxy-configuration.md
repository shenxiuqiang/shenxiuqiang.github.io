---
title: 'Configure a proxy for ARC background services'
description: 'Route ARC through v2rayN with HTTP_PROXY and HTTPS_PROXY, keep local services reachable, and verify DIDMail chain reads.'
pubDate: '2026-11-11'
tags: ['ARC', 'AFS', 'DIDMail', 'macOS']
---

On macOS, a browser may reach a chain endpoint through v2rayN while DIDMail still reports a chain read timeout. In one comparison, the same Beta-chain GraphQL query took about 0.6 seconds through the local proxy and received no response within 14 seconds over the direct route. The ARC daemon was connecting to the chain's public addresses directly.

Apps have to honor the macOS system proxy setting. v2rayN applies its domain rules to connections that reach the proxy client. TUN can capture a wider range of traffic through a virtual interface and system routing. To change ARC's behavior, start with proxy variables on the ARC process. The commands below were verified on macOS with ARC `2.0.0-beta.74`. [Bun proxy environment variables](https://bun.com/guides/http/proxy#environment-variables) · [sing-box TUN routing](https://sing-box.sagernet.org/configuration/inbound/tun/#auto_route)

## 1. Check the local proxy

Confirm the HTTP or mixed proxy listener in your client. This example uses `127.0.0.1:10808`. In v2rayN, an active proxy rule for `domain:abtnetwork.io` covers `beta.abtnetwork.io`. Configure the same domain suffix if you use a different client.

```sh
curl --fail --silent --show-error --max-time 15 \
  --noproxy '' --proxy http://127.0.0.1:10808 \
  https://beta.abtnetwork.io/api/ \
  -H 'Content-Type: application/json' \
  --data '{"query":"{getChainInfo{code info{network}}}"}'
```

Expect `getChainInfo.code` to be `OK`. If this check fails, check the listener port, selected proxy server, and active domain rules.

## 2. Proxy a named ARC instance

Use `arc service list` to find the instance. This example targets an existing `didmail-server` instance, keeps existing proxy exclusions, and adds loopback destinations. The restart briefly interrupts the instance and reuses its recorded home, port, and Blocklets. [ARC service commands](https://www.arcblock.io/en/docs/arc-cli/command-reference-service/)

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

Pass the variables to the command that starts the daemon. Setting them in a later terminal before running `arc afs read` affects that client process only.

## 3. Set a default for future ARC launches

If the ARC installer placed the real launcher at `$HOME/.arc/current/arc`, create a separate launcher at `$HOME/.arc/bin/arc`. Run `mkdir -p "$HOME/.arc/bin"` and merge with any existing script at that location. After checking that the real launcher is executable, save the following script and run `chmod +x "$HOME/.arc/bin/arc"`.

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

For zsh, add `export PATH="$HOME/.arc/bin:$PATH"` after any ARC path setup in `~/.zshenv`. If `~/.zshrc` subsequently prepends the real ARC directory, add the same line after that setup too. Open a new terminal, use `command -v arc` to confirm it resolves to `~/.arc/bin/arc`, and restart each existing instance that should inherit the settings. GUI launchers, tasks, or services that invoke ARC by absolute path need the same variables in their own launch configuration.

To remove this default, remove the added PATH lines and restart the affected instances from an environment without proxy variables. Keep `$HOME/.arc/current/arc` so the wrapper can continue to follow ARC upgrades when used.

## 4. Verify daemon reads and local access

```sh
instance=didmail-server
arc service status --instance "$instance"
time arc afs read /dev/chain/beta/config --instance "$instance" --json >/dev/null
```

Use the network mounted by your instance if it differs from `beta`. During a query, run `lsof -nP -a -p ARC_PID -iTCP` with the PID from `arc service status` and look for a connection to the local proxy. For DIDMail, check `/api/health` at the configured app origin to verify local access. [ARC AFS commands](https://www.arcblock.io/en/docs/arc-cli/command-reference-afs/)

Process proxy variables apply to network components that honor them. Testing confirmed that ARC opened Beta-chain HTTPS tunnels through the local proxy. The daemon also opened connections to public chain addresses directly. Use the result and observed connection for the request you are diagnosing.
