<script setup lang="ts">
import type { SearchEngineProps } from './interface'

const { id, icon, iconSize = 30 } = defineProps<SearchEngineProps>()
</script>

<template>
  <div
    class="flex items-center"
    :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
  >
    <img
      :src="icon"
      class="size-full object-cover"
      :alt="id"
    />
  </div>
</template>
