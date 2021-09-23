<template>
  <p class="text-gray-300 dark:text-gray-600 flex items-center space-x-2 mb-24px">
    <icon-park-outline:calendar class="top-1px" />
    <span>{{ date }}</span>
  </p>
</template>

<script lang="ts" setup>
defineProps<{ date: string }>()
</script>
