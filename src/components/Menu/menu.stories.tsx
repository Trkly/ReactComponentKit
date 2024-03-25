import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Menu, { MenuProps } from './menu'
import SubMenu from './subMenu'
import MenuItem from './menuItem'

const menuMeta: Meta<typeof Menu> = {
  title: 'Menu',
  id: 'Menu',
  component: Menu
}
export default menuMeta

export const ADefaultMenu: StoryObj<typeof Menu> = (args: MenuProps) => (
  <Menu defaultIndex="0" {...args}>
    <MenuItem>cool link</MenuItem>
    <MenuItem>cool link 2</MenuItem>
    <MenuItem disabled>disabled</MenuItem>
    <SubMenu title="下拉选项">
      <MenuItem>下拉选项一</MenuItem>
      <MenuItem>下拉选项二</MenuItem>
    </SubMenu>
  </Menu>
)
ADefaultMenu.storyName = '默认Menu'
export const BClickMenu: StoryObj<typeof Menu> = (args: MenuProps) => (
  <Menu {...args} defaultIndex="0" mode="vertical">
    <MenuItem>cool link</MenuItem>
    <MenuItem>cool link 2</MenuItem>
    <SubMenu title="点击下拉选项">
      <MenuItem>下拉选项一</MenuItem>
      <MenuItem>下拉选项二</MenuItem>
    </SubMenu>
  </Menu>
)
BClickMenu.storyName = '纵向的 Menu'
export const COpenedMenu: StoryObj<typeof Menu> = (args: MenuProps) => (
  <Menu {...args} defaultIndex="0" mode="vertical" defaultOpenSubMenus={['2']}>
    <MenuItem>cool link</MenuItem>
    <MenuItem>cool link 2</MenuItem>
    <SubMenu title="默认展开下拉选项">
      <MenuItem>下拉选项一</MenuItem>
      <MenuItem>下拉选项二</MenuItem>
    </SubMenu>
  </Menu>
)
COpenedMenu.storyName = '默认展开的纵向 Menu'
