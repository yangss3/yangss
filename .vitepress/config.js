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
function getFileInfo (filePath) {
  const content = fs.readFileSync(resolvePath(`../${filePath}`), 'utf-8')
  const groups = /^#\s+(?<title>.+)\s+(?:<PubDate.+"(?<date>.+)".*>|.*)/.exec(content.trimLeft()).groups
  return {
    text: groups.title,
    date: groups.date || '2000/01/01',
    link: `/${filePath.slice(0, -3)}`
  }
}
/**
 * @param {string} dir
 */
function generateSidebar (dir) {
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

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  base: '/yangss/',
  title: 'YangSS',
  description: "Nicholas Yang's personal blog.",
  themeConfig: {
    nav,
    sidebar
  }
}
