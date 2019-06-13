import React from 'react'

import styles from './Button.module.css'

import classNames from '../../utils/class-names'

const Button = ({ className, isDisabled, ...rest }) => (
  <button className={classNames(styles.Button, className)} disabled={isDisabled} {...rest} />
)

export default Button
