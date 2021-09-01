# Git 常用命令
## 配置

- **`git config --list(-l)`**: 列出所有配置项(system, global, local)
- **`git config --system -l`**: 列出系统级别配置
- **`git config --global -l`**: 列出全局配置
- **`git config --local -l`**: 列出针对当前仓库的配置
- **`git config <key>`**: 查看某个具体的配置项, 默认先查找本地配置(`.git/config`)， 如果没找到，会继续查找全局配置(`~/.gitconfig`), 最后查找系统级别的配置。
- **`git config --[system | global | local] <key>`**: 查看某个级别下的某个具体的配置项
- **`git config <key> <value>`**: 设置本地配置项， 等同于 `git config --local <key> <value>`
- **`git config --[system | global | local] <key> <value>`**: 设置某个级别下的某个具体的配置项
- **`git config --unset --[system | global | local] <key>`**: 删除某个级别下的某个配置

## 查看帮助

- **`git help <command>`**: 打开某个命令的帮助文档，如 `git help config` 会在浏览器中打开 `config` 命令的完整文档
- **`git <command> --help(-h)`**: 直接在终端中查看某个命令的简略帮助信息

## 常用命令

- **`git init`**: 把当前文件夹初始化为 git 仓库

- **`git clone url/to/repository/projectname`**: 克隆远程仓库，会在当前目录创建一个名为 `projectname` 的文件夹，并初始化这个文件夹为本地 git 仓库，同时拉取远程仓库所有的数据到本地仓库。该命令会自动设置本地 master 分支跟踪远程 master 分支，执行完 `git clone` 命令之后，可以直接运行 `git pull` 命令，将远程 master 分支合并到本地 master 分支。

- **`git clone url/to/repository/projectname myproject`**: 作用同上个命令，只不过本地文件夹的名字可以自定义为 `myproject`。

- **`git status` / `git status -s(--short)`**: 查看当前目录的状态

- **`git diff <filename>`**: 查看当前未暂存 (unstaged) 的变更

- **`git diff --staged`**: 查看已暂存 (staged) 的变更

- **`git difftool`**: 打开图形界面查看未暂存的变更

- **`git commit`**: 启动编辑器，填写 commit message 然后退出编辑器(vim 退出命令为 `:wq`)，提交当前变更。

- **`git commit -m 'commit message'`**: 不启动编辑器，直接在命令行里填写 commit message，并提交更新。

- **`git commit -a -m 'commit message'`**: 跳过 `git add` 步骤， stage 和 commit 一步完成，`-a` 表示 `git add *`，既 stage 当前所有变更。

- **`git rm <file>/<directory>`**: 移除已提交且未更改的文件/文件夹，同时从版本库和本地目录中移除，移除文件之后再执行一次 `git commit` 命令完成移除操作。

  > 注意：
  >
  > 1.  如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件且从本地目录中删除，使用 `git rm <file> -f` 命令。
  > 2.  如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件但在本地目录中保留该文件，使用 `git rm <file> --cached` 命令。
  > 3.  如果简单使用 `rm <file>` 移除本地文件，要想从版本库中移除还需执行一次 `git rm <file>` 命令。

- **`git mv <file_from> <file_to>`**: 文件重命名

- **`git commit --amend`**: 启动编辑器，填写提交信息，并覆盖上一次已提交历史，该命令用于撤销上一次提交记录，并用本次提交替换上一次提交。

- **`git commit --amend -m 'commit message'`**: 作用同上，但是不启动编辑器。

- **`git reset HEAD <file>`**: 取消暂存

- **`git checkout -- <file>`**: 撤销文件自上次提交以来的所有更改

- **`git remote`**: 展示关联的远程仓库的名字

- **`git remote -v`**: 同上，同时显示远程仓库的 url

- **`git remote add <shortname> romote/repository/url`**: 为本地仓库添加远程仓库，并命名为 `shortname`

- **`git fetch <remote>`**: 获取远程仓库的最新数据到本地，但是不会自动与本地分支合并，需要手动合并。

- **`git pull <remote> <branch>`**: 拉取指定的远程分支到本地并与当前本地分支合并。

- **`git pull`**: 如果你当前所在分支已经设置为跟踪远程仓库的某个分支，执行该命令，将会自动 fetch 和 merge 远程分支的数据到本地分支

- **`git push <remote> <branch>`**: 将当前分支推送到远程分支

- **`git remote show <remote>`**: 查看远程仓库的详细信息

- **`git remote rename <oldname> <newname>`**: 重命名远程仓库的名字

- **`git remote remove <remote>`**: 删除远程仓库

