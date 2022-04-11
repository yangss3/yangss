<script lang="ts" setup>
defineProps<{ date: string }>()
</script>

<template>
  <p class="text-gray-400 dark:text-gray-600 flex items-center space-x-2 mb-24px">
    <mdi:calendar-month class="!top-1px" />
    <span>{{ date }}</span>
  </p>
</template>
