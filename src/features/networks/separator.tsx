import cx from 'clsx'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
}
export function Separator(props: SeparatorProps): JSX.Element {
  const { orientation = 'vertical' } = props

  return (
    <div
      className={cx(orientation === 'vertical' ? 'w-0 mx-2 border-l' : 'h-0 my-2 border-t')}
      role="separator"
    />
  )
}
