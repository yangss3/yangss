import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vitepress'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import PostCSSPresetEnv from 'postcss-preset-env'

const resolvePath = (p: string) => path.resolve(__dirname, p)

function getFileInfo(filePath: string) {
  const content = fs.readFileSync(resolvePath(`../${filePath}`), 'utf-8')
  const groups = /^#\s+(?<title>.+)\s+(?:<PubDate.+"(?<date>.+)".*>|.*)/.exec(content.trimStart())?.groups
  return {
    text: groups?.title || '',
    date: groups?.date || '2000/01/01',
    link: `/${filePath.slice(0, -3)}`
  }
}

function generateSidebar(dir: string) {
  const files = fs.readdirSync(resolvePath(`../${dir}`))
  return files
    .filter(f1 => f1 !== 'index.md')
    .map(f2 => getFileInfo(`${dir}/${f2}`))
    .sort((i1, i2) => +new Date(i2.date) - +new Date(i1.date))
}


const nav = [
  { text: 'Articles', link: '/articles/', activeMatch: '^/articles/' },
  { text: 'Notes', link: '/notes/', activeMatch: '^/notes/' },
  { text: 'Projects', link: '/projects', activeMatch: '^/projects' }
]


const sidebar = {
  '/notes/': generateSidebar('notes'),
  '/articles/': generateSidebar('articles')
}


export default defineConfig({
  base: '/yangss/',
  title: 'YangSS',
  description: 'Nicholas Yang\'s personal blog.',
  themeConfig: {
    docsDir: './',
    nav,
    sidebar
  },
  vite: {
    server: {
      port: 8080
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.vitepress/theme')
      }
    },
    css: {
      postcss: {
        plugins: [PostCSSPresetEnv({ stage: 1 })]
      }
    },
    plugins: [
      Components({
        dirs: ['.vitepress/theme/components'],
        extensions: ['vue', 'ts'],
        resolvers: [
          IconsResolver({ componentPrefix: '' })
        ],
        dts: true
      }),
      Icons({
        defaultClass: 'relative top-2px'
      }),
      WindiCSS()
    ]
  }
})
