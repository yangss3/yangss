// @ts-check

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
  '/notes/': [
    { text: 'Nginx', link: '/notes/nginx' },
    { text: 'Git', link: '/notes/git' }
  ]
}

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'yangss',
  /**
   * @type {import('vitepress').DefaultTheme.Config}
   */
  themeConfig: {
    nav,
    sidebar
  }
}
