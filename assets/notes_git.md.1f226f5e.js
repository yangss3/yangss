import{_ as t,c as e,o,a as l}from"./app.04efe956.js";const g='{"title":"Git 常用命令","description":"","frontmatter":{},"headers":[{"level":2,"title":"配置","slug":"配置"},{"level":2,"title":"查看帮助","slug":"查看帮助"},{"level":2,"title":"常用命令","slug":"常用命令"},{"level":2,"title":"reset 和 checkout 命令","slug":"reset-和-checkout-命令"},{"level":2,"title":"git log 查看提交历史","slug":"git-log-查看提交历史"},{"level":2,"title":"分支","slug":"分支"},{"level":2,"title":"打标签","slug":"打标签"},{"level":2,"title":"只拉取远程仓库的某个目录或某些目录","slug":"只拉取远程仓库的某个目录或某些目录"},{"level":2,"title":"凭据管理","slug":"凭据管理"}],"relativePath":"notes/git.md","lastUpdated":1641909010327}',i={},c=[l('<h1 id="git-常用命令" tabindex="-1">Git 常用命令 <a class="header-anchor" href="#git-常用命令" aria-hidden="true">#</a></h1><h2 id="配置" tabindex="-1">配置 <a class="header-anchor" href="#配置" aria-hidden="true">#</a></h2><ul><li><strong><code>git config --list(-l)</code></strong>: 列出所有配置项(system, global, local)</li><li><strong><code>git config --system -l</code></strong>: 列出系统级别配置</li><li><strong><code>git config --global -l</code></strong>: 列出全局配置</li><li><strong><code>git config --local -l</code></strong>: 列出针对当前仓库的配置</li><li><strong><code>git config &lt;key&gt;</code></strong>: 查看某个具体的配置项, 默认先查找本地配置(<code>.git/config</code>)， 如果没找到，会继续查找全局配置(<code>~/.gitconfig</code>), 最后查找系统级别的配置。</li><li><strong><code>git config --[system | global | local] &lt;key&gt;</code></strong>: 查看某个级别下的某个具体的配置项</li><li><strong><code>git config &lt;key&gt; &lt;value&gt;</code></strong>: 设置本地配置项， 等同于 <code>git config --local &lt;key&gt; &lt;value&gt;</code></li><li><strong><code>git config --[system | global | local] &lt;key&gt; &lt;value&gt;</code></strong>: 设置某个级别下的某个具体的配置项</li><li><strong><code>git config --unset --[system | global | local] &lt;key&gt;</code></strong>: 删除某个级别下的某个配置</li></ul><h2 id="查看帮助" tabindex="-1">查看帮助 <a class="header-anchor" href="#查看帮助" aria-hidden="true">#</a></h2><ul><li><strong><code>git help &lt;command&gt;</code></strong>: 打开某个命令的帮助文档，如 <code>git help config</code> 会在浏览器中打开 <code>config</code> 命令的完整文档</li><li><strong><code>git &lt;command&gt; --help(-h)</code></strong>: 直接在终端中查看某个命令的简略帮助信息</li></ul><h2 id="常用命令" tabindex="-1">常用命令 <a class="header-anchor" href="#常用命令" aria-hidden="true">#</a></h2><ul><li><p><strong><code>git init</code></strong>: 把当前文件夹初始化为 git 仓库</p></li><li><p><strong><code>git clone url/to/repository/projectname</code></strong>: 克隆远程仓库，会在当前目录创建一个名为 <code>projectname</code> 的文件夹，并初始化这个文件夹为本地 git 仓库，同时拉取远程仓库所有的数据到本地仓库。该命令会自动设置本地 master 分支跟踪远程 master 分支，执行完 <code>git clone</code> 命令之后，可以直接运行 <code>git pull</code> 命令，将远程 master 分支合并到本地 master 分支。</p></li><li><p><strong><code>git clone url/to/repository/projectname myproject</code></strong>: 作用同上个命令，只不过本地文件夹的名字可以自定义为 <code>myproject</code>。</p></li><li><p><strong><code>git status</code> / <code>git status -s(--short)</code></strong>: 查看当前目录的状态</p></li><li><p><strong><code>git diff &lt;filename&gt;</code></strong>: 查看当前未暂存 (unstaged) 的变更</p></li><li><p><strong><code>git diff --staged</code></strong>: 查看已暂存 (staged) 的变更</p></li><li><p><strong><code>git difftool</code></strong>: 打开图形界面查看未暂存的变更</p></li><li><p><strong><code>git commit</code></strong>: 启动编辑器，填写 commit message 然后退出编辑器(vim 退出命令为 <code>:wq</code>)，提交当前变更。</p></li><li><p><strong><code>git commit -m &#39;commit message&#39;</code></strong>: 不启动编辑器，直接在命令行里填写 commit message，并提交更新。</p></li><li><p><strong><code>git commit -a -m &#39;commit message&#39;</code></strong>: 跳过 <code>git add</code> 步骤， stage 和 commit 一步完成，<code>-a</code> 表示 <code>git add *</code>，既 stage 当前所有变更。</p></li><li><p><strong><code>git rm &lt;file&gt;/&lt;directory&gt;</code></strong>: 移除已提交且未更改的文件/文件夹，同时从版本库和本地目录中移除，移除文件之后再执行一次 <code>git commit</code> 命令完成移除操作。</p><blockquote><p>注意：</p><ol><li>如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件且从本地目录中删除，使用 <code>git rm &lt;file&gt; -f</code> 命令。</li><li>如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件但在本地目录中保留该文件，使用 <code>git rm &lt;file&gt; --cached</code> 命令。</li><li>如果简单使用 <code>rm &lt;file&gt;</code> 移除本地文件，要想从版本库中移除还需执行一次 <code>git rm &lt;file&gt;</code> 命令。</li></ol></blockquote></li><li><p><strong><code>git mv &lt;file_from&gt; &lt;file_to&gt;</code></strong>: 文件重命名</p></li><li><p><strong><code>git commit --amend</code></strong>: 启动编辑器，填写提交信息，并覆盖上一次已提交历史，该命令用于撤销上一次提交记录，并用本次提交替换上一次提交。</p></li><li><p><strong><code>git commit --amend -m &#39;commit message&#39;</code></strong>: 作用同上，但是不启动编辑器。</p></li><li><p><strong><code>git reset HEAD &lt;file&gt;</code></strong>: 取消暂存</p></li><li><p><strong><code>git checkout -- &lt;file&gt;</code></strong>: 撤销文件自上次提交以来的所有更改</p></li><li><p><strong><code>git remote</code></strong>: 展示关联的远程仓库的名字</p></li><li><p><strong><code>git remote -v</code></strong>: 同上，同时显示远程仓库的 url</p></li><li><p><strong><code>git remote add &lt;shortname&gt; romote/repository/url</code></strong>: 为本地仓库添加远程仓库，并命名为 <code>shortname</code></p></li><li><p><strong><code>git fetch &lt;remote&gt;</code></strong>: 获取远程仓库的最新数据到本地，但是不会自动与本地分支合并，需要手动合并。</p></li><li><p><strong><code>git pull &lt;remote&gt; &lt;branch&gt;</code></strong>: 拉取指定的远程分支到本地并与当前本地分支合并。</p></li><li><p><strong><code>git pull</code></strong>: 如果你当前所在分支已经设置为跟踪远程仓库的某个分支，执行该命令，将会自动 fetch 和 merge 远程分支的数据到本地分支</p></li><li><p><strong><code>git push &lt;remote&gt; &lt;branch&gt;</code></strong>: 将当前分支推送到远程分支</p></li><li><p><strong><code>git remote show &lt;remote&gt;</code></strong>: 查看远程仓库的详细信息</p></li><li><p><strong><code>git remote rename &lt;oldname&gt; &lt;newname&gt;</code></strong>: 重命名远程仓库的名字</p></li><li><p><strong><code>git remote remove &lt;remote&gt;</code></strong>: 删除远程仓库</p></li><li><p><strong><code>git stash</code></strong>: 贮藏当前工作目录未提交的更改</p></li><li><p><strong><code>git stash push -m &lt;message&gt;</code></strong>: 贮藏当前工作目录未提交的更改, 同时给该贮藏记录标记 message</p></li><li><p><strong><code>git stash -u</code></strong>: 贮藏当前工作目录未提交的更改,以及未跟踪的文件</p></li><li><p><strong><code>git stash list</code></strong>: 查看贮藏区列表</p></li><li><p><strong><code>git stash apply</code></strong>: 应用最近的一次贮藏记录到当前工作目录, 但是之前处于 staged 状态的变更会退回到 unstage 状态</p></li><li><p><strong><code>git stash apply &lt;stash-name&gt;</code></strong>: 应用指定的贮藏记录到当前工作目录</p></li><li><p><strong><code>git stash apply --index</code></strong>: 应用最近的一次贮藏记录到当前工作目录，同时恢复暂存区 (staged) 的状态</p></li><li><p><strong><code>git stash drop &lt;stash-name&gt;</code></strong>: 删除指定的贮藏记录，如果不提供 <code>&lt;stash-name&gt;</code> 将删除最新的一条贮藏记录</p></li><li><p><strong><code>git stash pop</code></strong>: 应用最近的一次贮藏到当前工作目录，同时删除该贮藏记录</p></li><li><p><strong><code>git stash clear</code></strong>: 清除所有贮藏记录</p></li><li><p><strong><code>git stash branch &lt;branch&gt;</code></strong>: 创建一个新分支 <code>&lt;branch&gt;</code>, 并在这新分支上应用上次贮藏的记录，同时删除这条贮藏记录。</p></li><li><p><strong><code>git rm &lt;file&gt;</code></strong>: 同时从索引和工作空间中删除文件，commit 后版本库和本地的文件都会被删除。</p></li><li><p><strong><code>git rm --cached &lt;file&gt;</code></strong>: 从索引中删除的文件，但是不会在工作空间中删除，commit 后会在版本库中删除，但是本地会保留。用于取消某个文件的跟踪。</p></li></ul><h2 id="reset-和-checkout-命令" tabindex="-1">reset 和 checkout 命令 <a class="header-anchor" href="#reset-和-checkout-命令" aria-hidden="true">#</a></h2><ul><li><strong><code>git reset --soft &lt;commit-hash&gt;</code></strong>: 使本地仓库回退到指定的历史提交点，该提交点以后的提交记录都将清除，但是工作空间不会发生变化，不会丢失数据，该命令是工作目录安全的。可用于修改历史提交记录。</li><li><strong><code>git reset &lt;commit-hash&gt;</code></strong>: 将本地仓库工作目录的状态回退到指定的 commit hash 对应的版本，该提交点以后的提交记录都将清除，但是工作空间不会发生变化，不会丢失数据，该命令是工作目录安全的。</li><li><strong><code>git reset &lt;commit-hash&gt; &lt;file&gt;</code></strong>: 将指定的文件的状态回退到指定的 commit hash 对应的版本，文件的内容不会发生变化，不会丢失数据，该命令是工作目录安全的。</li><li><strong><code>git checkout &lt;commit-hash&gt;</code></strong>: git 为你创建一个临时的 HEAD detached 分支，并切换到该分支，同时将工作目录回退到指定的 commit hash 对应的版本。该命令不会影响到其它分支，你可以在这个临时分支上做更改和提交。注意，只要你切换到其它分支，这个临时分支都将被自动删除，如果你要保留在这个临时分支上的变更和提交，你需要新建一个分支：<code>git checkout -b &lt;new-branch&gt;</code>， 这样 git 将切换到新的分支，并自动删除这个临时分支。</li><li><strong><code>git checkout -b &lt;branch&gt; &lt;commit-hash&gt;</code></strong>: <code>git checkout &lt;commit-hash&gt;</code> 和 <code>git checkout -b &lt;branch&gt;</code> 命令的简写。</li><li><strong><code>git checkout &lt;commit-hash&gt; &lt;file&gt;</code></strong>: 将指定的文件回退到指定的 commit hash 对应的版本，<strong>文件的内容会发生变化，会丢失数据，该命令不是工作目录安全的</strong>。</li></ul><h2 id="git-log-查看提交历史" tabindex="-1">git log 查看提交历史 <a class="header-anchor" href="#git-log-查看提交历史" aria-hidden="true">#</a></h2><ul><li><p><strong><code>git log --patch(-p)</code></strong>: 展示每次提交引入的变更</p></li><li><p><strong><code>git log -n</code></strong>: 展示最近 n 次提交记录</p></li><li><p><strong><code>git log --stat / --shortstat</code></strong>: 展示每次提交的变更的统计信息</p></li><li><p><strong><code>git log --pretty=oneline</code></strong>: 以单行展示每一次提交的简略信息</p></li><li><p><strong><code>git log --pretty=format:&quot;%h %s&quot;</code></strong>: 指定输出的格式</p><blockquote><table><thead><tr><th style="text-align:center;">Option</th><th style="text-align:center;">Description of output</th></tr></thead><tbody><tr><td style="text-align:center;">%H</td><td style="text-align:center;">提交的完整 hash</td></tr><tr><td style="text-align:center;">%h</td><td style="text-align:center;">提交 hash 的简写（前 7 个字符）</td></tr><tr><td style="text-align:center;">%an</td><td style="text-align:center;">作者名字</td></tr><tr><td style="text-align:center;">%ae</td><td style="text-align:center;">作者 email</td></tr><tr><td style="text-align:center;">%ad</td><td style="text-align:center;">author 时间，绝对时间</td></tr><tr><td style="text-align:center;">%ar</td><td style="text-align:center;">author 时间，相对时间</td></tr><tr><td style="text-align:center;">%s</td><td style="text-align:center;">提交信息</td></tr><tr><td style="text-align:center;">%cn</td><td style="text-align:center;">提交者名字</td></tr><tr><td style="text-align:center;">%ce</td><td style="text-align:center;">提交者 email</td></tr><tr><td style="text-align:center;">%cd</td><td style="text-align:center;">提交时间，绝对时间</td></tr><tr><td style="text-align:center;">%cr</td><td style="text-align:center;">提交时间，相对时间</td></tr></tbody></table></blockquote></li><li><p><strong><code>git log --pretty=format:&quot;%h %s&quot; --graph</code></strong>: adds a nice little ASCII graph showing your branch and merge history</p></li><li><p><strong><code>git log --abbrev-commit</code></strong>: Show only the first few characters of the SHA-1 checksum instead of all 40</p></li><li><p><strong><code>git log --oneline</code></strong>: <code>git log --pretty=oneline --abbrev-commit</code> 的简写</p></li><li><p><strong><code>git log --relative-date</code></strong>: Display the date in a relative format (for example, “2 weeks ago”) instead of using the full date format</p></li><li><p><strong><code>git log --since= / --after=</code></strong>: 展示指定日期之后的的提交历史，可以是 <code>&quot;2019-03-23&quot;</code>，<code>&quot;2 years 1 day 3 minutes ago</code> 这样的格式</p></li><li><p><strong><code>git log --until= / --before=</code></strong>: 展示指定日期之前的的提交历史，同上</p></li><li><p><strong><code>git log --author=</code></strong>: Only show commits in which the author entry matches the specified string.</p></li><li><p><strong><code>git log --grep=</code></strong>: Only show commits with a commit message containing the string</p></li><li><p><strong><code>git log -S</code></strong>: Only show commits adding or removing code matching the string</p></li><li><p><strong><code>git show &lt;commit-hash&gt;</code></strong>: 查看指定的 hash 所对应的提交记录</p></li><li><p><strong><code>git log -- &lt;file&gt;</code></strong>: 查看指定文件的提交历史，只显示提交记录，不包含该文件每次的变更信息</p></li><li><p><strong><code>git log -p &lt;file&gt;</code></strong>: 查看指定文件的提交历史，包含该文件每次的变更信息</p></li><li><p><strong><code>gitk &lt;file&gt;</code></strong>: 打开 GUI 查看指定文件的提交历史</p></li></ul><h2 id="分支" tabindex="-1">分支 <a class="header-anchor" href="#分支" aria-hidden="true">#</a></h2><ul><li><strong><code>git branch &lt;newBranch&gt;</code></strong>: 创建一个新分支，但不会切换到该新分支</li><li><strong><code>git checkout &lt;branch&gt;</code></strong>: 切换分支. （注意：如果本地仓库当前不存在 <code>branch</code> 分支，而要切换的分支名正好匹配唯一远程仓库的某个分支名，使用该命令将自动创建一个跟踪远程同名分支的 <code>branch</code> 分支，并切换到该分支）</li><li><strong><code>git checkout -b &lt;branch&gt;</code></strong>: 创建一个新分支，并切换到该分支</li><li><strong><code>git checkout -b &lt;local_branch&gt; &lt;remote/branch&gt;</code></strong>: 创建并切换到一个新的本地分支 <code>local_branch</code>, 同时让它跟踪远程 <code>remote/branch</code> 分支</li><li><strong><code>git checkout --track &lt;remote/branch&gt;</code></strong>: 是上面的命令的简写，创建一个与远程 <code>branch</code> 分支同名的本地分支 <code>branch</code>，并跟踪该远程分支</li><li><strong><code>git merge &lt;branch&gt;</code></strong>: 将指定分支合并到当前分支</li><li><strong><code>git branch -d &lt;branch&gt;</code></strong>: 删除分支</li><li><strong><code>git branch</code></strong>: 显示所有本地分支</li><li><strong><code>git branch -v</code></strong>: 显示所有分支以及在它们上面的最后一次提交</li><li><strong><code>git branch -vv</code></strong>: 显示所有本地分支跟踪远程分支的信息</li><li><strong><code>git branch --merged</code></strong>: 显示已经合并到当前分支的分支</li><li><strong><code>git branch --no-merged</code></strong>: 显示还未合并到当前分支的分支</li><li><strong><code>git push &lt;remote&gt; --delete/-d &lt;branch&gt;</code></strong>: 删除远程 <code>&lt;branch&gt;</code> 分支</li><li><strong><code>git push &lt;remote&gt; &lt;branch&gt;</code></strong>: 将本地分支<code>&lt;branch&gt;</code> 推送到远程分支，会在远程生成一个同名的分支</li><li><strong><code>git branch -u &lt;remote&gt;/&lt;branch&gt;</code></strong> 将当前分支设置为跟踪远程 <code>&lt;remote&gt;/&lt;branch&gt;</code> 分支</li></ul><h2 id="打标签" tabindex="-1">打标签 <a class="header-anchor" href="#打标签" aria-hidden="true">#</a></h2><ul><li><strong><code>git tag</code></strong>: 列出已有标签</li><li><strong><code>git tag -l &#39;mode&#39;</code></strong>: 使用特定的模式查找标签，例如 <code>git tag -l &#39;v1.8.*&#39;</code>，会列出 v1.8 系列</li><li><strong><code>git tag &lt;tagName&gt;</code></strong>: 打轻量标签，例如 <code>git tag v1.2</code></li><li><strong><code>git tag -a &lt;tagName&gt; -m &lt;message&gt;</code></strong>: 打附注标签，例如 <code>git tag -a v1.2 -m &#39;my version 1.2&#39;</code></li><li><strong><code>git tag -a &lt;tagName&gt; &lt;commit-hash&gt;</code></strong>: 给历史提交打标签</li><li><strong><code>git push &lt;remote&gt; &lt;tagName&gt;</code></strong>: 将指定标签推送到远程仓库</li><li><strong><code>git push &lt;remote&gt; --tags</code></strong>: 将本地所有标签推送到远程仓库</li><li><strong><code>git show &lt;tagName&gt;</code></strong>： 查看标签信息</li><li><strong><code>git tag -d &lt;tagName&gt;</code></strong>: 删除本地标签，远程仓库的这个标签不会被删除</li><li><strong><code>git push &lt;remote&gt; :refs/tags/&lt;tagName&gt;</code></strong>: 本地删除标签后是用该命令来同步远程仓库</li></ul><h2 id="只拉取远程仓库的某个目录或某些目录" tabindex="-1">只拉取远程仓库的某个目录或某些目录 <a class="header-anchor" href="#只拉取远程仓库的某个目录或某些目录" aria-hidden="true">#</a></h2><div class="language-bash"><pre><code><span class="token function">git</span> init\n<span class="token function">git</span> config core.sparsecheckout <span class="token boolean">true</span>\n<span class="token builtin class-name">echo</span> <span class="token string">&#39;/directory/*&#39;</span> <span class="token operator">&gt;&gt;</span> .git/info/sparse-checkout\n<span class="token function">git</span> remote <span class="token function">add</span> origin <span class="token operator">&lt;</span>remote-url<span class="token operator">&gt;</span>\n<span class="token function">git</span> checkout -b <span class="token operator">&lt;</span>local-branch<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>remote/branch<span class="token operator">&gt;</span>\n<span class="token function">git</span> pull\n</code></pre></div><h2 id="凭据管理" tabindex="-1">凭据管理 <a class="header-anchor" href="#凭据管理" aria-hidden="true">#</a></h2><ul><li><strong><code>git config --global credential.helper store</code></strong>: 凭证用明文的形式存放在磁盘中，并且永不过期。这意味着除非你修改了你在 Git 服务器上的密码，否则你永远不需要再次输入你的凭证信息。这种方式的缺点是你的密码是用明文的方式存放在你的 home 目录下</li><li><strong><code>git config --global credential.helper &#39;store --file ~/.my-credentials&#39;</code></strong>: &quot;store&quot; 模式可以接受一个 <code>--file &lt;path&gt;</code> 参数，可以自定义存放密码的文件路径（默认是 ~/.git-credentials ）</li><li><strong><code>git config --global credential.helper cache</code></strong>: 将凭证存放在内存中一段时间。 密码永远不会被存储在磁盘中，并且在15分钟后从内存中清除。</li><li><strong><code>git config --global credential.helper &#39;cache --time 3600&#39;</code></strong>: &quot;cache&quot; 模式有 <code>--timeout &lt;seconds&gt;</code> 参数，可以设置后台进程的存活时间（默认是 900，也就是 15 分钟）</li></ul>',19)];var r=t(i,[["render",function(t,l,g,i,r,s){return o(),e("div",null,c)}]]);export{g as __pageData,r as default};