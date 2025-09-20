<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'

import type { CompButtonProps } from './interface'

const { size = 'md', ...buttonProps } = defineProps<CompButtonProps>()

const buttonClass = computed(() =>
  twMerge(
    'flex cursor-pointer items-center justify-center rounded-full transition-[background-color] hover:bg-neutral-200/80 dark:hover:bg-neutral-700/60',
    size === 'xs' && 'size-6 p-1',
    size === 'sm' && 'size-7 p-1',
    size === 'md' && 'size-8 p-1.5',
    size === 'lg' && 'size-9 p-2',
    size === 'xl' && 'size-10 p-2',
    size === '2xl' && 'size-11 p-2',
  ),
)
</script>
<template>
  <div>
    <button
      v-bind="buttonProps"
      :class="buttonClass"
    >
      <slot />
    </button>
  </div>
</template>