- **`git stash`**: 贮藏当前工作目录未提交的更改

- **`git stash push -m <message>`**: 贮藏当前工作目录未提交的更改, 同时给该贮藏记录标记 message

- **`git stash -u`**: 贮藏当前工作目录未提交的更改,以及未跟踪的文件

- **`git stash list`**: 查看贮藏区列表

- **`git stash apply`**: 应用最近的一次贮藏记录到当前工作目录, 但是之前处于 staged 状态的变更会退回到 unstage 状态

- **`git stash apply <stash-name>`**: 应用指定的贮藏记录到当前工作目录

- **`git stash apply --index`**: 应用最近的一次贮藏记录到当前工作目录，同时恢复暂存区 (staged) 的状态

- **`git stash drop <stash-name>`**: 删除指定的贮藏记录，如果不提供 `<stash-name>` 将删除最新的一条贮藏记录

- **`git stash pop`**: 应用最近的一次贮藏到当前工作目录，同时删除该贮藏记录

- **`git stash clear`**: 清除所有贮藏记录

- **`git stash branch <branch>`**: 创建一个新分支 `<branch>`, 并在这新分支上应用上次贮藏的记录，同时删除这条贮藏记录。

- **`git rm <file>`**: 同时从索引和工作空间中删除文件，commit 后版本库和本地的文件都会被删除。

- **`git rm --cached <file>`**: 从索引中删除的文件，但是不会在工作空间中删除，commit 后会在版本库中删除，但是本地会保留。用于取消某个文件的跟踪。

## reset 和 checkout 命令

- **`git reset --soft <commit-hash>`**: 使本地仓库回退到指定的历史提交点，该提交点以后的提交记录都将清除，但是工作空间不会发生变化，不会丢失数据，该命令是工作目录安全的。可用于修改历史提交记录。
- **`git reset <commit-hash>`**: 将本地仓库工作目录的状态回退到指定的 commit hash 对应的版本，该提交点以后的提交记录都将清除，但是工作空间不会发生变化，不会丢失数据，该命令是工作目录安全的。
- **`git reset <commit-hash> <file>`**: 将指定的文件的状态回退到指定的 commit hash 对应的版本，文件的内容不会发生变化，不会丢失数据，该命令是工作目录安全的。
- **`git checkout <commit-hash>`**: git 为你创建一个临时的 HEAD detached 分支，并切换到该分支，同时将工作目录回退到指定的 commit hash 对应的版本。该命令不会影响到其它分支，你可以在这个临时分支上做更改和提交。注意，只要你切换到其它分支，这个临时分支都将被自动删除，如果你要保留在这个临时分支上的变更和提交，你需要新建一个分支：`git checkout -b <new-branch>`， 这样 git 将切换到新的分支，并自动删除这个临时分支。
- **`git checkout -b <branch> <commit-hash>`**: `git checkout <commit-hash>` 和 `git checkout -b <branch>` 命令的简写。
- **`git checkout <commit-hash> <file>`**: 将指定的文件回退到指定的 commit hash 对应的版本，**文件的内容会发生变化，会丢失数据，该命令不是工作目录安全的**。

## git log 查看提交历史

- **`git log --patch(-p)`**: 展示每次提交引入的变更
- **`git log -n`**: 展示最近 n 次提交记录
- **`git log --stat / --shortstat`**: 展示每次提交的变更的统计信息
- **`git log --pretty=oneline`**: 以单行展示每一次提交的简略信息
- **`git log --pretty=format:"%h %s"`**: 指定输出的格式

  > | Option |      Description of output      |
  > | :----: | :-----------------------------: |
  > |   %H   |         提交的完整 hash         |
  > |   %h   | 提交 hash 的简写（前 7 个字符） |
  > |  %an   |            作者名字             |
  > |  %ae   |           作者 email            |
  > |  %ad   |      author 时间，绝对时间      |
  > |  %ar   |      author 时间，相对时间      |
  > |   %s   |            提交信息             |
  > |  %cn   |           提交者名字            |
  > |  %ce   |          提交者 email           |
  > |  %cd   |       提交时间，绝对时间        |
  > |  %cr   |       提交时间，相对时间        |

