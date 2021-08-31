<template>
  <Layout>
    <template #navbar-search>
      <div class="flex space-x-5 ml-5">
        <IconBtn title="Bookmarks" route="/bookmarks">
          <mdi:bookmark-outline />
        </IconBtn>
        <IconBtn title="GitHub" link="https://github.com/yangss3">
          <eva:github-outline />
        </IconBtn>
        <DarkModeSwitch />
      </div>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>
