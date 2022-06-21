import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import type { FormEvent } from 'react'
import { Fragment, useEffect, useMemo, useState } from 'react'

import {
  useGetApisRelations,
  useGetInfiniteApisEntitySuggestionsByType,
  useGetInfiniteApisRelationTypes,
} from '@/features/apis/api'
import type { ApisLabeledEntitytype } from '@/features/apis/constants'
import { entityTypes } from '@/features/apis/constants'
import { shouldReverseRelation } from '@/features/apis/sort-entity-types'
import type { ApisEntityType, ApisRelation } from '@/features/apis/types'
import { useGraphs } from '@/features/networks/graphs.context'
import styles from '@/features/networks/search-bar.module.css'
import type { SearchFilters } from '@/features/networks/use-search-filters'
import { useSearchFilters } from '@/features/networks/use-search-filters'
import { toast } from '@/features/toast/toast'
import { Button } from '@/features/ui/button'
import { ComboBox } from '@/features/ui/combobox'
import { Select } from '@/features/ui/select'
import { useDialogState } from '@/features/ui/use-dialog-state'
import { createKey } from '@/lib/create-key'
import { useDebouncedValue } from '@/lib/use-debounced-value'
import type { ApisInstanceConfig } from '~/config/apis.config'
import { colors } from '~/config/visualisation.config'

interface SearchBarProps {
  instance: ApisInstanceConfig
}

export function SearchBar(props: SearchBarProps): JSX.Element {
  const { instance } = props

  const toastId = 'apis-get-relations'

  const router = useRouter()
  useEffect(() => {
    return () => {
      toast.dismiss(toastId)
    }
  }, [router.asPath])

  const { addEdges } = useGraphs()
  const { searchFilters, setSearchFilters } = useSearchFilters()
  const dialog = useDialogState()
  const [dialogProps, setDialogProps] = useState({
    count: 0,
    onSuccess: dialog.close,
    onAbort: dialog.close,
  })
  const query = useGetApisRelations(instance, searchFilters, {
    enabled: searchFilters != null,
    onSuccess(data) {
      function onSuccess() {
        const hasMore = data.next != null
        const message = hasMore
          ? `Loaded ${data.offset + data.limit} of ${data.count} edges.`
          : `Loaded ${data.count} edges.`

        if (toast.isActive(toastId)) {
          if (hasMore) {
            toast.update(toastId, { isLoading: true, render: message, type: 'default' })
          } else {
            toast.update(toastId, {
              autoClose: 5000,
              closeButton: true,
              isLoading: false,
              render: message,
              type: 'info',
            })
          }
        } else {
          if (hasMore) {
            toast.loading(message, { toastId, type: 'default' })
          } else {
            toast.info(message, { autoClose: 5000, closeButton: true, toastId })
          }
        }

        addEdges(instance.id, data.results, getEdgeLabel, getEdgeColor, getNodeLabel, getNodeColor)

        if (data.next != null) {
          setSearchFilters({ ...searchFilters, offset: data.offset + data.limit } as SearchFilters)
        }
      }

      if (data.offset === 0 && data.count >= 1000) {
        setDialogProps({
          count: data.count,
          onSuccess() {
            onSuccess()
            dialog.close()
          },
          onAbort() {
            dialog.close()
          },
        })
        dialog.open()
      } else {
        onSuccess()
      }
    },
    /**
     * When a query has previously been aborted by navigating away, we want to ensure all pages
     * are refetched. Otherwise, missing pages would never be requested when the first page has been cached.
     */
    staleTime: 0,
  })

  /** Keep button disabled as long as there are additional edges to fetch. */
  const isLoading = query.isFetching || query.data?.next != null

  return (
    <div className={styles['container']}>
      <SearchFiltersForm
        instance={instance}
        isLoading={isLoading}
        onChangeSearchFilters={setSearchFilters}
      />
      <WarningDialog
        count={dialogProps.count}
        isOpen={dialog.isOpen}
        onAbort={dialogProps.onAbort}
        onSuccess={dialogProps.onSuccess}
      />
    </div>
  )
}

interface WarningDialogProps {
  isOpen: boolean
  onAbort: () => void
  count: number
  onSuccess: () => void
}

