import cx from 'clsx'
import type { ReactNode } from 'react'

import { Spinner } from '@/features/ui/spinner'

interface ButtonProps {
  children: ReactNode
  isDisabled?: boolean
  isLoading?: boolean
  /** @default 'button' */
  type?: 'button' | 'reset' | 'submit'
}

export function Button(props: ButtonProps): JSX.Element {
  const { children, isDisabled = false, isLoading = false, type = 'button' } = props

  return (
    <button
      className={cx(
        'inline-flex gap-2 items-center px-4 py-3 leading-none font-semibold justify-center text-sm rounded transition-colors focus:outline-none focus:ring-1',
        isDisabled
          ? 'bg-gray-100 text-gray-500 pointer-events-none focus:ring-gray-600'
          : 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light',
      )}
      disabled={isDisabled}
      type={type}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  )
}
