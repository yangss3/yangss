<script setup lang="ts">
import I18nIcon from '~icons/ion/language'
import ChartIcon from '~icons/mdi/chart-line'
import GitIcon from '~icons/la/git'
import WebhookIcon from '~icons/mdi/webhook'
import WeatherIcon from '~icons/ion/partly-sunny-outline'
import LineBreakIcon from '~icons/la/tools'
import CreateAppIcon from '~icons/carbon/template'
import ESlintIcon from '~icons/mdi/eslint'
import ToolBox from '~icons/mdi/toolbox-outline'

import { shallowRef } from 'vue'
const projects = shallowRef([
  {
    name: 'vue3-i18n',
    repo: 'https://github.com/yangss3/vue3-i18n',
    icon: I18nIcon,
    description: 'A simple i18n plugin for Vue 3'
  },
  {
    name: 'create-app',
    repo: 'https://github.com/yangss3/create-app',
    icon: CreateAppIcon,
    description: 'Scaffolding Vite & TS projects with some pre-configured features'
  },
  {
    name: 'vue-echarts',
    repo: 'https://github.com/yangss3/vue-echarts',
    icon: ChartIcon,
    description: 'A few simple ECharts components for Vue'
  },
  {
    name: 'utils',
    repo: 'https://github.com/yangss3/utils',
    icon: ToolBox,
    description: 'A collection of common JavaScript & TypeScript utilities'
  },
  {
    name: 'init-git-repo',
    repo: 'https://github.com/yangss3/init-git-repo',
    icon: GitIcon,
    description: 'Add some features like lint staged files and conventional commits for git repo'
  },
  {
    name: 'webhooks-server',
    repo: 'https://github.com/yangss3/webhooks-server',
    icon: WebhookIcon,
    description: 'An auto deployment tool for front-end projects based on Github webhooks and Nodejs'
  },
  {
    name: 'weather-cli',
    repo: 'https://github.com/yangss3/weather-cli',
    icon: WeatherIcon,
    description: 'Weather query in command line based on node'
  },
  {
    name: 'remove-line-breaks',
    repo: 'https://github.com/yangss3/remove-line-breaks',
    icon: LineBreakIcon,
    description: 'Remove line breaks from text in the system clipboard'
  },
  {
    name: 'eslint-config',
    repo: 'https://github.com/yangss3/eslint-config',
    icon: ESlintIcon,
    description: 'My own eslint configurations for JS, TS and Vue'
  }
])
</script>

<template>
  <div class="grid gap-x-4 md:grid-cols-2 sm:grid-cols-1">
    <div v-for="(p, i) in projects" :key="i" class="p-4 flex flex transition-colors duration-800 text-gray-500 dark:hover:text-gray-200 hover:text-[#0ebdd1fc]">
      <div class="text-32px mr-5 pt-2">
        <component :is="p.icon" />
      </div>
      <div>
        <div class="text-20px leading-40px font-bold">
          <a
            :href="p.repo"
            target="_blank"
            class="hover:text-[#0ebdd1fc]"
            style="--c-brand: ''"
          >{{ p.name }}</a>
        </div>
        <div class="italic">
          {{ p.description }}
        </div>
      </div>
    </div>
  </div>
</template>
