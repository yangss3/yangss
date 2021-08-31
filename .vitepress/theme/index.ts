import 'virtual:windi.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from '@/components/Layout.vue'
import './style/var.css'
import './style/base.css'
import './style/code.css'

export default <Theme> {
  ...DefaultTheme,
  Layout
}
