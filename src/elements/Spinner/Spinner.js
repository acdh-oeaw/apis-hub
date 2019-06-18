import React from 'react'
import Loader from 'react-loader-spinner'

import styles from './Spinner.module.css'

const Spinner = ({ width, height, color }) => (
  <span className={styles.Spinner}>
    <Loader
      color={color || 'currentColor'}
      height={height}
      width={width}
      type="Grid"
    />
    <span className={styles.Loading}>Loading ...</span>
  </span>
)

export default Spinner
