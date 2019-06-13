import React from 'react'

import styles from './Panel.module.css'

const Panel = ({ children, isOpen, right, setIsOpen, title }) => (
  <aside
    className={styles.Panel}
    style={{
      left: right ? undefined : 0,
      right: right ? 0 : undefined,
      transform: `translateX(${isOpen ? 0 : right ? '100%' : '-100%'})`,
    }}
  >
    <header className={styles.PanelHeader}>
      <h3>{title}</h3>
      <button
        className={styles.PanelCloseButton}
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>
    </header>
    <div className={styles.PanelContent}>{children}</div>
  </aside>
)

export default Panel
