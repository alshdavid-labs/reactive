import { state } from './state'

export const ignore = (target: any): void => {
  state.ignoreList.push(target)
}

export const ignoreInstanceOf = (target: any): void => {
  state.ignoreInstanceOfList.push(target)
}
