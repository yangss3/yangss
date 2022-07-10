# Node 版本管理器
在开发过程中，不同的项目可能依赖不同的 Node 版本，因此需要能在本地方便的切换到不同的 Node 版本。目前有很多流行的 Node 版本管理工具，例如 `nvm`, `n`, `nvs` 等等。

但是前两者不支持 Windows 平台，虽然社区专门提供了 Windows 版本的 `nvm`: [`nvm-windows`](https://github.com/coreybutler/nvm-windows) ，但我还是更推荐使用 [`nvs`](https://github.com/jasongin/nvs)，因为它跨平台，而且使用起来非常方便。

## NVS 常用命令

```bash
nvs add latest            # 安装最新版到本地
nvs add lts               # 安装 LTS 版到本地
nvs add 10                # 安装 major 版本为 10 的最高版本到本地
nvs add 14.15.1           # 安装 14.15.1 到本地

nvs rm <version>          # 移除指定的版本

nvs use lts               # 在当前的 shell 环境中使用 LTS 版本
nvs use 10                # 在当前 shell 环境中使用本地 major 版本为 10 的最高版本

nvs link lts              # 将 LTS 版本设置为默认版本（跨 shell）
nvs unlink lts            # 将 LTS 从默认版本移除

nvs ls                    # 列出本地已安装的所有版本
nvs ls-remote             # 列出可从远程下载的所有版本
nvs ls-remote 16          # 列出可从远程下载的且 major 版本为 16 的所有版本

nvs alias jesus 14.15.1   # 将 jesus 设置为 14.15.1 的别名
nvs alias                 # 列出所有别名
nvs use jesus             # 使用别名切换版本

```
