import { RefObject, useEffect } from 'react'

// 定义一个回调函数类型
type CallbackFunction = (arg: MouseEvent) => void

function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: CallbackFunction
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }
      handler(event)
    }
    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}
export default useClickOutside
