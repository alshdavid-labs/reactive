import { firstValueFrom } from '@alshdavid/rxjs'
import Reactive, { ignore, ignoreInstanceOf } from '../src/index'

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

describe('Dependency Injection', () => {
  it('Should ignore specific object instance', async () => {
    class Foo {
      value: string = VALUE_1
    }

    class Bar {
      value: string = VALUE_1

      constructor(
        public foo: Foo
      ) {}
    }

    const foo = new Foo()
    const $Bar = Reactive.create(Bar)

    ignore(foo)

    const bar = new $Bar(foo)

    const testFunc1 = () => Reactive.observe(bar)
    const testFunc2 = () => Reactive.observe(foo)

    expect(testFunc1).not.toThrow()
    expect(testFunc2).toThrow()
  })

  it('Should ignore typeof class', async () => {
    class Foo {
      value: string = VALUE_1
    }

    class Bar {
      value: string = VALUE_1

      constructor(
        public foo: Foo
      ) {}
    }

    const foo = new Foo()
    const $Bar = Reactive.create(Bar)

    ignoreInstanceOf(Foo)

    const bar = new $Bar(foo)

    const testFunc1 = () => Reactive.observe(bar)
    const testFunc2 = () => Reactive.observe(foo)

    expect(testFunc1).not.toThrow()
    expect(testFunc2).toThrow()
  })

  it('Should ignore typeof class', async () => {
    class Foobar {
      value: string = VALUE_1
    }
    
    class Foo extends Foobar {}

    class Bar {
      value: string = VALUE_1

      constructor(
        public foo: Foo
      ) {}
    }

    const foo = new Foo()
    const $Bar = Reactive.create(Bar)

    ignoreInstanceOf(Foobar)

    const bar = new $Bar(foo)

    const testFunc1 = () => Reactive.observe(bar)
    const testFunc2 = () => Reactive.observe(foo)

    expect(testFunc1).not.toThrow()
    expect(testFunc2).toThrow()
  })
})