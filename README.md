# View Models for React/Preact

### Keeping Web Applications Easy

```javascript
import React from 'react';
import VM from '@alshdavid/reactive/react';

class AppComponent {
  value = 0
}

const App = () => {
  const vm = VM(() => new AppComponent())

  return <div>
    <button onClick={() => vm.value++}>+</button>
    <button onClick={() => vm.value--}>-</button>
    <h1>{vm.value}</h1>
  </div>
}
```

## Frameworks
<img width="150px" src="https://cdn.davidalsh.com/frameworks/react.png">

## Preact
<img width="170px" src="https://cdn.davidalsh.com/frameworks/preact.png">

## Stand Alone