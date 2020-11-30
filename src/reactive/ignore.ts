import { getState } from './state'

export const ignore = (target: any): void => {
  getState().ignoreList.push(target)
}

export const ignoreInstanceOf = (target: any): void => {
  getState().ignoreInstanceOfList.push(target)
}
