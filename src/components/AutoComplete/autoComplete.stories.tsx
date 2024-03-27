import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { AutoComplete, DataSourceType } from './autoComplete'
const autoCompleteMeta: Meta<typeof AutoComplete> = {
  title: 'AutoComplete',
  id: 'AutoComplete',
  component: AutoComplete
}
export default autoCompleteMeta
interface LakerPlayerProps {
  value: string
  number: number
}
interface GithubUserProps {
  login: string
  url: string
  avatar_url: string
}
// simpleComplete
const autoCompleteLakers = [
  'bradley',
  'pope',
  'caruso',
  'cook',
  'cousins',
  'james',
  'AD',
  'green',
  'howard',
  'kuzma',
  'McGee',
  'rando'
]
const autoCompleteHandleFetch = (query: string) => {
  return autoCompleteLakers
    .filter((name) => name.includes(query))
    .map((name) => ({ value: name }))
}
export const SimpleComplete: StoryObj<typeof AutoComplete> = () => (
  <AutoComplete
    fetchSuggestions={autoCompleteHandleFetch}
    onSelect={action('selected')}
    placeholder="输入湖人队球员英文名试试"
  />
)

const textComplete = `
  const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins','james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']
  const handleFetch = (query: string) => {
    return lakers.filter(name => name.includes(query)).map(name => ({value: name}))
  }
  return (
    <AutoComplete
      fetchSuggestions={handleFetch}
      onSelect={action('selected')}
      placeholder="输入湖人队球员英文名试试"
    />
  )
`
SimpleComplete.storyName = 'AutoComplete'
SimpleComplete.parameters = {
  docs: {
    source: {
      code: textComplete
    }
  }
}

// customComplete
const lakersWithNumber = [
  { value: 'bradley', number: 11 },
  { value: 'pope', number: 1 },
  { value: 'caruso', number: 4 },
  { value: 'cook', number: 2 },
  { value: 'cousins', number: 15 },
  { value: 'james', number: 23 },
  { value: 'AD', number: 3 },
  { value: 'green', number: 14 },
  { value: 'howard', number: 39 },
  { value: 'kuzma', number: 0 }
]
const withNumberHandleFetch = (query: string) => {
  return lakersWithNumber.filter((player) => player.value.includes(query))
}
const withNumberRenderOption = (item: DataSourceType) => {
  const itemWithNumber = item as DataSourceType<LakerPlayerProps>
  return (
    <>
      <b>名字: {itemWithNumber.value}</b>
      <span>球衣号码: {itemWithNumber.number}</span>
    </>
  )
}
export const CustomComplete: StoryObj<typeof AutoComplete> = () => (
  <AutoComplete
    fetchSuggestions={withNumberHandleFetch}
    onSelect={action('selected')}
    placeholder="输入湖人队球员英文,自定义下拉模版"
    renderOption={withNumberRenderOption}
  />
)

const textCustom = `
const lakersWithNumber = [
  {value: 'bradley', number: 11},
  {value: 'pope', number: 1},
  {value: 'caruso', number: 4},
  {value: 'cook', number: 2},
  {value: 'cousins', number: 15},
  {value: 'james', number: 23},
  {value: 'AD', number: 3},
  {value: 'green', number: 14},
  {value: 'howard', number: 39},
  {value: 'kuzma', number: 0},
] 
const handleFetch = (query: string) => {
  return lakersWithNumber.filter(player => player.value.includes(query))
}
const renderOption = (item: DataSourceType) => {
  const itemWithNumber = item as DataSourceType<LakerPlayerProps>
  return (
    <>
      <b>名字: {itemWithNumber.value}</b>
      <span>球衣号码: {itemWithNumber.number}</span>
    </>
  )
}
return (
  <AutoComplete 
    fetchSuggestions={handleFetch}
    onSelect={action('selected')}
    placeholder="输入湖人队球员英文,自定义下拉模版"
    renderOption={renderOption}
  />
)
~~~
`
CustomComplete.storyName = '自定义下拉选项'
CustomComplete.parameters = {
  docs: {
    source: {
      code: textCustom
    }
  }
}

// ajaxComplete

const handleFetch = async (query: string) => {
  const res = await fetch(`https://api.github.com/search/users?q=${query}`)
  const { items } = await res.json()
  return (
    items
      .slice(0, 10)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(
        (item: GithubUserProps) =>
          ({
            value: item.login,
            ...item
          }) as DataSourceType
      )
  )
}

const renderOption = (item: DataSourceType) => {
  const itemWithGithub = item as DataSourceType<GithubUserProps>
  return (
    <>
      <b>Name: {itemWithGithub.value}</b>
      <span>url: {itemWithGithub.url}</span>
    </>
  )
}

export const AjaxComplete: StoryObj<typeof AutoComplete> = () => (
  <AutoComplete
    fetchSuggestions={handleFetch}
    placeholder="输入 Github 用户名试试"
    onSelect={action('selected')}
    renderOption={renderOption}
  />
)

const textAjax = `
const handleFetch = (query: string) => {
  return fetch('https://api.github.com/search/users?q='+ query)
    .then(res => res.json())
    .then(({ items }) => {
      return items.slice(0, 10).map((item: any) => ({ value: item.login, ...item}))
    })
}

const renderOption = (item: DataSourceType) => {
  const itemWithGithub = item as DataSourceType<GithubUserProps>
  return (
    <>
      <b>Name: {itemWithGithub.value}</b>
      <span>url: {itemWithGithub.url}</span>
    </>
  )
}
return (
  <AutoComplete 
    fetchSuggestions={handleFetch}
    placeholder="输入 Github 用户名试试"
    onSelect={action('selected')}
    renderOption={renderOption}
  />
)
~~~
`

AjaxComplete.storyName = '异步请求Github用户名'
AjaxComplete.parameters = {
  docs: {
    storyDescription: '异步请求Github用户名',
    source: {
      code: textAjax
    }
  }
}
