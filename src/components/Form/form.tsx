import React, {
  ReactNode,
  createContext,
  forwardRef,
  useImperativeHandle
} from 'react'
import { ValidateError } from 'async-validator'
import useStore, { FormState } from './useStore'

/**
 * 开发步骤
 * 1分析需求，明确组件应该有的结构。
 * 2完成组件基本的静态展示
 * 3提取一个对应的 store 作为整个组件的中枢以及父子组件的桥梁
 * 4注册 item 到 store
 * 5item 表单更新的时候更新 store 中的数据
 * 6自定义item 的字段以及完善默认值。
 * 7添加单个item的验证。
 * 8添加表单整体的验证
 * 9添加组件实例方法。
 */

export type RenderProps = (form: FormState) => ReactNode
export interface FormProps {
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: Record<string, any>
  children?: ReactNode | RenderProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish?: (values: Record<string, any>) => void
  onFinishFailed?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, any>,
    errors: Record<string, ValidateError[]>
  ) => void
}
// 选取特定项
export type IFormContext = Pick<
  ReturnType<typeof useStore>,
  'dispatch' | 'fields' | 'validateField'
> &
  Pick<FormProps, 'initialValues'>
// 忽略特定项
export type IFormRef = Omit<
  ReturnType<typeof useStore>,
  'fields' | 'dispatch' | 'form'
>
export const FormContext = createContext<IFormContext>({} as IFormContext)
export const Form = forwardRef<IFormRef, FormProps>((props, ref) => {
  const { name, children, initialValues, onFinish, onFinishFailed } = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { form, fields, dispatch, ...restProps } = useStore(initialValues)
  const { validateField, validateAllFields } = restProps
  useImperativeHandle(ref, () => {
    return {
      ...restProps
    }
  })
  const passedContext: IFormContext = {
    dispatch,
    fields,
    initialValues,
    validateField
  }
  const submitForm = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const { isValid, errors, values } = await validateAllFields()
    if (isValid && onFinish) {
      onFinish(values)
    } else if (!isValid && onFinishFailed) {
      onFinishFailed(values, errors)
    }
  }
  let childrenNode: ReactNode
  if (typeof children === 'function') {
    // 此时的children是我们传入的自定义函数,form使我们表单的一些状态数据，
    // 我们可以跟表单数据自定义要渲染的ReactNode
    childrenNode = children(form)
  } else {
    childrenNode = children
  }

  return (
    <>
      <form name={name} className="zzking-form" onSubmit={submitForm}>
        <FormContext.Provider value={passedContext}>
          {childrenNode}
        </FormContext.Provider>
      </form>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(fields)}</pre>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(form)}</pre>
      </div>
    </>
  )
})
Form.defaultProps = {
  name: 'zzking-form'
}
Form.displayName = 'Form'
export default Form
