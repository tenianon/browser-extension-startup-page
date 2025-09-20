import { useStorage, useColorMode } from '@vueuse/core'
import { defineStore, acceptHMRUpdate, storeToRefs } from 'pinia'
import { computed } from 'vue'

import { pinia } from '.'

import type { ComputedRef } from 'vue'

export interface PreferencesOptions {}

export const DEFAULT_PREFERENCES_OPTIONS = {} as const

const DEFAULT_THEME_COLOR = '#8e51ff'

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

  const themeColor = useStorage<string>('theme-color', DEFAULT_THEME_COLOR)

  const themeMode = useColorMode({
    emitAuto: true,
    storageKey: 'theme-mode',
    disableTransition: false,
  })

  const isDark = computed(() => themeMode.state.value === 'dark')

  const computedPreferences = Object.fromEntries(
    Object.entries(preferences.value).map(([key]) => [
      key,
      computed(() => preferences.value[key as keyof PreferencesOptions]),
    ]),
  ) as { [K in keyof PreferencesOptions]: ComputedRef<PreferencesOptions[K]> }

  const reset = () => {
    preferences.value = structuredClone(DEFAULT_PREFERENCES_OPTIONS)
    themeColor.value = DEFAULT_THEME_COLOR
    themeMode.value = 'auto'
  }

  return {
    themeColor,
    themeMode,
    isDark,
    preferences,
    ...computedPreferences,
    reset,
  }
})

export function toRefsPreferencesStore() {
  return {
    ...storeToRefs(usePreferencesStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
