import React from 'react'

import styles from './Logo.module.css'

const Hexagon = ({ style }) => <div style={style} className={styles.Hexagon} />

const Logo = () => (
  <div className={styles.Logo}>
    <div className={styles.Hexagons}>
      <Hexagon style={{ color: 'var(--color-primary)' }} />
      <Hexagon style={{ color: 'var(--color-secondary)' }} />
      <Hexagon style={{ color: 'var(--color-tertiary)' }} />
    </div>
    <div className={styles.Name}>APIS HUB</div>
  </div>
)

export default Logo
