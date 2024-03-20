import React from 'react'
import Button, { ButtonSize, ButtonType } from './components/Button/button'
function App() {
  return (
    <div className="App">
      <Button> Hello</Button>
      <Button btnType={ButtonType.Danger} size={ButtonSize.Large}>
        NIHAO Hello
      </Button>
      <Button btnType={ButtonType.Link} href="www.baidu.com" disabled>
        Hello
      </Button>
    </div>
  )
}

export default App
