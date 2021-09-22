<template>
  <Layout>
    <template #navbar-search>
      <div class="flex space-x-5 ml-5">
        <IconBtn title="Bookmarks" :route="withBase('/bookmarks')">
          <mdi:bookmark-outline />
        </IconBtn>
        <IconBtn title="GitHub" href="https://github.com/yangss3">
          <eva:github-outline />
        </IconBtn>
        <DarkModeSwitch />
      </div>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { withBase } from 'vitepress'
import { useHead } from '@vueuse/head'
const { Layout } = DefaultTheme
useHead({
  link: [
    { rel: 'icon', href: withBase('/favicon.ico') }
  ]
})
</script>

<style>
@import '../style/var.css';
@import '../style/base.css';
@import '../style/code.css';
</style>
