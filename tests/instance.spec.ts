import { firstValueFrom } from '@alshdavid/rxjs'
import Reactive from '../src/index'

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

describe('Object Instance', () => {
  describe('Top level properties', () => {
    let foo: Record<string, string>

    beforeEach(() => {
      foo = Reactive.create({})
    })

    it('Should emit on property update', async () => {
      foo.bar = VALUE_1
      expect(foo.bar).toBe(VALUE_1)

      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar = VALUE_2

      expect(await onValue).toBe(undefined)
      expect(foo.bar).toBe(VALUE_2)
    })

    it('Should emit on property add', async () => {
      const onValue = firstValueFrom(Reactive.observe(foo))
      foo.bar = VALUE_2

      expect(await onValue).toBe(undefined)
      expect(foo.bar).toBe(VALUE_2)
    })

    it('Should emit on property delete', async () => {
      foo.bar = VALUE_1
      expect(foo.bar).toBe(VALUE_1)

      const onValue = firstValueFrom(Reactive.observe(foo))
      delete foo.bar

      expect(await onValue).toBe(undefined)
      expect(foo.bar).toBe(undefined)
    })
  })
})