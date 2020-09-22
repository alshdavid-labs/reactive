# View Models for React, Preact and Vanilla

### Keeping Web Applications Easy

This project introduces a tiny, unopinionated implementation for the automatic re-rendering of React components when an observed object instance is mutated.

<img align="left" src="https://img.shields.io/bundlephobia/minzip/@alshdavid/reactive" />
<img align="left" src="https://img.shields.io/badge/dependencies-0-success" />
<img align="left" src="https://img.shields.io/npm/v/@alshdavid/reactive" />
<br/>
<br/>

```javascript
import React from 'react';
import VM from '@alshdavid/reactive/react';

class AppComponent {
  value = 0
}

const App = () => {
  const vm = VM(AppComponent)

  return <div>
    <button onClick={() => vm.value++}>+</button>
    <button onClick={() => vm.value--}>-</button>
    <h1>{vm.value}</h1>
  </div>
}
```

## Rationale

Web frameworks like Angular, Vue and Svelte are fantastically ergonomic platforms for producing front end applications.

The simple template syntax allows developers to focus predominantly on solving the problem in front of them. The minimal boilerplate code ensures applications read easily and code bases are approachable.

These solutions, while incredible, are often very large and incorporate features that aren't always sensible for all projects.

Recently, there has been an upwards trend towards immutability, flux and large projects with plenty of boiler plate. 

While I agree that these patterns are useful and mutation can lead to issues without clear origins, I have personally felt net most productive when using frameworks that operate using mutable view models and services.

An objective with this library is to improve the testability of front end applications, as applications can be constructed entirely using their view models in the absence of the DOM and tested for functionality.

This decoupling also encourages engineers to write their applications using a framework agnostic approach, reducing the discarded code during framework updates or migrations.

This library uses a similar method to Vue, patching the original object instances to listen for changes but it also incorporates Proxies.

## Install

```shell
# npm
npm install --save @alshdavid/reactive

# yarn
yarn add @alshdavid/reactive
```

## Usage 

It all starts with the `VM` hook:

### Playgrounds

[StackBlitz - Simple React Demo](https://stackblitz.com/edit/reactive-with-react-simple?file=index.tsx)
<br>
[StackBlitz - React Demo with Dependency Injection](https://stackblitz.com/edit/reactive-with-react-dep-inj?file=app/home-page.tsx)

### React

```javascript
import VM from '@alshdavid/reactive/react';
```

The `VM` hook has several signatures, the most basic is the construction of classes or functions:

```javascript
class AppComponent {
  value = 0
}

const App = () => {
  const vm = VM(AppComponent)
  return <div>{vm.value}</div>
} 
```

If a class requires constructor arguments for dependency injection, you can supply them in an array as the second parameter:

```javascript
class AppComponent {
  value = undefined

  constructor(
    initialValue = 0,
  ) {
    this.value = initialValue
  }
}

const App = () => {
  const vm = VM(AppComponent, [10])
  return <div>{vm.value}</div>
} 
```

You can also pass an arrow function as the parameter and the return value of it's execution will be the used value.

```javascript
const App = () => {
  const vm = VM(() => new AppComponent(10))
  return <div>{vm.value}</div>
} 
```

You can also return plain objects

```javascript
const App = () => {
  const vm = VM(() => ({ value: 0 }))
  return <div>{vm.value}</div>
} 
```

If you wish to filter events so they only emit when certain properties update you can use the last argument to do so:

```javascript
// Will only rerender when "appComponent.value" changes
VM(AppComponent, [10], [
  appComponent => appComponent.value
])
```
Similarly:

```javascript
VM(() => new AppComponent(10), [
  appComponent => appComponent.value
])
```

### Preact

You can use Preact in the exact same way as the above React example, just use the following import:

```javascript
import VM from '@alshdavid/reactive/preact';
```

### Vanilla

The foundation of this project is based on top of this core package. It's designed to be consumed by any framework and is simply an agnostic object observation technique.

```javascript
import Reactive from '@alshdavid/reactive';

const foo = Reactive.create({ value: 0 })
const dispose = Reactive.observe(foo, console.log)

foo.value = 1
dispose()
```
 
 ### Testing

 A pillar of this project is enabling the testing of front end projects in a way that decouples them from the DOM.

 While the presentational framework deals with the rendering concerns; the application, its events and methods should aptly represent the aplication without a rendered representation.

 This approach allows you to initialize an entire application in memory, say in Node, without requiring a DOM implementation.

 The testing of the presentation layer can occur in a separate suite of tests.

 For example, say we have the following component and its view model:

```javascript
export class AppComponent {
  value = undefined

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

This component's view model contains state and methods that describes its behavior entirely. Testing the presentation of the component is not required to ensure the behaviors are correct.

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
