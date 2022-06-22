import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import cx from 'clsx'
import type { ReactNode } from 'react'
import { Fragment, useState } from 'react'

import { Label } from '@/features/ui/label'
import { useIntersectionObserver } from '@/lib/use-intersection-observer'

interface Option {
  id: number | string
}

interface SelectProps<T extends Option> {
  getOptionLabel: (option: T) => string
  isLoading?: boolean
  label: ReactNode
  name: string
  onChange: (value: T) => void
  onLoadMore?: () => void
  options: Array<T>
  placeholder?: string
  value: T | null
}

export function Select<T extends Option>(props: SelectProps<T>): JSX.Element {
  const {
    getOptionLabel,
    // isLoading,
    label,
    name,
    onChange: setSelectedOption,
    onLoadMore,
    options,
    placeholder = 'Select an option',
    value: selectedOption,
  } = props

  const shouldDisplayPlaceholder = selectedOption == null

  const [loadMoreElement, setLoadMoreElement] = useState<HTMLLIElement | null>(null)
  useIntersectionObserver(loadMoreElement, onLoadMore)

  return (
    <Fragment>
      <Listbox as="div" onChange={setSelectedOption} value={selectedOption}>
        {({ open }) => {
          return (
            <Fragment>
              <Label as={Listbox.Label}>{label}</Label>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light">
                  <span
                    className={cx('block truncate', shouldDisplayPlaceholder && 'text-gray-500')}
                  >
                    {shouldDisplayPlaceholder ? placeholder : getOptionLabel(selectedOption)}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon aria-hidden className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                {options.length > 0 ? (
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {options.map((option) => {
                        const label = getOptionLabel(option)

                        return (
                          <Listbox.Option key={option.id} as={Fragment} value={option}>
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
                          </Listbox.Option>
                        )
                      })}
                      <li ref={setLoadMoreElement} role="presentation" />
                    </Listbox.Options>
                  </Transition>
                ) : null}
              </div>
            </Fragment>
          )
        }}
      </Listbox>
      {selectedOption != null ? (
        <input name={name} type="hidden" value={selectedOption.id} />
      ) : null}
    </Fragment>
  )
}
