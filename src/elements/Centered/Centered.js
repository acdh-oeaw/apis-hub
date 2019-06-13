import React from 'react'

import styles from './Centered.module.css'

import classNames from '../../utils/class-names'

const Centered = ({ className, ...rest }) => (
  <div className={classNames(styles.Centered, className)} {...rest} />
)

export default Centered
