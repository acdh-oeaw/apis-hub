import React from 'react'

import styles from './Button.module.css'

import classNames from '../../utils/class-names'

const Button = ({ as: As = 'button', className, isDisabled, ...rest }) => (
  <As
    className={classNames(
      styles.Button,
      isDisabled && styles.ButtonDisabled,
      className
    )}
    disabled={isDisabled}
    {...rest}
  />
)

export default Button
