<script setup lang="ts">
import { isEmpty, throttle } from 'lodash-es'
import { nextTick, ref, useTemplateRef, watch } from 'vue'

import { CompButton } from '@/components'
import { PhX, PhMagnifyingGlass } from '@/components/icon'
import { useInjection } from '@/composables'

import { SearchBarInjectionKey } from './injection'

import type { SearchBoxEmits, SearchBoxProps } from './interface'

const { id } = defineProps<SearchBoxProps>()

const model = defineModel({ type: String })

const emits = defineEmits<SearchBoxEmits>()

const { focusId } = useInjection(SearchBarInjectionKey)

const textareaId = `search-box-${id}`

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea')

const isComposing = ref(false)

const onTextareaCompositionStart = () => {
  isComposing.value = true
}

const onTextareaCompositionEnd = () => {
  isComposing.value = false
  emitsInput()
}

const onTextareaKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !isComposing.value && !e.shiftKey) {
    e.preventDefault()
    const isActive = e.metaKey || e.ctrlKey
    emitsSearch(isActive)
  }
}

const handleClear = () => {
  model.value = ''
  emitsInput()
}

const handleSearch = (e: MouseEvent) => {
  emitsSearch(e.metaKey || e.ctrlKey)
}

const onTextareaInput = throttle(() => {
  emitsInput()
}, 300)

function emitsInput() {
  emits('input', model.value)
}

function emitsSearch(active?: boolean) {
  emits('search', active)
}

watch(focusId, (value) => {
  if (value === id) {
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
})
</script>

<template>
  <form class="h-full flex-1">
    <div class="flex h-full items-center">
      <div class="relative mx-1 h-full flex-1">
        <div
          class="absolute bottom-1 left-0 w-full rounded-t-md bg-neutral-50 transition-[background-color] dark:bg-neutral-800"
        >
          <div class="search-box-wrap relative my-3 mr-1.5 ml-3 max-h-36 overflow-hidden">
            <textarea
              ref="textarea"
              :id="textareaId"
              class="search-box-scrollbar absolute top-0 left-0 m-0 size-full min-h-6 min-w-0 resize-none bg-transparent pr-px align-bottom text-base break-words whitespace-pre-wrap outline-0 dark:caret-neutral-400"
              v-model="model"
              autofocus
              autocomplete="off"
              @compositionstart="onTextareaCompositionStart"
              @compositionend="onTextareaCompositionEnd"
              @keydown="onTextareaKeyDown"
              @input="onTextareaInput"
              @focus="emits('focus')"
              @blur="emits('blur')"
            />
            <div
              class="search-box-scrollbar pointer-events-none invisible m-0 size-full min-h-6 min-w-0 pr-[5px] align-bottom text-base break-words whitespace-pre-wrap"
            >
              {{ model }}
            </div>
          </div>
        </div>
      </div>
      <CompButton
        class="transition-[opacity,scale]"
        :class="isEmpty(model) ? 'scale-0 opacity-0' : 'scale-100 opacity-100'"
        size="sm"
        @click.prevent="handleClear"
      >
        <PhX />
      </CompButton>
      <CompButton
        class="ml-1"
        size="xl"
        @click.prevent="handleSearch"
      >
        <PhMagnifyingGlass />
      </CompButton>
    </div>
  </form>
</template>
<style scoped>
@reference "tailwindcss";

.search-box-scrollbar {
  scrollbar-gutter: stable;
}

.search-box-scrollbar::-webkit-scrollbar {
  @apply w-1;
}

.search-box-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.search-box-scrollbar::-webkit-scrollbar-thumb {
  @apply cursor-pointer rounded bg-neutral-200;
}

.dark .search-box-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-neutral-700;
}

.search-box-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-300/80;
}

.dark .search-box-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-600/80;
}
</style>
