<template>
  <ul class="space-y-4 mt-28px">
    <li v-for="item in list" :key="item.link">
      <a :href="withBase(item.link)">{{ item.text }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
const { theme, page } = useData()
const list = computed(() =>
  theme.value.sidebar[`/${page.value.relativePath.split('/')[0]}/`]
)
</script>
