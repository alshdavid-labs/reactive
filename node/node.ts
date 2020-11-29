import { firstValueFrom } from "@alshdavid/rxjs"
import Reactive from "../src/index"

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

const foo = Reactive.create({
  bar: VALUE_1
})
// const foo = new $Foo()
Reactive.observe(foo).subscribe(() => console.log('hi'))

foo.bar = VALUE_2

// import { Subject } from '@alshdavid/rxjs/rxjs-compat'

// console.log(Subject)

// import Reactive from "../src/index"
// // import Reactive from "../index"
// declare const util: any

// class Foo {
//   foo: {value: number, active?: boolean }[] = [
//     { value: 1, active: true }]
// }

// const foo = Reactive.create(new Foo())
// // const foo: any = Reactive.create([])

// Reactive.observe(foo).subscribe(() => console.log('Update'))


// setTimeout(() => console.log(JSON.stringify(foo, null, 2)), 1100)


// // ;(foo as any)['__ReactiveState__'].next()

// // foo.foo[1].value = 2
// // console.log(3)
