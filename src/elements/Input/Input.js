import React from 'react'

import styles from './Input.module.css'

import classNames from '../../utils/class-names'

const Input = ({ className, label, ...rest }) => (
  <label className={styles.Label}>
    <span>{label}</span>
    <input className={classNames(styles.Input, className)} {...rest} />
  </label>
)

export default Input
