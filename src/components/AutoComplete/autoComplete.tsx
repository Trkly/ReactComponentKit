import React, {
  FC,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  ReactElement,
  KeyboardEvent
} from 'react'
import classNames from 'classnames'
import Input, { InputProps } from '../Input/input'
import Icon from '../Icon/icon'
import useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'

interface DataSourceObject {
  value: string
}
export type DataSourceType<T = object> = T & DataSourceObject
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  fetchSuggestions: (
    str: string
  ) => DataSourceType[] | Promise<DataSourceType[]>
  onSelect?: (item: DataSourceType) => void
  renderOption?: (item: DataSourceType) => ReactElement
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const { fetchSuggestions, onSelect, value, renderOption, ...restProps } =
    props
  const [inputValue, setInputValue] = useState(value as string)
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
  const [loading, setLoading] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const triggerSearch = useRef(false)
  const componentRef = useRef<HTMLDivElement>(null)
  const debouncedValue = useDebounce(inputValue, 500)
  useClickOutside(componentRef, () => {
    setSuggestions([])
  })
  useEffect(() => {
    if (debouncedValue && triggerSearch.current) {
      const results = fetchSuggestions(debouncedValue)
      if (results instanceof Promise) {
        setLoading(true)
        results.then((data) => {
          setLoading(false)
          setSuggestions(data)
        })
      } else {
        setSuggestions(results as DataSourceType[])
      }
    } else {
      setSuggestions([])
    }
    setHighlightIndex(-1)
  }, [debouncedValue])
  const highlight = (index: number) => {
    if (index < 0) index = 0
    if (index >= suggestions.length) {
      index = suggestions.length - 1
    }
    setHighlightIndex(index)
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex])
        }
        break
      case 'ArrowUp':
        highlight(highlightIndex - 1)
        break
      case 'ArrowDown':
        highlight(highlightIndex + 1)
        break
      case 'Escape':
        setSuggestions([])
        break
      default:
        break
    }
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // trim() 是 JavaScript 中的一个字符串方法，它用于从字符串的两端删除空白字符，包括空格、制表符、换行符等。这个方法返回一个新的字符串，原始字符串本身不会被修改。
    const value = e.target.value.trim()
    setInputValue(value)
    triggerSearch.current = true
  }
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value)
    setSuggestions([])
    if (onSelect) {
      onSelect(item)
    }
    triggerSearch.current = false
  }
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value
  }
  const generateDropdown = () => {
    return (
      <ul className="zzking-suggestion-list">
        {loading && (
          <ul>
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          </ul>
        )}
        {suggestions.map((item, index) => {
          const cnames = classNames('suggestion-item', {
            'is-active': index === highlightIndex
          })
          return (
            <li
              key={index}
              className={cnames}
              onClick={() => {
                handleSelect(item)
              }}
            >
              {renderTemplate(item)}
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <div className="zzking-auto-complete" ref={componentRef}>
      <Input
        value={inputValue}
        onChange={handleChange}
        {...restProps}
        onKeyDown={handleKeyDown}
      />

      {suggestions.length > 0 && generateDropdown()}
    </div>
  )
}
