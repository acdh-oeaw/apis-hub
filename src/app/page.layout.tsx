import type { ReactNode } from 'react'

import styles from '@/app/page.layout.module.css'
import { PageFooter } from '@/app/page-footer'
import { PageHeader } from '@/app/page-header'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props

  return (
    <div className={styles['container']}>
      <PageHeader />
      {children}
      <PageFooter />
    </div>
  )
}
