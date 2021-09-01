/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const fs = require('fs')
const path = require('path')

/**
 * @param {string} p
 */
const resolvePath = p => path.resolve(__dirname, p)
/**
 * @param {string} filePath
 */
function getTitle (filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return /^#\s(?<title>.+)/.exec(content.trimLeft()).groups?.title
}
/**
 * @param {string} dir
 */
function generateSidebar (dir) {
  const files = fs.readdirSync(resolvePath(`../${dir}`))
  return files
    .filter(f1 => f1 !== 'index.md')
    .map(f2 => ({
      text: getTitle(resolvePath(`../${dir}/${f2}`)),
      link: `/${dir}/${f2.slice(0, -3)}`
    }))
}


/**
 * @type {import('vitepress').DefaultTheme.Config['nav']}
 */
const nav = [
  { text: 'Projects', link: '/projects', activeMatch: '^/projects' },
  { text: 'Articles', link: '/articles/', activeMatch: '^/articles/' },
  { text: 'Notes', link: '/notes/', activeMatch: '^/notes/' }
]

/**
 * @type {import('vitepress').DefaultTheme.Config['sidebar']}
 */
const sidebar = {
  '/notes/': generateSidebar('notes'),
  '/articles/': generateSidebar('articles')
}

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  base: '/yangss/',
  title: 'YangSS',
  description: "Nicholas Yang's personal blog.",
  /**
   * @type {import('vitepress').DefaultTheme.Config}
   */
  themeConfig: {
    nav,
    sidebar
  }
}
