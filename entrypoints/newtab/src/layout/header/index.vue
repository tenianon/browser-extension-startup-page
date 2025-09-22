<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'
import { ref, computed, useTemplateRef } from 'vue'

import { CompButton } from '@/components'
import { PhMoonStars, PhDesktop, PhSun } from '@/components/icon'

import { toRefsPreferencesStore } from '../../stores'

const buttonRef = useTemplateRef<HTMLElement>('button')

const popoverRef = useTemplateRef<HTMLElement>('popover')

const themeModeList = [
  {
    icon: PhSun,
    value: 'light',
    label: 'Light',
  },
  {
    icon: PhMoonStars,
    value: 'dark',
    label: 'Dark',
  },
  {
    icon: PhDesktop,
    value: 'auto',
    label: 'System',
  },
] as const

const { themeMode } = toRefsPreferencesStore()

const showPopover = ref(false)

const currentThemeMode = computed(() => {
  return themeModeList.find((item) => item.value === themeMode.value)?.icon || 'auto'
})

const popoverClass = computed(() =>
  twMerge([
    'absolute right-4 mt-2 rounded bg-white p-1.5 shadow-md transition-[background-color,opacity,visibility] dark:bg-neutral-800',
    showPopover.value ? 'visible opacity-100' : 'invisible opacity-0',
  ]),
)

onClickOutside(
  popoverRef,
  () => {
    showPopover.value = false
  },
  {
    ignore: [buttonRef],
  },
)
</script>

<template>
  <div class="absolute top-0 right-0 p-4">
    <CompButton
      ref="button"
      size="xl"
      @click="showPopover = !showPopover"
    >
      <component :is="currentThemeMode" />
    </CompButton>

    <div
      ref="popover"
      :class="popoverClass"
    >
      <div
        v-for="item in themeModeList"
        :key="item.value"
        :class="[
          'flex min-w-28 cursor-pointer items-center rounded px-2 py-1.5 transition-[background-color,color] hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60',
          item.value === themeMode && 'text-violet-500',
        ]"
        @click="themeMode = item.value"
      >
        <component
          :is="item.icon"
          class="mr-1.5 size-5"
        />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
