import React, { StatelessComponent } from 'react'
import { Button as AntdButton } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import styles from './Button.scss'

const Button = (({ children, ...otherProps }) => (
  <AntdButton
    {...otherProps}
    className={styles.button}
  >
    {children}
  </AntdButton>
)) as StatelessComponent<ButtonProps>

export default Button
