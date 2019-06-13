import React from 'react'
import Downshift from 'downshift'

import styles from './AutoComplete.module.css'

import classNames from '../../utils/class-names'

const AutoComplete = ({
  className,
  label,
  getItems,
  itemToString,
  placeholder,
}) => {
  return (
    <Downshift
      onChange={selectedItem => console.log(selectedItem)}
      itemToString={itemToString}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div className={classNames(styles.AutoComplete, className)}>
          <label className={styles.Label} {...getLabelProps()}>
            {label}
          </label>
          <input className={styles.Input} {...getInputProps({ placeholder })} />
          <ul className={styles.Items} {...getMenuProps()}>
            {isOpen
              ? getItems(inputValue).map((item, index) => (
                  <li
                    key={item.id}
                    className={styles.Item}
                    {...getItemProps({
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index
                            ? 'var(--color-tertiary)'
                            : 'var(--color-white)',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {itemToString(item)}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  )
}

export default AutoComplete
