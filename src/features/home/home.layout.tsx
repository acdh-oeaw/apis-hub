import type { ReactNode } from 'react'

import styles from '@/features/home/home.layout.module.css'

interface HomeLayoutProps {
  children: ReactNode
}

export function HomeLayout(props: HomeLayoutProps): JSX.Element {
  const { children } = props

  return <div className={styles['container']}>{children}</div>
}
