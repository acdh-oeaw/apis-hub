import React from 'react'
import { Link } from '@reach/router'

import styles from './Nav.module.css'

import classNames from '../../utils/class-names'

const Nav = ({ className, links, ...rest }) => (
  <nav className={classNames(styles.Nav, className)} {...rest}>
    <ul className={styles.NavItems}>
      {links.map(([title, to]) => (
        <li className={styles.NavItem} key={to}>
          <Link className={styles.NavLink} to={to}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
