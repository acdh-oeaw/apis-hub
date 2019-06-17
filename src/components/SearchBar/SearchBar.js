import React, { useState, useEffect } from 'react'
import matchSorter from 'match-sorter'

import {
  useApi,
  fetchRelations,
  fetchRelationTypes,
  fetchAutoComplete,
} from '../../contexts/api'

import AutoComplete from '../AutoComplete/AutoComplete'

import Button from '../../elements/Button/Button'
import Select from '../../elements/Select/Select'
import Spinner from '../../elements/Spinner/Spinner'

import styles from './SearchBar.module.css'

import { entities, relations } from '../../utils/api'
import classNames from '../../utils/class-names'

const SearchBar = ({ className, ...rest }) => {
  const [source, setSource] = useState(entities[0])
  const [target, setTarget] = useState(entities[0])

  const [relationType, setRelationType] = useState()
  const [sourceEntity, setSourceEntity] = useState()
  const [targetEntity, setTargetEntity] = useState()

  const [
    {
      relationTypes: {
        byId: relationTypesById,
        byEntityType: relationTypesByEntity,
        meta: { isLoading: isLoadingRelationTypes },
      },
      relations: {
        meta: { isLoading: isLoadingRelations },
      },
      autoComplete: {
        meta: { isLoading: isAutoCompleteLoading },
        byEntityType: autoCompleteByEntity,
      },
    },
    dispatch,
  ] = useApi()

  const storedRelationTypes = relationTypesByEntity[source][target]
  const reverse = relations[source][target]
  const relationTypeNames = storedRelationTypes
    ? storedRelationTypes
        .map(id => ({
          id,
          name: relationTypesById[id][reverse ? 'name_reverse' : 'name'],
        }))
        .filter(Boolean)
    : []

  useEffect(() => {
    const storedRelationTypes = relationTypesByEntity[source][target]
    if (!storedRelationTypes) {
      fetchRelationTypes(dispatch, source, target)
    }
  }, [dispatch, source, target, relationTypesByEntity])

  useEffect(() => {
    // FIXME: This only works when we fetch *all* autocompletes per entity type in one go
    const storedSourceAutoCompletes = autoCompleteByEntity[source]
    if (!storedSourceAutoCompletes && !isAutoCompleteLoading) {
      fetchAutoComplete(dispatch, source)
    }
    const storedTargetAutoCompletes = autoCompleteByEntity[target]
    if (!storedTargetAutoCompletes && !isAutoCompleteLoading) {
      fetchAutoComplete(dispatch, target)
    }
  }, [dispatch, autoCompleteByEntity, source, target, isAutoCompleteLoading])

  const onSelectSource = event => {
    if (event.target.value !== source) {
      setSourceEntity(null)
    }
    setSource(event.target.value)
  }

  const onSelectSourceEntity = selected => {
    setSourceEntity(selected && selected.id)
  }

  const onSelectTargetEntity = selected => {
    setTargetEntity(selected && selected.id)
  }

  const onSelectRelationType = event => {
    setRelationType(event.target.value)
  }

  const onSelectTarget = event => {
    if (event.target.value !== target) {
      setTargetEntity(null)
    }
    setTarget(event.target.value)
  }

  const onFormSubmit = event => {
    event.preventDefault()
    fetchRelations({
      dispatch,
      from: source,
      to: target,
      relationType,
      sourceEntity,
      targetEntity,
    })
  }

  const getItems = allItems => filter =>
    filter
      ? matchSorter(allItems || [], filter, { keys: [`text`] })
      : allItems || []

  return (
    <div className={classNames(styles.SearchBar, className)} {...rest}>
      <form className={styles.SearchForm} onSubmit={onFormSubmit}>
        <Select
          className={styles.Select}
          onSelect={onSelectSource}
          options={entities}
          selected={source}
        />
        <AutoComplete
          className={styles.AutoComplete}
          getItems={getItems(autoCompleteByEntity[source])}
          itemToString={item => (item ? item.text : '')}
          placeholder={`All ${source}s`}
          onSubmit={onSelectSourceEntity}
          selectedItem={sourceEntity}
        />
        <Select
          className={styles.Select}
          isDisabled={isLoadingRelationTypes || !relationTypeNames.length}
          onSelect={onSelectRelationType}
          options={[
            ...relationTypeNames,
            { id: 0, name: 'All relation types' },
          ].sort((a, b) => a.name > b.name)}
          selected={relationType}
          getLabel={option => option.name}
        />
        <Select
          className={styles.Select}
          onSelect={onSelectTarget}
          options={entities}
          selected={target}
        />
        <AutoComplete
          className={styles.AutoComplete}
          getItems={getItems(autoCompleteByEntity[target])}
          itemToString={item => (item ? item.text : '')}
          placeholder={`All ${target}s`}
          onSubmit={onSelectTargetEntity}
          selectedItem={targetEntity}
        />
        <Button
          className={styles.SubmitButton}
          disabled={
            isLoadingRelationTypes ||
            isLoadingRelations ||
            isAutoCompleteLoading
          }
          type="submit"
        >
          {isLoadingRelations ? <Spinner height="12" width="18" /> : 'Add'}
        </Button>
      </form>
    </div>
  )
}

export default SearchBar
