import React, { useContext } from 'react'
import classNames from 'classnames'
import { MenuContext } from './menu'
export interface MenuItemProps {
  index?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { disabled, className, style, children, index } = props
  const context = useContext(MenuContext)
  const classes = classNames('menu-item', className, {
    'is-disabled': disabled,
    'is-active': context.index === index
  })
  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === 'string') {
      context.onSelect(index)
    }
  }
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  )
}
// MenuItem 组件的 displayName 都被设置为 'MenuItem'。这意味着在 DevTools 中，这个组件将显示为 "MenuItem" 而不是默认的 "Component" 或者函数名。
MenuItem.displayName = 'MenuItem'
export default MenuItem
