import React, { useState } from 'react'

import Button from '../Button/Button'

import styles from './Popover.module.css'

const Popover = ({ label, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={styles.Popover}>
      <Button
        className={styles.PopoverTrigger}
        onClick={() => setIsVisible(!isVisible)}
      >
        {label}
      </Button>
      {isVisible && <div className={styles.PopoverContent}>{children}</div>}
    </div>
  )
}

export default Popover
