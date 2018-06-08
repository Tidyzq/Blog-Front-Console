import React, { StatelessComponent } from 'react'
import { Input as AntdInput } from 'antd'
import { InputProps } from 'antd/lib/input'
import styles from './Input.scss'

const Input = (({ children, ...otherProps }) => (
  <AntdInput
    {...otherProps}
    className={styles.input}
  >
    {children}
  </AntdInput>
)) as StatelessComponent<InputProps>

export default Input
