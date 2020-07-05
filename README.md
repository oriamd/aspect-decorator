# aspect-decorator

Aspect decorator is a Typescript library that implements the Aspect Oriented Programming paradigm by adding additional behavior to an existing code without having to modify it.

This additional behavior can be done by defining an Advice functions which will get executed on methods calls `onEntry`, `onSuccess`, `onExit`, `onException` .

The advice functions will have access to the methods calls metadata such as arguments and return value as well method declaration metadata such as class name and method name.

### Example

```javascript
import AspectFactory from './src/Aspect';

const LogDecorator = AspectFactory({
    onEntry: ({className, methodName, args}) => {
        console.log(`${className}/${methodName} entry with parameters :`, JSON.stringify(args));
    },

    onExit: ({className, methodName, returnValue: returnValue}) => {
        console.log(`${className}/${methodName} exits with result : `, JSON.stringify(returnValue));
    }
})

@LogDecorator
class WithLogs{
    add(a: number, b: number): number{
        return a + b;
    }
}

const withLogs = new WithLogs();
withLogs.add(1,2);
// => WithLogs/add entry with parameters : [1,2]
// => WithLogs/add exits with result :  3

```

# Installation

```
npm install aspect-decorator
```

tsconfig.json
```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
    }
}
```

# Aspect Factory

```javascript
function Aspect(options?: AspectOptions): any 
```

# Aspect Options 
```javascript
interface AspectOptions {
    disableAspect?: boolean; // will not call advice functions
    ignoredFunctions?: string[]; // methods which will not be called
    onEntry?: AdviceFunction; 
    onSuccess?: AdviceFunction;
    onException?: AdviceFunction;
    onExit?: AdviceFunction;
}
```

# Advice Functions
```javascript
declare type AdviceFunction = (params?:AdviceMetadata)=> void;
```

`onEntry` - Called on method invoke (will not receive returnValue)

`onSuccess` - Called on method success exit

`onException` - Called on method exit with error (will not receive returnValue)

`onExit` - Called on method exit no matter the result (returnValue and error will be provided depending on method outcome)

### AdviceMetadata
```javascript
interface AdviceMetadata {
    className?: string;
    methodName?: string;
    args?: any[];
    returnValue?: any;
    error?: any;
}
```