- **`git log --pretty=format:"%h %s" --graph`**: adds a nice little ASCII graph showing your branch and merge history
- **`git log --abbrev-commit`**: Show only the first few characters of the SHA-1 checksum instead of all 40
- **`git log --oneline`**: `git log --pretty=oneline --abbrev-commit` 的简写
- **`git log --relative-date`**: Display the date in a relative format (for example, “2 weeks ago”) instead of using the full date format
- **`git log --since= / --after=`**: 展示指定日期之后的的提交历史，可以是 `"2019-03-23"`，`"2 years 1 day 3 minutes ago` 这样的格式
- **`git log --until= / --before=`**: 展示指定日期之前的的提交历史，同上
- **`git log --author=`**: Only show commits in which the author entry matches the specified string.
- **`git log --grep=`**: Only show commits with a commit message containing the string
- **`git log -S`**: Only show commits adding or removing code matching the string
- **`git show <commit-hash>`**: 查看指定的 hash 所对应的提交记录
- **`git log -- <file>`**: 查看指定文件的提交历史，只显示提交记录，不包含该文件每次的变更信息
- **`git log -p <file>`**: 查看指定文件的提交历史，包含该文件每次的变更信息
- **`gitk <file>`**: 打开 GUI 查看指定文件的提交历史

## 分支

- **`git branch <newBranch>`**: 创建一个新分支，但不会切换到该新分支
- **`git checkout <branch>`**: 切换分支. （注意：如果本地仓库当前不存在 `branch` 分支，而要切换的分支名正好匹配唯一远程仓库的某个分支名，使用该命令将自动创建一个跟踪远程同名分支的 `branch` 分支，并切换到该分支）
- **`git checkout -b <branch>`**: 创建一个新分支，并切换到该分支
- **`git checkout -b <local_branch> <remote/branch>`**: 创建并切换到一个新的本地分支 `local_branch`, 同时让它跟踪远程 `remote/branch` 分支
- **`git checkout --track <remote/branch>`**: 是上面的命令的简写，创建一个与远程 `branch` 分支同名的本地分支 `branch`，并跟踪该远程分支
- **`git merge <branch>`**: 将指定分支合并到当前分支
- **`git branch -d <branch>`**: 删除分支
- **`git branch`**: 显示所有分支
- **`git branch -v`**: 显示所有分支以及在它们上面的最后一次提交
- **`git branch -vv`**: 显示所有本地分支跟踪远程分支的信息
- **`git branch --merged`**: 显示已经合并到当前分支的分支
- **`git branch --no-merged`**: 显示还未合并到当前分支的分支
- **`git push <remote> --delete <branch>`**: 删除远程分支 `<remote>/<branch>`
- **`git push <remote> <branch>`**: 将本地分支`<branch>` 推送到远程分支，会在远程生成一个同名的分支

## 打标签

- **`git tag`**: 列出已有标签
- **`git tag -l 'mode'`**: 使用特定的模式查找标签，例如 `git tag -l 'v1.8.*'`，会列出 v1.8 系列
- **`git tag <tagName>`**: 打轻量标签，例如 `git tag v1.2`
- **`git tag -a <tagName> -m <message>`**: 打附注标签，例如 `git tag -a v1.2 -m 'my version 1.2'`
- **`git tag -a <tagName> <commit-hash>`**: 给历史提交打标签
- **`git push <remote> <tagName>`**: 将指定标签推送到远程仓库
- **`git push <remote> --tags`**: 将本地所有标签推送到远程仓库
- **`git show <tagName>`**： 查看标签信息
- **`git tag -d <tagName>`**: 删除本地标签，远程仓库的这个标签不会被删除
- **`git push <remote> :refs/tags/<tagName>`**: 本地删除标签后是用该命令来同步远程仓库

## 只拉取远程仓库的某个目录或某些目录

```bash
git init
git config core.sparsecheckout true
echo '/directory/*' >> .git/info/sparse-checkout
git remote add origin <remote-url>
git checkout -b <local-branch> <remote/branch>
git pull
```
## 凭据管理
- **`git config --global credential.helper store`**: 凭证用明文的形式存放在磁盘中，并且永不过期。这意味着除非你修改了你在 Git 服务器上的密码，否则你永远不需要再次输入你的凭证信息。这种方式的缺点是你的密码是用明文的方式存放在你的 home 目录下
- **`git config --global credential.helper 'store --file ~/.my-credentials'`**: "store" 模式可以接受一个 `--file <path>` 参数，可以自定义存放密码的文件路径（默认是 ~/.git-credentials ）
- **`git config --global credential.helper cache`**: 将凭证存放在内存中一段时间。 密码永远不会被存储在磁盘中，并且在15分钟后从内存中清除。
- **`git config --global credential.helper 'cache --time 3600'`**:  "cache" 模式有 `--timeout <seconds>` 参数，可以设置后台进程的存活时间（默认是 900，也就是 15 分钟）