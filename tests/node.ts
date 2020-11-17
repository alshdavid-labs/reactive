// import Reactive from "../src/index"
import * as Reactive from "../src/create-2"

class Foo {
  foo: {value: number}[] = [{ value: 1 }]
}



const foo = Reactive.create(new Foo())

Reactive.observe(foo).subscribe(console.log)


foo.foo.push({value: 2})

console.log(foo)
console.log(foo.foo)
// console.log(1)
// foo.foo[0].value = 2
// console.log(2)
// ;(foo as any)['__ReactiveState__'].next()

// foo.foo[1].value = 2
// console.log(3)
