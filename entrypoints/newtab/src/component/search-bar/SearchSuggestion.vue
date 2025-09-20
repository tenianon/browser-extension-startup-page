<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { PhMagnifyingGlass } from '@/components/icon'
import { useInjection } from '@/composables'

import { SearchBarInjectionKey } from './injection'

import type { SearchSuggestionProps, SearchSuggestionEmits } from './interface'

const { suggestionList, id, focused } = defineProps<SearchSuggestionProps>()

defineOptions({
  name: 'SearchSuggestion',
})

const emit = defineEmits<SearchSuggestionEmits>()

const { focusId } = useInjection(SearchBarInjectionKey)

const activeClass = `active-${id}`

const activeIndex = ref(-1)

const canKeyDownToSelect = ref(focused)

function scrollToActiveIndex() {
  nextTick(() => {
    const activeElement = document.querySelector(`.${activeClass}`)
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const handleSearch = (e: MouseEvent) => {
  e.preventDefault()
  emit('search', e.metaKey || e.ctrlKey)
}

function windowKeyDown(e: KeyboardEvent) {
  if (!(e.metaKey || e.ctrlKey) || isEmpty(suggestionList) || !canKeyDownToSelect.value) return

  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()

    const dir = e.key === 'ArrowUp' ? -1 : 1
    const len = suggestionList.length
    activeIndex.value = (activeIndex.value + dir + len) % len

    emit('select', suggestionList[activeIndex.value])

    scrollToActiveIndex()
  }
}

watch(
  () => suggestionList,
  () => {
    activeIndex.value = -1
  },
)

watch(
  () => focused,
  (value) => {
    canKeyDownToSelect.value = value
  },
)

onMounted(() => {
  window.addEventListener('keydown', windowKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', windowKeyDown)
})
</script>
<template>
  <div
    v-if="!isEmpty(suggestionList) && focusId === id"
    class="search-suggestion-scrollbar max-h-96 cursor-pointer overflow-x-hidden last:rounded-b-md"
    @mouseenter="canKeyDownToSelect = true"
    @mouseleave="canKeyDownToSelect = false"
  >
    <div
      v-for="(item, index) in suggestionList"
      :key="item"
      class="flex items-center px-4 py-1.5"
      :class="{
        'bg-neutral-200/60 dark:bg-neutral-700/60': activeIndex === index,
        [activeClass]: activeIndex === index,
      }"
      @mouseenter="activeIndex = index"
      @click="handleSearch"
    >
      <div class="mr-2 size-5 shrink-0">
        <PhMagnifyingGlass />
      </div>
      <span>{{ item }}</span>
    </div>
  </div>
</template>
<style>
@reference "tailwindcss";

.search-suggestion-scrollbar::-webkit-scrollbar {
  @apply w-1;
}

.search-suggestion-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.search-suggestion-scrollbar::-webkit-scrollbar-thumb {
  @apply cursor-pointer rounded-br-md bg-neutral-200;
}

.dark .search-suggestion-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-neutral-700;
}

.search-suggestion-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-300/80;
}

.dark .search-suggestion-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-600/80;
}
</style>
