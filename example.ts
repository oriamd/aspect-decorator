import AspectFactory from './lib/Aspect';
import { AspectOptions } from './lib/AspectOptions';


const options: AspectOptions = {
    onEntry: ({className, methodName, args}) => {
        console.log(`${className}/${methodName} started.`);
        console.log(`${className}/${methodName} params : `, JSON.stringify(args));
    },

    onSuccess: ({className, methodName, returnValue}) => {
        console.log(`${className}/${methodName} end. result = ${returnValue}`);
    },

    onException: ({className,methodName, error}) => {
        console.error(`${className}/${methodName} throw an error = `, JSON.stringify(error));
    }
}

const LogDecorator = AspectFactory(options);

@LogDecorator
class TestLogWithDecorator {
    testProperty: string = 'object instance value 123';

    set setter(a){
        console.log('getter');
    }

    addFunction(num1, num2) {
        return num1 + num2;
    }

    async asyncFunction(num1, num2) {
        console.log(`this test property value : ${this.testProperty} `);
        return JSON.stringify({ds:'asdasd',aaaa:'asdad',eee:'sadsad'});
    }

    errorFunction(num1, num2) {
        throw 'ERROR errorFunction exception';
    }

    async asyncErrorFunction(num1, num2) {
        throw 'ERROR asyncErrorFunction throw error';
    }

    static staticFunction(num1, num2){
        return num1 + num2;
    }

    functionRunner(foo){
        const retu = foo();
        console.log('test function reference', retu);
    }

}

async function example() {
    const testLog: TestLogWithDecorator = new TestLogWithDecorator();

    let startTime = new Date().getTime();

    testLog.addFunction(1, 2);

    const asyncFunctionResult = await testLog.asyncFunction(2, 2);
    console.log(`asyncFunction Result : ${asyncFunctionResult}`)

    try {
        testLog.errorFunction(2, 2);
    } catch (error) {
        console.log(`errorFunction throw : ${error}`)
    }
    try {
        await testLog.asyncErrorFunction(10, 2);
    } catch (error) {
        console.log(`asyncErrorFunction throw : ${error}`)
    }

    TestLogWithDecorator.staticFunction(2,3);

    let endTime = new Date().getTime();
    console.log('TestLogWithDecoratorTimer finished after : ' + (endTime - startTime));

    testLog.functionRunner(()=>testLog.addFunction(1,2));
}

example();