<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { ref } from 'vue'
import { browser } from 'wxt/browser'

import { useInjection } from '@/composables'

import { SearchBarInjectionKey } from './injection'
import SearchBox from './SearchBox.vue'
import SearchEngine from './SearchEngine.vue'
import SearchSuggestion from './SearchSuggestion.vue'

import type { SearchBarProps, SearchBoxEmits, SearchSuggestionEmits } from './interface'
import type { EmitFn } from 'vue'

const { icon, id, iconSize, url, getSuggestion } = defineProps<SearchBarProps>()

defineOptions({
  inheritAttrs: false,
})

const { focusId } = useInjection(SearchBarInjectionKey)

const keyword = ref('')

const isFocus = ref(false)

const suggestionList = ref<string[]>([])

const onSearch: EmitFn<SearchBoxEmits['search']> = (active) => {
  if (isEmptyKeyword()) {
    return
  }

  if (active) {
    browser.tabs.create({
      url: url + keyword.value,
      active: true,
    })
  } else {
    browser.tabs.update({
      url: url + keyword.value,
    })
  }
}

const onInput: EmitFn<SearchBoxEmits['input']> = async (value) => {
  if (isEmpty(value.trim()) || isEmptyKeyword()) {
    suggestionList.value = []

    return
  }
  suggestionList.value = await getSuggestion(value)
}

const onSelect: EmitFn<SearchSuggestionEmits['select']> = (value) => {
  keyword.value = value
}

const onFocus = () => {
  isFocus.value = true
  focusId.value = id
}

function isEmptyKeyword() {
  return isEmpty(keyword.value.trim())
}
</script>
<template>
  <div
    class="relative flex flex-col rounded-md bg-neutral-50 shadow transition-[background-color] dark:bg-neutral-800"
    style="width: 500px"
    :class="{
      'z-50': id === focusId,
    }"
  >
    <div class="relative flex h-14 items-center rounded-md pr-2.5 pl-3.5 outline-0">
      <SearchEngine
        :icon="icon"
        :id="id"
        :icon-size="iconSize"
      />
      <SearchBox
        :id="id"
        v-model="keyword"
        @search="onSearch"
        @input="onInput"
        @focus="onFocus"
        @blur="isFocus = false"
      />
    </div>
    <SearchSuggestion
      :id="id"
      :focused="isFocus"
      :suggestion-list="suggestionList"
      @select="onSelect"
      @search="onSearch"
    />
  </div>
</template>
