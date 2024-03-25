import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Button, { ButtonProps } from './button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const buttonMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button
}

export default buttonMeta

export const Default: StoryObj<typeof Button> = (args: ButtonProps) => (
  <Button {...args}>Default Button</Button>
)
Default.storyName = '默认按钮样式'
