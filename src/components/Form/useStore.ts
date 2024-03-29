import { useState, useReducer } from 'react'
import Schema, { RuleItem, ValidateError } from 'async-validator'
import { mapValues, each } from 'lodash-es'
export type CustomRuleFunc = (
  getFieldValue: (key: string) => string | undefined
) => RuleItem
export type CustomRule = RuleItem | CustomRuleFunc
// FieldDetail 是构成 FieldState 的基本单元，而 FieldState 是整个表单状态的集合表示。
export interface FieldDetail {
  name?: string
  value: string
  rules: RuleItem[]
  isValid: boolean
  errors: ValidateError[]
}

export interface FieldsState {
  [key: string]: FieldDetail
}

export interface FormState {
  isValid: boolean
  isSubmitting: boolean
  // 表单中所有错误的汇总
  errors: Record<string, ValidateError[]>
}
export interface FieldsAction {
  type: 'addField' | 'updateValue' | 'updateValidateResult'
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

// 验证时发生的错误类型
export interface ValidateErrorType extends Error {
  errors: ValidateError[]
  fields: Record<string, ValidateError[]>
}
function fieldsReducer(state: FieldsState, action: FieldsAction) {
  switch (action.type) {
    case 'addField':
      return {
        ...state,
        [action.name]: { ...action.value }
      }
    case 'updateValue':
      return {
        ...state,
        [action.name]: { ...state[action.name], value: action.value }
      }
    case 'updateValidateResult':
      const { isValid, errors } = action.value
      return {
        ...state,
        [action.name]: { ...state[action.name], isValid, errors }
      }
    default:
      return state
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useStore(initialValues?: Record<string, any>) {
  // form state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [form, setForm] = useState<FormState>({
    isValid: true,
    isSubmitting: false,
    errors: {}
  })
  const [fields, dispatch] = useReducer(fieldsReducer, {})
  function getFieldValue(key: string): string | undefined {
    const fieldDetail = fields[key]
    if (fieldDetail == null) {
      return undefined
    }
    return fieldDetail.value
  }
  // 获取表单中所有的键值对形式的数据，以name:value形式返回给用户
  const getFieldsValue = () => {
    return mapValues(fields, (item) => item.value)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldsValue = (name: string, value: any) => {
    // 如果存在对应的键
    if (fields[name]) {
      dispatch({ type: 'updateValue', name, value })
    }
  }
  const resetFieldsValue = () => {
    if (initialValues) {
      each(initialValues, (value, name) => {
        if (fields[name]) {
          dispatch({ type: 'updateValue', name, value })
        }
      })
    }
  }
  const transformRules = (rules: CustomRule[]) => {
    return rules.map((rule) => {
      if (typeof rule === 'function') {
        const calledRule = rule(getFieldValue)
        return calledRule
      } else {
        return rule
      }
    })
  }
  const validateField = async (name: string) => {
    const { value, rules } = fields[name]
    const afterRules = transformRules(rules)
    const descriptor = {
      [name]: afterRules
    }
    const valueMap = {
      [name]: value
    }
    const validator = new Schema(descriptor)
    let isValid = true
    let errors: ValidateError[] = []
    try {
      await validator.validate(valueMap)
    } catch (e) {
      isValid = false
      const err = e as ValidateErrorType
      console.log('e', err.errors)
      console.log('fields', err.fields)
      errors = err.errors
    } finally {
      console.log('errors', isValid)
      dispatch({
        type: 'updateValidateResult',
        name,
        value: { isValid, errors }
      })
    }
  }

  const validateAllFields = async () => {
    let isValid = true
    let errors: Record<string, ValidateError[]> = {}
    const valueMap = mapValues(fields, (item) => item.value)
    // {'username':'abc'}
    const descriptor = mapValues(fields, (item) => transformRules(item.rules))
    const validator = new Schema(descriptor)
    setForm({ ...form, isSubmitting: true })
    try {
      await validator.validate(valueMap)
    } catch (e) {
      isValid = false
      const err = e as ValidateErrorType
      errors = err.fields
      each(fields, (value, name) => {
        // error中有对应的key
        if (errors[name]) {
          const itemErrors = errors[name]
          dispatch({
            type: 'updateValidateResult',
            name,
            value: { isValid: false, errors: itemErrors }
          })
        } else if (value.rules.length > 0 && !errors[name]) {
          // 有对应的rules，并且没有errors
          dispatch({
            type: 'updateValidateResult',
            name,
            value: { isValid: true, errors: [] }
          })
        }
      })
    } finally {
      setForm({ ...form, isSubmitting: false, isValid, errors })
      return {
        isValid,
        errors,
        values: valueMap
      }
    }
  }
  return {
    fields,
    dispatch,
    form,
    validateField,
    getFieldValue,
    validateAllFields,
    getFieldsValue,
    setFieldsValue,
    resetFieldsValue
  }
}
export default useStore
