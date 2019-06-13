import React from 'react'

import styles from './Toggle.module.css'

const Toggle = ({ checked, onToggle }) => (
  <label className={styles.Toggle}>
    <input
      type="checkbox"
      checked={checked}
      onChange={event => onToggle(event.target.checked)}
    />
    <div className={styles.Switch} />
  </label>
)

export default Toggle
