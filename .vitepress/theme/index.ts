import 'virtual:windi.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from '@/components/Layout.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PersonalProjects from '@/components/PersonalProjects.vue'
import PubDate from '@/components/PubDate.vue'
import { createHead } from '@vueuse/head'

const head = createHead()

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp: ({ app }) => {
    app.component('TableOfContents', TableOfContents)
    app.component('PersonalProjects', PersonalProjects)
    app.component('PubDate', PubDate)
    app.use(head)
  }
} as Theme
