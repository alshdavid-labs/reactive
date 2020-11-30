import { Subject } from "@alshdavid/rxjs";

export enum ChangeEventType {
  Update,
  Add,
  Remove,
}

export class ChangeEvent {
  constructor(
    public type: ChangeEventType,
    public node: number,
    public childNode?: number,
  ) {}
}

export class State {
  public onEvent = new Subject<ChangeEvent>()
  public ignoreList: any[] = []
  public ignoreInstanceOfList: any[] = []

  pushEvent(changeEvent: ChangeEvent) {
    setTimeout(() => this.onEvent.next(changeEvent))
  }

  isIgnored(target: any) {
    for (const item of this.ignoreList) {
      if (target === item) return true
    }
    for (const item of this.ignoreInstanceOfList) {
      if (target instanceof item) return true
    }
  }
}

export const state = new State()

export const createNodeId = (): number => Math.round((Math.random() * 1000000000))

export const KEY = Symbol('__REACTIVE_STATE__')

