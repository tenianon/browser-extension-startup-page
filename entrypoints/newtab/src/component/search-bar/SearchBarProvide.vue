<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'

import { SearchBarInjectionKey } from './injection'

import type { SearchBarProvideProps, SearchBarProvideSlots } from './interface'

defineOptions({
  inheritAttrs: false,
})

const { searchEngineList } = defineProps<SearchBarProvideProps>()

defineSlots<SearchBarProvideSlots>()

const focusId = ref(searchEngineList?.[0]?.id)

const idList = computed(() => searchEngineList?.map((item) => item.id))

provide(SearchBarInjectionKey, { focusId })

function windowKeyDown(e: KeyboardEvent) {
  if (e.shiftKey && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    const currentIndex = idList.value.indexOf(focusId.value)
    const len = idList.value.length
    focusId.value = idList.value[(currentIndex + 1) % len]
  }
}

onMounted(() => {
  window.addEventListener('keydown', windowKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', windowKeyDown)
})
</script>
<template>
  <slot :search-engine-list="searchEngineList" />
</template>
