# Package Manager

## Run a command

**npm**
```bash
# run from remote
npx <pkg>[@<ver>] [args...]
npm exec -- <pkg>[@<ver>] [args...]
npm init <pkg-suffix-name>[@<ver>] [args...] # only for packages with `create-` prefix
# run from local
npx <cmd> [args...]
npm exec -- <cmd> [args...]
```

**pnpm**
```bash
# run from remote
pnpm dlx <pkg>[@<ver>] [args...]
# run from local
pnpm exec <cmd> [args...]
# run from remote, only for packages with prefix `create-`
pnpm create <pkg-suffix-name>[@<ver>] [args...]
```

**yarn**
```bash
# run from remote, only for packages with prefix `create-`
yarn create <pkg-suffix-name>[@<ver>] [args...]
# run from local
yarn <cmd> [args...]
```

## Install packages

**npm**
```bash
# install all dependencies
npm install
# install packages in dependencies
npm install <pkg>[@<ver>] [<pkg>...]
# install packages in devDependencies
npm install -D <pkg>[@<ver>] [<pkg>...]
# install packages globally
npm install -g <pkg>[@<ver>] [<pkg>...]
```

**pnpm**
```bash
# install all dependencies
pnpm install
# install packages in dependencies
pnpm add <pkg>[@<ver>] [<pkg>...]
# install packages in devDependencies
pnpm add -D <pkg>[@<ver>] [<pkg>...]
# install packages globally
pnpm add -g <pkg>[@<ver>] [<pkg>...]
```

**yarn**
```bash
# install all dependencies
yarn install
# install packages in dependencies
yarn add <pkg>[@<ver>] [<pkg>...]
# install packages in devDependencies
yarn add -D <pkg>[@<ver>] [<pkg>...]
# install packages globally
yarn global add <pkg>[@<ver>] [<pkg>...]
```

## Update packages
Update packages to the latest version based on the specified range

**npm**
```bash
# update all deps in project
npm update
# update the specified packages
npm update <pkg> [<pkg>...]
```

**pnpm**
```bash
# update all deps in project
pnpm update
# update the specified packages
pnpm update <pkg> [<pkg>...]
# update to the latest version, ignore the range specified in package.json
pnpm update --latest [<pkg>...]
```

**yarn**
```bash
# update all deps in project
yarn upgrade
# update the specified packages
yarn upgrade <pkg> [<pkg>...]
# update to the latest version, ignore the range specified in package.json
yarn upgrade --latest [<pkg>...]
```

## Remove packages

**npm**
```bash
# remove packages locally
npm uninstall <pkg> [<pkg>...]
# remove packages globally
npm uninstall -g <pkg> [<pkg>...]
```

**pnpm**
```bash
# remove packages locally
pnpm remove <pkg> [<pkg>...]
# remove packages globally
pnpm remove --global <pkg> [<pkg>...]
```

**yarn**
```bash
# remove packages locally
yarn remove <pkg> [<pkg>...]
# remove packages globally
yarn global remove <pkg> [<pkg>...]
```

## Publish a package

**npm**
```bash
# publish a package from <folder>, default to current directory
npm publish [<folder>]
# publish with a given tag
npm publish --tag <tag>
# publish a scoped package as public
npm publish --access public
```

**pnpm**
```bash
# publish a package from <folder>, default to current directory
pnpm publish [<folder>]
# publish with a given tag
pnpm publish --tag <tag>
# recursive publish all packages
pnpm -r publish
# publish a scoped package as public
pnpm publish --access public
```

**yarn**
```bash
# publish a package from <folder>, default to current directory
yarn publish [<folder>]
# publish with a given tag
yarn publish --tag <tag>
# publish a scoped package as public
yarn publish --access public
```

## Symlink a package folder

**npm**
```bash
# create a global link for current working directory
npm link
# link a package from global node_modules
npm link <pkg>
```

**pnpm**
```bash
# create a global link for current working directory
# or a directory specified by --dir option
pnpm link --global [--dir <directory>]
# link a package from global node_modules to current working directory
# or a directory specified by --dir option
pnpm link --global <pkg> [--dir <directory>]
# link a package from <dir> folder to current working directory
# or a directory specified by --dir option
pnpm link <dir> [--dir <directory>]
# remove all symlink or specified by <pkg>
pnpm unlink [<pkg>]
```

**yarn**
```bash
# create a global link for current working directory
yarn link
# link a package from global node_modules
yarn link <pkg>
```

## Check for outdated packages

```bash
npm outdated
pnpm outdated
yarn outdated
```