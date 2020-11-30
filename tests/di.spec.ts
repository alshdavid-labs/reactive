import { firstValueFrom } from '@alshdavid/rxjs'
import Reactive from '../src/index'

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

describe('Dependency Injection', () => {
  describe('Top level string', () => {
    it('Should init and listen to non reactive dependency', async () => {
      class Foo {
        value: string = VALUE_1
      }

      class Bar {
        constructor(
          public foo: Foo
        ) {}
      }

      const foo = new Foo()
      const $Bar = Reactive.create(Bar)
      const bar = new $Bar(foo)

      const onValueFoo = firstValueFrom(Reactive.observe(foo))
      const onValueBar = firstValueFrom(Reactive.observe(bar))

      bar.foo.value = VALUE_2
  
      expect(await onValueFoo).toBe(undefined)
      expect(await onValueBar).toBe(undefined)
      expect(bar.foo.value).toBe(VALUE_2)
      expect(foo.value).toBe(VALUE_2)
    })

    it('Should subscribe to existing reactive dependency', async () => {
      class Foo {
        value: string = VALUE_1
      }

      class Bar {
        constructor(
          public foo: Foo
        ) {}
      }

      const $Foo = Reactive.create(Foo)
      const $Bar = Reactive.create(Bar)

      const foo = new $Foo()
      const bar = new $Bar(foo)

      const onValueFoo = firstValueFrom(Reactive.observe(foo))
      const onValueBar = firstValueFrom(Reactive.observe(bar))

      bar.foo.value = VALUE_2
  
      expect(await onValueFoo).toBe(undefined)
      expect(await onValueBar).toBe(undefined)
      expect(bar.foo.value).toBe(VALUE_2)
      expect(foo.value).toBe(VALUE_2)
    })
  })
})