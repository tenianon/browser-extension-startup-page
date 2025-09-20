import { Ref } from 'vue'

export interface SearchEngineProps {
  id: string
  icon?: string
  iconSize?: number
}

export interface SearchBoxProps {
  id: string
}

export interface SearchBoxEmits {
  search: [active?: boolean]
  input: [keyword: string]
  focus: [void]
  blur: [void]
}

export interface SearchSuggestionProps {
  id: string
  suggestionList?: string[]
  focused?: boolean
}

export interface SearchSuggestionEmits {
  search: [active?: boolean]
  select: [keyword: string]
}

export interface SearchBarProps extends SearchEngineProps, SearchSuggestionProps {
  url?: string
  getSuggestion?: (keyword: string) => Promise<string[]>
}

export interface SearchBarProvideProps {
  searchEngineList?: SearchBarProps[]
}

export interface SearchBarProvideSlots {
  default(props: { searchEngineList: SearchBarProps[] }): any
}

export interface SearchBarProvide {
  focusId?: Ref<string>
}
