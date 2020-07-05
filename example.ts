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