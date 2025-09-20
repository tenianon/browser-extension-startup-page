<script setup lang="ts">
import bingIcon from '@/assets/bing.svg'
import googleIcon from '@/assets/google.svg'

import { SearchBar, SearchBarProvide } from '../../component/search-bar'

import type { SearchBarProps } from '../../component/search-bar/interface'
defineOptions({
  name: 'MainLayout',
})

const searchEngineList: SearchBarProps[] = [
  {
    id: 'google',
    icon: googleIcon,
    url: 'https://www.google.com/search?q=',
    getSuggestion: async (q) => {
      try {
        const response = await fetch(
          'https://suggestqueries.google.com/complete/search?client=chrome&q=' + q,
          { method: 'get' },
        )
        const data = await response.json()
        return data[1] || []
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        return []
      }
    },
  },
  {
    id: 'bing',
    icon: bingIcon,
    url: 'https://www.bing.com/search?q=',
    getSuggestion: async (q) => {
      try {
        const response = await fetch('https://api.bing.com/osjson.aspx?q=' + q, { method: 'get' })
        const data = await response.json()
        return data[1] || []
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        return []
      }
    },
  },
]
</script>
<template>
  <div class="flex justify-center">
    <SearchBarProvide :search-engine-list="searchEngineList">
      <template #default="{ searchEngineList }">
        <div
          v-for="(searchEngine, index) in searchEngineList"
          :key="searchEngine.id"
          class="absolute"
          :style="{ top: ` ${index * 80 + 200}px` }"
        >
          <SearchBar v-bind="searchEngine" />
        </div>
      </template>
    </SearchBarProvide>
  </div>
</template>
<style></style>
