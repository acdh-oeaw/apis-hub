import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import type { ReactNode } from 'react'
import { Fragment, useState } from 'react'

import { Label } from '@/features/ui/label'
import { useIntersectionObserver } from '@/lib/use-intersection-observer'

interface Option {
  id: number | string
}

interface ComboBoxProps<T extends Option> {
  getOptionLabel: (option: T) => string
  initialValue?: T
  isLoading?: boolean
  label: ReactNode
  name: string
  onInputChange: (value: string) => void
  onLoadMore?: () => void
  options: Array<T>
  placeholder?: string
}

export function ComboBox<T extends Option>(props: ComboBoxProps<T>): JSX.Element {
  const {
    getOptionLabel,
    initialValue = null,
    // isLoading,
    label,
    name,
    onInputChange,
    onLoadMore,
    options,
    placeholder,
  } = props

  const [selectedOption, setSelectedOption] = useState<T | null>(initialValue)

  const [loadMoreElement, setLoadMoreElement] = useState<HTMLLIElement | null>(null)
  useIntersectionObserver(loadMoreElement, onLoadMore)

  return (
    <Fragment>
      <Combobox as="div" nullable onChange={setSelectedOption} value={selectedOption}>
        {({ open }) => {
          return (
            <Fragment>
              <Label as={Combobox.Label}>{label}</Label>
              <div className="relative mt-1">
                <Combobox.Input
                  autoComplete="off"
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm placeholder:text-gray-500 focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
                  displayValue={(option: T | null) => {
                    if (option == null) return ''
                    return getOptionLabel(option)
                  }}
                  onChange={(event) => {
                    onInputChange(event.currentTarget.value)
                  }}
                  placeholder={placeholder}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <SelectorIcon aria-hidden className="h-5 w-5 text-gray-400" />
                </Combobox.Button>
                {options.length > 0 ? (
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {options.map((option) => {
                        const label = getOptionLabel(option)

                        return (
                          <Combobox.Option key={option.id} as={Fragment} value={option}>
                            <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ui-active:bg-primary ui-active:text-white">
                              <span
                                className="block truncate ui-selected:font-semibold"
                                title={label}
                              >
                                {label}
                              </span>
                              <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-primary ui-selected:flex ui-active:text-white">
                                <CheckIcon aria-hidden className="h-5 w-5" />
                              </span>
                            </li>
                          </Combobox.Option>
                        )
                      })}
                      <li ref={setLoadMoreElement} role="presentation" />
                    </Combobox.Options>
                  </Transition>
                ) : null}
              </div>
            </Fragment>
          )
        }}
      </Combobox>
      {selectedOption != null ? (
        <input name={name} type="hidden" value={selectedOption.id} />
      ) : null}
    </Fragment>
  )
}
