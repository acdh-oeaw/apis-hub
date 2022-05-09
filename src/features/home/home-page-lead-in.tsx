import type { ReactNode } from 'react'

import styles from '@/features/home/home-page-lead-in.module.css'

interface HomePageLeadInProps {
  children: ReactNode
}

export function HomePageLeadIn(props: HomePageLeadInProps): JSX.Element {
  const { children } = props

  return <p className={styles['text']}>{children}</p>
}
