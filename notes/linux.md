# Linux 常用命令

## 常用命令

查看系统内核版本：`uname -a`

## CentOS 安装 git
### 通过 yum 安装
可先通过 `yum info git` 命令查看 yum 源中 git 的版本，如果满足自己的需求，可直接用过 yum 进行安装
```
# yum install -y git  
```
### 使用源码编译
1. 先卸载低版本的 git
   
    ```
    # yum remove git
    ```
2. 安装 git 的依赖库
   
    ```
    # yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker
    ```

3. 下载所需版本的 git 源码包
   
    下载地址 `https://mirrors.edge.kernel.org/pub/software/scm/git/`
    或 `https://github.com/git/git/releases`

    ```
    # wget https://github.com/git/git/archive/v2.28.0.tar.gz
    ```
3. 解压
  
    ```
    # tar -zxvf git-2.28.0.tar.gz
    ```
    这里是解压到当前目录，也可在后面指定目录

4. 进入目录，编译安装
  
    ```
    # cd git-2.28.0
    # ./configure --prefix=/usr/local/git
    # make && make install
    ```
5. 配置环境变量
  
    在 `/etc/profile` 文件末尾加上一行 `export PATH="/usr/local/git/bin:$PATH"`。然后让配置生效：
    ```
    # source /etc/profile
    ```
    > 注意：这样配置的是临时环境变量，只在当前shell 环境中有效，重启 shell 后会失效。

    或者配置软连接:
    ```
    # ln -s /usr/local/git/bin/git /usr/local/bin
    ```

6. 检查是否安装成功
  
    ```
    # git --version
    ```