function WarningDialog(props: WarningDialogProps): JSX.Element {
  const { isOpen, onAbort, count, onSuccess } = props

  return (
    <Transition.Root appear as={Fragment} show={isOpen}>
      <Dialog as="div" className="relative z-dialog" onClose={onAbort}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-dialog overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto grid max-w-2xl transform gap-4 divide-y divide-gray-100 overflow-hidden rounded-md bg-white p-4 shadow-2xl ring-1 ring-black/5 transition-all">
              <Dialog.Title className="text-sm">Warning</Dialog.Title>
              You are attempting to add {count} new edges to the graph. Do you want to continue or
              abort and refine your search query?
              <div className="justify-self-end">
                <Button onClick={onSuccess}>Continue</Button>
                <Button onClick={onAbort}>Abort</Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

interface SearchFiltersFormProps {
  instance: ApisInstanceConfig
  isLoading: boolean
  onChangeSearchFilters: (searchFilters: SearchFilters) => void
}

function SearchFiltersForm(props: SearchFiltersFormProps): JSX.Element {
  const { instance, isLoading, onChangeSearchFilters } = props

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const initialEntityType = Object.values(entityTypes)[0]!
  const [sourceEntityType, setSourceEntityType] = useState(initialEntityType)
  const [targetEntityType, setTargetEntityType] = useState(initialEntityType)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    // const sourceEntityType = formData.get('sourceEntityType')
    // const targetEntityType = formData.get('targetEntityType')
    // const relationType = formData.get('relationType')
    // const sourceEntity = formData.get('sourceEntity')
    // const targetEntity = formData.get('targetEntity')

    onChangeSearchFilters(Object.fromEntries(formData) as unknown as SearchFilters)

    event.preventDefault()
  }

  return (
    <form className={styles['form']} onSubmit={onSubmit} role="search">
      <EntityTypeSelect
        entityType={sourceEntityType}
        label="Source entity type"
        name="sourceEntityType"
        setEntityType={setSourceEntityType}
      />
      <EntityComboBox
        entityType={sourceEntityType.id}
        instance={instance}
        key={createKey('source', sourceEntityType.id)}
        label="Source entity"
        name="sourceEntity"
      />
      <RelationTypeComboBox
        instance={instance}
        key={createKey(sourceEntityType.id, targetEntityType.id)}
        label="Relation type"
        name="relationType"
        sourceEntityType={sourceEntityType.id}
        targetEntityType={targetEntityType.id}
      />
      <EntityTypeSelect
        entityType={targetEntityType}
        label="Target entity type"
        name="targetEntityType"
        setEntityType={setTargetEntityType}
      />
      <EntityComboBox
        entityType={targetEntityType.id}
        instance={instance}
        key={createKey('target', targetEntityType.id)}
        label="Target entity"
        name="targetEntity"
      />
      <Button isDisabled={isLoading} isLoading={isLoading} type="submit">
        Load
      </Button>
    </form>
  )
}

interface EntityTypeSelectProps {
  entityType: ApisLabeledEntitytype
  label: string
  name: string
  setEntityType: (entityType: ApisLabeledEntitytype) => void
}

function EntityTypeSelect(props: EntityTypeSelectProps): JSX.Element {
  const { entityType, label, name, setEntityType } = props

  const options = useMemo(() => {
    return Object.values(entityTypes)
  }, [])

  return (
    <Select
      getOptionLabel={(option) => {
        return option.label
      }}
      label={label}
      name={name}
      onChange={setEntityType}
      options={options}
      value={entityType}
    />
  )
}

interface EntityComboBoxProps {
  entityType: ApisEntityType
  instance: ApisInstanceConfig
  label: string
  name: string
}

function EntityComboBox(props: EntityComboBoxProps): JSX.Element {
  const { entityType, instance, label, name } = props

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim())
  const query = useGetInfiniteApisEntitySuggestionsByType(instance, {
    entityType,
    searchTerm: debouncedSearchTerm,
  })
  const suggestions = useMemo(() => {
    if (query.data == null) return []
    return query.data.pages.flatMap((page) => {
      return page.results
    })
  }, [query.data])

  return (
    <ComboBox
      getOptionLabel={(option) => {
        return option.text
      }}
      isLoading={query.isFetching}
      label={label}
      name={name}
      onInputChange={setSearchTerm}
      onLoadMore={query.fetchNextPage}
      options={suggestions}
    />
  )
}

interface RelationTypeComboBoxProps {
  instance: ApisInstanceConfig
  label: string
  name: string
  sourceEntityType: ApisEntityType
  targetEntityType: ApisEntityType
}

function RelationTypeComboBox(props: RelationTypeComboBoxProps): JSX.Element {
  const { instance, label, name, sourceEntityType, targetEntityType } = props

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedValue = useDebouncedValue(searchTerm)
  const query = useGetInfiniteApisRelationTypes(instance, {
    sourceEntityType,
    targetEntityType,
    searchTerm: debouncedValue,
  })
  const relationTypes = useMemo(() => {
    if (query.data == null) return []
    return query.data.pages.flatMap((page) => {
      return page.results
    })
  }, [query.data])
  const useReverseRelationLabel = shouldReverseRelation[sourceEntityType][targetEntityType]

  return (
    <ComboBox
      getOptionLabel={(option) => {
        /** Many relation types don't actually have a reverse label. */
        if (!option.name_reverse) return option.name
        /** Display both name and reverse name, since the api request searches on both. */
        if (useReverseRelationLabel) return `${option.name_reverse} (${option.name})`
        return `${option.name} (${option.name_reverse})`
      }}
      isLoading={query.isFetching}
      label={label}
      name={name}
      onInputChange={setSearchTerm}
      onLoadMore={query.fetchNextPage}
      options={relationTypes}
    />
  )
}

function getEdgeLabel(relation: ApisRelation): string {
  return relation.relation_type.label
}

function getNodeLabel(node: ApisRelation['source'] | ApisRelation['target']): string {
  return node.label
}

function getNodeColor(node: ApisRelation['source'] | ApisRelation['target']): string {
  return colors.node[node.type]
}

function getEdgeColor(_relation: ApisRelation): string {
  return colors.edge
}
