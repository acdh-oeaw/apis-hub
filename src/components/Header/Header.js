import React from 'react'

import styles from './Header.module.css'

import classNames from '../../utils/class-names'

const Header = ({ className, ...rest }) => (
  <header className={classNames(styles.Header, className)} {...rest} />
)

export default Header
