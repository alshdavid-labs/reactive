import { firstValueFrom } from '@alshdavid/rxjs'
import Reactive from '../src/index'

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

describe('Suite one', () => {
  it('Case 1', async () => {
    const $Foo = Reactive.create(class Foo {
      bar = VALUE_1
    })
    const foo = new $Foo()
    const onValue = firstValueFrom(Reactive.observe(foo))
    Reactive.observe(foo).subscribe(() => console.log('hi'))

    foo.bar = VALUE_2
    expect(await onValue).toBe(undefined)
  })
})