import 'virtual:windi.css'
import './style/var.css'
import './style/base.css'
import './style/code.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from '@/components/Layout.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PersonalProjects from '@/components/PersonalProjects.vue'
import { createHead } from '@vueuse/head'

const head = createHead()

export default <Theme> {
  ...DefaultTheme,
  Layout,
  enhanceApp: ({ app }) => {
    app.component('TableOfContents', TableOfContents)
    app.component('PersonalProjects', PersonalProjects)
    app.use(head)
  }
}
