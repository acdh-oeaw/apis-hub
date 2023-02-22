import cx from 'clsx'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
}
export function Separator(props: SeparatorProps): JSX.Element {
  const { orientation = 'vertical' } = props

  return (
    <div
      className={cx(orientation === 'vertical' ? 'mx-2 w-0 border-l' : 'my-2 h-0 border-t')}
      role="separator"
    />
  )
}
