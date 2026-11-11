---
title: 'Configure an HTTP proxy for ARC'
description: 'Set HTTP and HTTPS proxy variables for ARC background instances, configure local exclusions, and verify outbound connections.'
pubDate: '2026-11-11'
tags: ['ARC', 'Networking', 'macOS']
---

Set `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` when starting an ARC background process. The first two variables apply to HTTP and HTTPS destinations respectively. `NO_PROXY` lists hosts to reach directly. These variables apply to the network components that honor them. [Proxy environment variable reference](https://bun.com/guides/http/proxy#environment-variables)

## 1. Check the local proxy

Replace the example address and port with your HTTP proxy listener. Use an HTTPS request to check that the listener works.

```sh
curl --fail --silent --show-error --max-time 15 \
  --noproxy '' --proxy http://127.0.0.1:3128 \
  https://example.com/ -o /dev/null
```

An exit status of `0` indicates success. If the command fails, check the proxy address, listener port, and whether the proxy allows connections to the target.

## 2. Proxy a named ARC instance

Use `arc service list` to find the instance to restart and replace `my-arc` in the example. Add local or internal hosts that require direct access to `NO_PROXY`. The restart briefly interrupts connections and reuses the recorded home, port, and Blocklets. [ARC service commands](https://www.arcblock.io/en/docs/arc-cli/command-reference-service/)

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

Pass the variables to the command that starts the daemon. Setting them in a later terminal before running `arc afs read` affects that client process only.

## 3. Set a default for future ARC launches

If the ARC installer placed the real launcher at `$HOME/.arc/current/arc`, create a separate launcher at `$HOME/.arc/bin/arc`. Run `mkdir -p "$HOME/.arc/bin"` and merge with any existing script at that location. After checking that the real launcher is executable, save the following script and run `chmod +x "$HOME/.arc/bin/arc"`.

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

For zsh, add `export PATH="$HOME/.arc/bin:$PATH"` after any ARC path setup in `~/.zshenv`. If `~/.zshrc` subsequently prepends the real ARC directory, add the same line after that setup too. Open a new terminal, use `command -v arc` to confirm it resolves to `~/.arc/bin/arc`, and restart each existing instance that should inherit the settings. GUI launchers, tasks, or services that invoke ARC by absolute path need the same variables in their own launch configuration.

To remove this default, remove the added PATH lines and restart the affected instances from an environment without proxy variables. Keep `$HOME/.arc/current/arc` so the wrapper can continue to follow ARC upgrades when used.

## 4. Verify the instance and outbound connections

```sh
instance=my-arc
arc service status --instance "$instance"
arc afs ls / --instance "$instance"
```

The commands above verify the ARC daemon and its local AFS connection. To check the proxy, read an AFS resource on that instance that makes a remote HTTP request. While the request runs, use `lsof -nP -a -p ARC_PID -iTCP` to look for a connection from the daemon to the proxy port. Replace `ARC_PID` with the PID from `arc service status`. [ARC AFS commands](https://www.arcblock.io/en/docs/arc-cli/command-reference-afs/)
