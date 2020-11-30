<h1>Reactivity Observation Framework</h1>

This project introduces a tiny, unopinionated implementation that deeply watches JavaScript objects and arrays for mutations, additions, deletions.

<img align="left" src="https://img.shields.io/bundlephobia/minzip/@alshdavid/reactive" />
<img align="left" src="https://img.shields.io/badge/dependencies-0-success" />
<img align="left" src="https://img.shields.io/npm/v/@alshdavid/reactive" />
<br/>
<br/>

```javascript
import Reactive from '@alshdavid/reactive';

const foo = Reactive.create({
  values = []
})

Reactive.observe(foo).subscribe(() => console.log('Updated!'))

// Will trigger the callback
foo.values.push(0)
foo.values[0]++
```

- [Install](#install)
- [Usage](#usage)
  - [Object Instances](#object-instances)
  - [Patch Classes](#patch-classes)
  - [Deep initialization](#deep-initialization)
  - [Ignore Specified Instances](#ignore-specified-instances)
  - [React / Preact](#react--preact)
    - [Testing](#testing)

## Install

```shell
# npm
npm install --save @alshdavid/reactive

# yarn
yarn add @alshdavid/reactive
```

## Usage 

### Object Instances

Reactive will produce an observable proxy of an object instance, watching deeply for changes.

```javascript
import Reactive from '@alshdavid/reactive';

const foo = Reactive.create({
  values = []
})

Reactive.observe(foo).subscribe(() => console.log('Updated!'))

// Will trigger the callback
foo.values.push(0)
foo.values[0]++
```

### Patch Classes

Reactive can patch JavaScript class constructors so that the resulting instance will be deeply observable for changes.

```javascript
import Reactive from '@alshdavid/reactive';

class Foo {
  values = []
}

const $Foo = Reactive.create(Foo)
const foo = new $Foo()

Reactive.observe(foo).subscribe(() => console.log('Updated!'))

// Will trigger the callback
foo.values.push(0)
foo.values[0]++
```

### Deep initialization

Reactive will automatically traverse an object/array tree and initialize the properties as observable.

```javascript
import Reactive from '@alshdavid/reactive';

class Foo {
  title = 'Hello World'
}

class Bar {
  foo

  constructor(
    foo
  ) {
    this.foo = foo
  }
}

const $Bar = Reactive.create(Bar)

const foo = new Foo()
const bar = new $Bar(foo)

Reactive.observe(bar).subscribe(() => console.log('Updated!'))
Reactive.observe(bar.foo).subscribe(() => console.log('Updated!'))

bar.foo.title = 'updated'
```

In the above case, `foo` is not observable directly and must be observed through `bar` via `Reactive.observe(bar.foo)`.
If a property has been set as observable externally, then it will attach to it's existing mutation watchers.

```javascript
import Reactive from '@alshdavid/reactive';

class Foo {
  title = 'Hello World'
}

class Bar {
  foo

  constructor(
    foo
  ) {
    this.foo = foo
  }
}

const $Foo = Reactive.create(Foo)
const $Bar = Reactive.create(Bar)

const foo = new $Foo()
const bar = new $Bar(foo)

Reactive.observe(bar).subscribe(() => console.log('Updated!'))
Reactive.observe(foo).subscribe(() => console.log('Updated!'))

// Will trigger the observers for both "foo" and "bar"
foo.title = 'updated'
```

### Ignore Specified Instances

In some cases, you will want to avoid setting up on certain objects or types, for this reason use `Reactive.ignore`, or `Reactive.ignoreInstanceOf`

```javascript
import Reactive from '@alshdavid/reactive';

Reactive.ignore(window)
Reactive.ignoreInstanceOf(HTMLElement)

const foo = Reactive.create({
  _window: window,
  element: document.getElementById('app'),
  value: 0,
})

Reactive.observe(foo).subscribe(() => console.log('Updated!'))

// Won't trigger the callback
window.custom = 'update 1'
foo._window.custom = 'update 2'
foo.element.name = 'something'

// Will trigger the callback
foo.value = 1
```


### React / Preact

This library provides hooks for React and Preact to use the class observation implementation to create a view model for React or Preact.

```javascript
import React from 'react'
import VM from '@alshdavid/reactive/react'

export class AppComponent {
  value

  constructor(
    initialValue = 0,
  ) {
    this.value = initialValue
  }

  inc() {
    this.value++
  }

  dec() {
    this.value--
  }
}

export const App = () => {
  const vm = VM(AppComponent, [10])
  return <div>
    <button onClick={() => vm.inc()}>+</button>
    <button onClick={() => vm.dec()}>-</button>
    <h1>{vm.value}</h1>
  </div>
} 
```

#### Testing

This component's view model contains state and methods that describes its behavior entirely. 
Testing the presentation of the component is not required to ensure the behaviors are correct.

The tests would look like:

```javascript
import { AppComponent } from './app'

describe('AppComponent', () => {
  describe('constructor', () => {
    it('Should not throw', () => {
      const testFunc = () => new AppComponent()
      expect(testFunc).not.toThrow()
    })
  })
  
  describe('inc', () => {
    it('Should increment the value', () => {
      const appComponent = new AppComponent()
      appComponent.inc()
      expect(appComponent.value).toBe(1)
    })
  })
  
  describe('dec', () => {
    it('Should decrement the value', () => {
      const appComponent = new AppComponent()
      appComponent.dec()
      expect(appComponent.value).toBe(-1)
    })
  })
})
```

These tests verify that the component's logic is sound. Additional tests would be required to ensure the methods are connected to the correct buttons and the values are rendered into the correct elements.
