import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Label } from '@/features/ui/label'

interface CheckBoxProps extends Pick<ComponentPropsWithoutRef<'input'>, 'required'> {
  label: ReactNode
  name: string
}

export function CheckBox(props: CheckBoxProps): JSX.Element {
  const { label, name, required } = props

  return (
    <label className="my-1 w-full flex gap-1">
      <input
        className="rounded-md border border-gray-300 bg-white focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
        name={name}
        required={required}
        type="checkbox"
      />
      <Label as="span">{label}</Label>
    </label>
  )
}
