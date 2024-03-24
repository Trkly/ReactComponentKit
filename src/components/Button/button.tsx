import React from 'react'
import classNames from 'classnames'

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
  className?: string
  disabled?: boolean
  size?: ButtonSize
  btnType?: ButtonType
  children: React.ReactNode
  href?: string
}
/**
 * React.ButtonHTMLAttributes 是 React 标准库中的一个类型，
 * 它代表所有可以应用于 HTML 按钮（<button> 标签）的属性。
 * 由于 React.ButtonHTMLAttributes 的泛型参数是 HTMLElement，这意味着它专门针对 HTML 元素的按钮属性
 */
type NativeButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLElement>
/**
 * React.AnchorHTMLAttributes 类型代表所有可以应用于 HTML 锚点（<a> 标签）的属性。
 */
type AnchorButtonProps = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLElement>
// 使用 Partial 工具类型，将交叉类型的所有属性都变为可选的
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: React.FC<BaseButtonProps> = (props) => {
  const { btnType, disabled, size, children, href, className, ...restProps } =
    props
  // btn, btn-lg, btn-primary
  /**
   * classNames接收一个字符串和一个对象作为参数，然后根据对象中的键和值来决定哪些类名应该被包含在最终的字符串中
   */
  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === 'link' && disabled
  })
  if (btnType === 'link' && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    )
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    )
  }
}

Button.defaultProps = {
  disabled: false,
  btnType: 'default'
}

export default Button
