import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  RenderResult
} from '@testing-library/react'

import Menu, { MenuProps } from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu'
const testProps: MenuProps = {
  defaultIndex: '0',
  onSelect: jest.fn(),
  className: 'test'
}

const testVerProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical'
}

const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem>active</MenuItem>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem>xyz</MenuItem>
      <SubMenu title="dropdown">
        <MenuItem>welcome</MenuItem>
        <MenuItem>qqq</MenuItem>
      </SubMenu>
    </Menu>
  )
}
const createStyleFile = () => {
  const cssFile: string = `
    .zzking-submenu {
      display: none;
    }
    .zzking-submenu .menu-opened {
      display: block;
    }
  `
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = cssFile
  return style
}
let wrapper: RenderResult,
  menuELement: HTMLElement,
  activeElement: HTMLElement,
  disabledElement: HTMLElement
describe('test Menu and MenuItem component', () => {
  beforeEach(() => {
    wrapper = render(generateMenu(testProps))
    wrapper.container.append(createStyleFile())
    menuELement = wrapper.getByTestId('test-menu')
    activeElement = wrapper.getByText('active')
    disabledElement = wrapper.getByText('disabled')
  })
  it('should render correct Menu and MenuItem based on default props', () => {
    expect(menuELement).toBeInTheDocument()
    expect(menuELement).toHaveClass('zzking-menu test')
    expect(menuELement.querySelectorAll(':scope > li').length).toEqual(4)
    expect(activeElement).toHaveClass('menu-item is-active')
    expect(disabledElement).toHaveClass('menu-item is-disabled')
  })
  it('click items should change active and call the right callback', () => {
    const thirdItem = wrapper.getByText('xyz')
    // fireEvent 是 @testing-library/react 库中的一个实用工具，它用于在组件测试中模拟用户事件，如点击、输入、改变等
    fireEvent.click(thirdItem)
    expect(thirdItem).toHaveClass('is-active')
    expect(activeElement).not.toHaveClass('is-active')
    expect(testProps.onSelect).toHaveBeenCalledWith('2')
    fireEvent.click(disabledElement)
    expect(disabledElement).not.toHaveClass('is-active')
    expect(testProps.onSelect).not.toHaveBeenCalledWith(1)
  })
  it('should render vertical mode when mode is set to vertical', () => {
    cleanup()
    const wrapper = render(generateMenu(testVerProps))
    const menuELement = wrapper.getByTestId('test-menu')
    expect(menuELement).toHaveClass('menu-vertical')
  })
  // it('should show dropdown items when hover on submenu', async () => {
  //   expect(wrapper.queryByText('welcome')).not.toBeVisible()
  //   const dropdownElement = wrapper.getByText('dropdown')
  //   fireEvent.mouseEnter(dropdownElement)
  //   await waitFor(async () =>
  //     expect(wrapper.queryByText('welcome')).toBeVisible()
  //   )
  //   fireEvent.click(wrapper.getByText('welcome'))
  //   expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
  // })
})
