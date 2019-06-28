import React, { useEffect, useState } from 'react'

import Spinner from '../../elements/Spinner/Spinner'

import { IMPRINT_ENDPOINT } from '../../constants'

import styles from './Imprint.module.css'

const ImprintPage = () => {
  const [isLoading, setIsLoading] = useState()
  const [error, setError] = useState(null)
  const [impressumHtml, setImprsesumHtml] = useState()

  useEffect(() => {
    let didCancel = false
    const fetchImpressum = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(IMPRINT_ENDPOINT)
        const html = await response.text()
        if (!didCancel) {
          setIsLoading(false)
          setImprsesumHtml(html)
        }
      } catch (error) {
        setIsLoading(false)
        setError(error)
      }
    }
    fetchImpressum()
    return () => {
      didCancel = true
    }
  }, [])

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <h2 className={styles.Heading}>Imprint</h2>
        {isLoading && <Spinner width="1em" />}
        <div dangerouslySetInnerHTML={{ __html: impressumHtml }} />
      </div>
    </div>
  )
}

export default ImprintPage
