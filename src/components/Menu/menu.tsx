import React, { useState, createContext } from 'react'
import classNames from 'classnames'
import { MenuItemProps } from './menuItem'
// 定义Menu组件中子组件的排列方式，水平或垂直
type MenuMode = 'horizontal' | 'vertical'
// 定义Select回调函数类型
type SelectCallback = (selectIndex: string) => void
// 定义Menu组件接收参数的接口
export interface MenuProps {
  defaultIndex?: string
  className?: string
  mode?: MenuMode
  style?: React.CSSProperties
  children?: React.ReactNode
  onSelect?: SelectCallback
  defaultOpenSubMenus?: string[]
}

// IMenuContext是上下文对象要传递的数据类型
interface IMenuContext {
  index: string
  onSelect?: SelectCallback
  mode?: MenuMode
  defaultOpenSubMenus?: string[]
}

// 创建一个上下文对象
// 这个上下文对象因为其他组件也要使用（因为是共享）。所以要进行导出
export const MenuContext = createContext<IMenuContext>({ index: '0' })

const Menu: React.FC<MenuProps> = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus
  } = props
  const [currentActive, setActive] = useState(defaultIndex)
  const classes = classNames('zzking-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical'
  })
  // 处理点击事件
  const handleClick = (index: string) => {
    // 修改index值为currentActive
    setActive(index)
    // 如果存在onSelect回调函数，执行回调函数
    if (onSelect) {
      onSelect(index)
    }
  }
  // passedContext是上下文对象要传递的数据
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus
  }

  // 确保Menu 组件的子组件只有 MenuItem
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement =
        child as React.FunctionComponentElement<MenuItemProps>
      const { displayName } = childElement.type
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        // 为Menu组件的子组件自动添加index属性
        return React.cloneElement(childElement, {
          index: index.toString()
        })
      } else {
        console.error(
          'Warning: Menu has a child which is not a MenuItem component'
        )
      }
    })
  }

  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: []
}
export default Menu
