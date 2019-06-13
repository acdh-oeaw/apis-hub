import React from 'react'

import styles from './Select.module.css'

import classNames from '../../utils/class-names'

const Select = ({
  className,
  isDisabled,
  label,
  onSelect,
  options,
  selected,
  ...rest
}) => (
  <label className={classNames(styles.Label, className)} {...rest}>
    <span>{label}</span>
    <select
      className={styles.Select}
      disabled={isDisabled}
      onChange={onSelect}
      value={selected}
    >
      {options.map(option =>
        Array.isArray(option) ? (
          <option key={option[0]} value={option[0]}>
            {option[1]}
          </option>
        ) : (
          <option key={option} value={option}>
            {option}
          </option>
        )
      )}
    </select>
  </label>
)

export default Select
