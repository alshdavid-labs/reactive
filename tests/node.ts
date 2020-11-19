import Reactive from "../src/index"
// import Reactive from "../index"
declare const util: any

class Foo {
  foo: {value: number, active?: boolean }[] = [
    { value: 1, active: true }]
}

const foo = Reactive.create(new Foo())
// const foo: any = Reactive.create([])

Reactive.observe(foo).subscribe(() => console.log('Update'))


setTimeout(() => console.log(JSON.stringify(foo, null, 2)), 1100)


// ;(foo as any)['__ReactiveState__'].next()

// foo.foo[1].value = 2
// console.log(3)
