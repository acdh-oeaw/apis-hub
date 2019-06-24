import React, { useReducer } from 'react'

import Button from '../../elements/Button/Button'
import Select from '../../elements/Select/Select'
import Spinner from '../../elements/Spinner/Spinner'

import { convertToGexf, convertToGraphML } from '../../utils/export'

import styles from './ExportButtons.module.css'

const formats = [
  { id: 0, title: 'Select format' },
  { id: 1, title: 'GraphML', converter: convertToGraphML, ext: 'graphml' },
  { id: 2, title: 'Gephi (Gexf)', converter: convertToGexf, ext: 'gexf' },
]

const reducer = (state, action) => {
  switch (action.type) {
    case 'START_LOADING': {
      return {
        url: null,
        file: null,
        data: null,
        error: null,
        isLoading: true,
      }
    }
    case 'SET_DATA': {
      return {
        url: null,
        file: null,
        data: action.payload,
        isLoading: false,
        error: null,
      }
    }
    case 'SET_URL': {
      return {
        ...state,
        url: action.payload,
        file: action.meta,
      }
    }
    case 'ERROR': {
      return {
        file: null,
        url: null,
        data: null,
        error: action.payload,
        isLoading: false,
      }
    }
    default:
      throw new Error(`Unrecognized action ${action.type}`)
  }
}

const ExportButtons = ({ graph }) => {
  const [{ url, file, isLoading }, dispatch] = useReducer(reducer, {
    url: null,
    file: null,
    data: null,
    isLoading: false,
    error: null,
  })

  return (
    <div className={styles.Container}>
      <Select
        label="Export"
        className={styles.Select}
        getLabel={item => item.title}
        onSelect={event => {
          const selected = formats[event.target.selectedIndex]
          if (!selected || !selected.converter) return

          dispatch({ type: 'START_LOADING' })
          try {
            const data = selected.converter(graph.getNodes(), graph.getEdges())
            dispatch({ type: 'SET_DATA', payload: data })

            const blob = new Blob([data], { type: 'text/xml' })
            const url = window.URL.createObjectURL(blob)

            dispatch({
              type: 'SET_URL',
              payload: url,
              meta: `graph.${selected.ext}`,
            })
          } catch (error) {
            dispatch({ type: 'ERROR', payload: error, error: true })
          }
        }}
        options={formats}
      />
      <Button
        as="a"
        className={styles.Button}
        isDisabled={!url}
        download={file}
        href={url}
      >
        {isLoading ? <Spinner size="1em" /> : 'Download'}
      </Button>
    </div>
  )
}

export default ExportButtons
