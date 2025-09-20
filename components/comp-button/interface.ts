import type { ButtonHTMLAttributes } from 'vue'

export type CompButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface CompButtonProps {
  size?: CompButtonSize
  buttonProps?: ButtonHTMLAttributes
}
