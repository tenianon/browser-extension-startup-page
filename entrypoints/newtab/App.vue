<script setup lang="tsx">
import noisePng from '@/assets/noise.png'
import topographySvg from '@/assets/topography.svg'

import HeaderLayout from './src/layout/header/index.vue'
import MainLayout from './src/layout/main/index.vue'
</script>
<template>
  <div
    class="relative h-svh overflow-hidden bg-neutral-100 transition-[background-color] dark:bg-neutral-900"
  >
    <div
      class="pointer-events-none fixed inset-0 size-full bg-neutral-200/35 transition-[background-color] dark:bg-neutral-800/45"
      :style="{
        'mask-image': `url(${topographySvg})`,
        '-webkit-mask-image': `url(${topographySvg})`,
        'mask-repeat': 'repeat',
        'mask-size': '600px 600px',
        '-webkit-mask-repeat': 'repeat',
        '-webkit-mask-size': '600px 600px',
      }"
    />
    <div
      class="pointer-events-none fixed inset-0 z-[99998] size-full"
      :style="{
        backgroundImage: `url(${noisePng})`,
        opacity: 0.02,
      }"
    />
    <HeaderLayout />
    <MainLayout />
  </div>
</template>
