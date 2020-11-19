import { Subject } from "../rxjs";

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

  pushEvent(changeEvent: ChangeEvent) {
    setTimeout(() => this.onEvent.next(changeEvent))
  }
}

export const state = new State()

export const createNodeId = (): number => Math.round((Math.random() * 1000000000))

export const KEY = '__REACTIVE_STATE__'

