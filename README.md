# View Models for React/Preact

### Keeping Web Applications Easy

This project introduces an unopinionated implementation for automatic re-rendering of React components when an observed object instance is mutated.

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

## Introduction



Web frameworks like Angular, Vue and Svelte are fantastically ergonomic platforms for producing front end applications.

The simple template syntax allows developers to focus predominantly on solving the problem in front of them. The minimal boilerplate code ensures applications read easily and code bases are approachable.

These solutions, while incredible, are often very large and incorporate features that aren't always sensible for all projects.

There has been a shift towards immutability, flux and large projects with plenty of boiler plate. While I agree that these patterns are useful and mutation can lead to issues without clear origins, I have personally felt net most productive when using frameworks that operate using mutable view models and services.
 