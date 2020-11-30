import { firstValueFrom } from '@alshdavid/rxjs'
import Reactive from '../src/index'

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

describe('Class', () => {
  describe('Top level string', () => {
    it('Should react to top level property', async () => {
      const $Foo = Reactive.create(class Foo {
        bar = VALUE_1
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar = VALUE_2
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar).toBe(VALUE_2)
    })
  })
  
  describe('Object instance on top level', () => {
    it('Should emit on property update', async () => {
      const $Foo = Reactive.create(class Foo {
        bar = { value: VALUE_1 }
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar.value = VALUE_2
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar.value).toBe(VALUE_2)
    })

    it('Should emit on property add', async () => {
      const $Foo = Reactive.create(class Foo {
        bar: Record<string, string> = {}
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar.value = VALUE_2
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar.value).toBe(VALUE_2)
    })

    it('Should emit on property delete', async () => {
      const $Foo = Reactive.create(class Foo {
        bar: Record<string, string> = { value: VALUE_1 }
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      delete foo.bar.value
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar.value).toBe(undefined)
    })
  })

  describe('Array (string) instance on top level', () => {
    it('Should emit on item change', async () => {
      const $Foo = Reactive.create(class Foo {
        bar: string[] = [VALUE_1]
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar[0] = VALUE_2
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar[0]).toBe(VALUE_2)
    })

    it('Should emit on item add', async () => {
      const $Foo = Reactive.create(class Foo {
        bar: string[] = [VALUE_1]
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar[0] = VALUE_2
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar[0]).toBe(VALUE_2)
    })

    it('Should emit on item delete', async () => {
      const $Foo = Reactive.create(class Foo {
        bar: string[] = [VALUE_1]
      })
      const foo = new $Foo()
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar.splice(0, 1)
  
      expect(await onValue).toBe(undefined)
      expect(foo.bar.length).toBe(0)
    })
  })

  describe('Array (object) instance on top level', () => {
    let foo: Foo;
    class Foo {
      bar: Array<{ value: string }> = []
    }
    
    beforeEach(() => {
      const $Foo = Reactive.create(Foo)
      foo = new $Foo()
    })

    it('Should emit on item add', async () => {
      const onValue = firstValueFrom(Reactive.observe(foo))
      const insert = { value: VALUE_1 }
      foo.bar.push(insert)

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0]).toEqual(insert)
    })

    it('Should emit on added item update', async () => {
      const insert = { value: VALUE_1 }
      foo.bar.push(insert)
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar[0].value = VALUE_2

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0].value).toBe(VALUE_2)
    })

    it('Should emit on exiting item update', async () => {
      foo = new (Reactive.create(class {
        bar = [{ value: VALUE_1 }]
      } as any))
      
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar[0].value = VALUE_2

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0].value).toBe(VALUE_2)
    })

    it('Should emit on item delete', async () => {
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar.splice(0, 1)

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0]).toBe(undefined)
      expect(foo.bar.length).toBe(0)
    })
  })

  describe('Array (Array<Array<string>>) instance on top level', () => {
    let foo: Foo;
    class Foo {
      bar: Array<Array<string>> = []
    }

    beforeEach(() => {
      const $Foo = Reactive.create(Foo)
      foo = new $Foo()
    })

    it('Should emit on item add', async () => {
      const onValue = firstValueFrom(Reactive.observe(foo))
      const insert = [VALUE_1]
      foo.bar.push(insert)

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0][0]).toEqual(VALUE_1)
    })

    it('Should emit on item update', async () => {
      const insert = [VALUE_1]
      foo.bar.push(insert)
      const onValue = firstValueFrom(Reactive.observe(foo))

      foo.bar[0][0] = VALUE_2

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0][0]).toEqual(VALUE_2)
    })

    it('Should emit on item delete', async () => {
      const insert = [VALUE_1]
      foo.bar.push(insert)
      const onValue = firstValueFrom(Reactive.observe(foo))

      foo.bar[0].splice(0,1)

      expect(await onValue).toBe(undefined)
      expect(foo.bar[0][0]).toEqual(undefined)
      expect(foo.bar[0].length).toEqual(0)
    })
  })
})