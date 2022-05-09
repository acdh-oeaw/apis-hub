import type { ReactNode } from 'react'

import styles from '@/app/page-content.module.css'

interface PageContentProps {
  children: ReactNode
}

export function PageContent(props: PageContentProps): JSX.Element {
  const { children } = props

  return <main className={styles['container']}>{children}</main>
}
