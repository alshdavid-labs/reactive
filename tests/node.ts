import Reactive from "../src/index"
// import Reactive from "../index"
declare const util: any

class Bar {
  bar = 'text'
}

class Foo {
  constructor(public bar: Bar) {
    // setTimeout(() => this.bar.bar = 'updated', 100)
    // setTimeout(() => this.foo.push({ value: 2 }), 200)
  }
  foo: {value: number}[] = [{ value: 1 }]
}

const bar = Reactive.create(new Bar())
const foo = Reactive.create(new Foo(bar))
// const foo: any = Reactive.create([])

Reactive.observe(foo).subscribe(() => console.log('Update'))

foo.bar.bar = 'update'

setTimeout(() => console.log(JSON.stringify(foo, null, 2)), 1100)


// ;(foo as any)['__ReactiveState__'].next()

// foo.foo[1].value = 2
// console.log(3)
