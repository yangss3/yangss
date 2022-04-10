# Package Manager

## Run command

**npm**
```bash
# run from remote
npx <pkg>[@ver] [args...]
npm exec -- <pkg>[@ver] [args...]
npm init <pkg-suffix-name>[@ver] [args...] # only for packages with `create-` prefix
# run from local
npx <cmd> [args...]
npm exec -- <cmd> [args...]
```

**pnpm**
```bash
# run from remote
pnpm dlx <pkg>[@ver] [args...]
# run from local
pnpm exec <cmd> [args...]
```

**yarn**
```bash
# run from remote, only for packages with prefix `create-`
yarn create <pkg-suffix-name>[@ver] [args...]
# run from local
yarn <cmd> [args...]
```

## Install packages

**npm**
```bash
# install all dependencies
npm install
# install packages in dependencies
npm install <pkg>[@ver] [pkgs...]
# install packages in devDependencies
npm install -D <pkg>[@ver] [pkgs...]
# install packages globally
npm install -g <pkg>[@ver] [pkgs...]
```

**pnpm**
```bash
# install all dependencies
pnpm install
# install packages in dependencies
pnpm add <pkg>[@ver] [pkgs...]
# install packages in devDependencies
pnpm add -D <pkg>[@ver] [pkgs...]
# install packages globally
pnpm add -g <pkg>[@ver] [pkgs...]
```

**yarn**
```bash
# install all dependencies
yarn install
# install packages in dependencies
yarn add <pkg>[@ver] [pkgs...]
# install packages in devDependencies
yarn add -D <pkg>[@ver] [pkgs...]
# install packages globally
yarn global add <pkg>[@ver] [pkgs...]
```

## Remove packages

**npm**
```bash
# remove packages locally
npm uninstall <pkg> [pkgs...]
# remove packages globally
npm uninstall -g <pkg> [pkgs...]
```

**pnpm**
```bash
# remove packages locally
pnpm remove <pkg> [pkgs...]
# remove packages globally
pnpm remove --global <pkg> [pkgs...]
```

**yarn**
```bash
# remove packages locally
yarn remove <pkg> [pkgs...]
# remove packages globally
yarn global remove <pkg> [pkgs...]
```

## Publish a package

**npm**
```bash
# publish a package from `folder`, default to current directory 
npm publish [folder]
# publish with a given tag
npm publish --tag <tag>
# publish a scoped package as public
npm publish --access public
```

**pnpm**
```bash
# publish a package from `folder`, default to current directory 
pnpm publish [folder]
# publish with a given tag
pnpm publish --tag <tag>
# recursive publish all packages
pnpm -r publish
# publish a scoped package as public
pnpm publish --access public
```

**yarn**
```bash
# publish a package from `folder`, default to current directory 
yarn publish [folder]
# publish with a given tag
yarn publish --tag <tag>
# publish a scoped package as public
yarn publish --access public
```