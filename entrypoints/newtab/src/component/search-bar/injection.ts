import type { SearchBarProvide } from './interface'
import type { InjectionKey } from 'vue'

export const SearchBarInjectionKey: InjectionKey<Partial<SearchBarProvide>> =
  Symbol('SearchBarInjectionKey')
