import { state } from './state'

export const ignore = (target: any): void => {
  state.ignoreList.push(target)
}
