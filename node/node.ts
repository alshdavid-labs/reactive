import Reactive from "../src/index"

const VALUE_1 = 'VALUE_1'
const VALUE_2 = 'VALUE_2'

const $Foo = Reactive.create(class Foo {
  bar = VALUE_1
})

const foo = new $Foo()
Reactive.observe(foo).subscribe(() => console.log('Updated'))

console.log(foo.bar)
foo.bar = VALUE_2
console.log(foo.bar)

