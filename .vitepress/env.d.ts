/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue3" />


declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'postcss-preset-env' {
  const preset: any
  export default preset
}
