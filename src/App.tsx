import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'
import Menu, { MenuProps } from './components/Menu/menu'
import Icon from './components/Icon/icon'
library.add(fas)
function App() {
  const testVerProps: MenuProps = {
    defaultIndex: '0',
    mode: 'horizontal'
  }
  return (
    <div className="App">
      <Icon icon="arrow-up" theme="dark" size="10x" />
      <Menu {...testVerProps}>
        <MenuItem>active</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem>xyz</MenuItem>
        <SubMenu title="dropdown">
          <MenuItem>welcome</MenuItem>
          <MenuItem>qqq</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  )
}

export default App
