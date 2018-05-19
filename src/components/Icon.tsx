import React, { StatelessComponent, MouseEventHandler, CSSProperties } from 'react'
import classNames from 'classnames'

export interface IIconProps {
  type: string
  fixWidth?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  style?: CSSProperties
}

const Icon = (({ type, fixWidth, className, ...other }) => (
  <i
    className={classNames({
      anticon: true,
      fa: true,
      'fa-fw': fixWidth,
    }, `fa-${type}`, className)}
    {...other}
  />
)) as StatelessComponent<IIconProps>

export default Icon
