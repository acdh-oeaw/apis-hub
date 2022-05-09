import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import cx from 'clsx'
import type { ReactNode } from 'react'
import { Fragment, useState } from 'react'

import { createBooleanDataAttribute } from '@/lib/create-boolean-data-attribute'
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
              <Listbox.Label className="block text-xs font-medium text-gray-700">
                {label}
              </Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light text-sm">
                  <span
                    className={cx('block truncate', shouldDisplayPlaceholder && 'text-gray-500')}
                  >
                    {shouldDisplayPlaceholder ? placeholder : getOptionLabel(selectedOption)}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                    <Listbox.Options className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                      {options.map((option) => {
                        return (
                          <Listbox.Option key={option.id} as={Fragment} value={option}>
                            {({ active, selected }) => {
                              const label = getOptionLabel(option)

                              return (
                                <li
                                  className={cx(
                                    active ? 'text-white bg-primary' : 'text-gray-900',
                                    'cursor-default select-none relative py-2 pl-3 pr-9',
                                  )}
                                  data-active={createBooleanDataAttribute(active)}
                                  data-selected={createBooleanDataAttribute(selected)}
                                >
                                  <span
                                    className={cx(selected && 'font-semibold', 'block truncate')}
                                    title={label}
                                  >
                                    {label}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={cx(
                                        active ? 'text-white' : 'text-primary',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon aria-hidden className="h-5 w-5" />
                                    </span>
                                  ) : null}
                                </li>
                              )
                            }}
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
