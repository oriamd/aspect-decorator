import Utils from "../utils";
import { FunctionArguments, AspectOptions, AdviceMetadata } from "./AspectOptions";

export default function Aspect(options?: AspectOptions) {
    options = {...defaultOptions, ...options};
    function decorator(target) {
        try {
            console.log(Object.getOwnPropertyNames(target));
            const staticMethodsDescriptors = getMethodsDescriptors(target, options);
            const methodsDescriptors = getMethodsDescriptors(target.prototype, options);
            const className = target.name;
            staticMethodsDescriptors.forEach(methodsDescriptor => applyDecoratorToMethod(target, className, methodsDescriptor.methodName, methodsDescriptor.propertyDescriptor, options));
            methodsDescriptors.forEach(methodsDescriptor => applyDecoratorToMethod(target.prototype, className, methodsDescriptor.methodName, methodsDescriptor.propertyDescriptor, options));

        } catch (error) {
            console.error(error);
        }
    }
    return !options?.disableAspect ? decorator : null;
}

function applyDecoratorToMethod(target: any, className: string, methodName: string, methodDescriptor: PropertyDescriptor, options: AspectOptions) {
    const originalMethod = methodDescriptor.value;
    if (!originalMethod) return;

    const argNames = Utils.getParamNames(originalMethod);
    const metadata: AdviceMetadata = {
        className,
        methodName
    }
    Object.defineProperty(target, methodName, 
        {
        ...methodDescriptor,
        value: function(...argsValues) {
            metadata.args = getFunctionArguments(argNames, argsValues);
            options.onEntry?.(metadata);

            handelReturnedValue(this, options, originalMethod, argsValues, metadata);

            if (metadata.returnValue?.then) {
                handelPromiseReturnedValue(options, metadata);
            }

            return metadata.returnValue;
        }
    })
}


async function handelPromiseReturnedValue(options, metadata :AdviceMetadata) {
    try {
        metadata.returnValue = await metadata.returnValue;
        !metadata.returnValue?.then && options.onSuccess?.(metadata);
    } catch (error) {
        metadata.error = error;
        options?.onException?.(metadata);
    } finally {
        !metadata.returnValue?.then && options?.onExit?.(metadata);
    }
}

function handelReturnedValue(scope, options: AspectOptions, originalMethod: Function, argsValues: any[], metadata :AdviceMetadata) {
    try{
        metadata.returnValue = originalMethod.apply(scope, argsValues);
        options.onSuccess?.(metadata);
    } catch (error) {
        metadata.error = error
        options.onException?.(metadata);
        throw error;
    } finally {
        options.onExit?.(metadata);
    }
}



const defaultOptions: AspectOptions = {
    disableAspect: false,
    ignoredFunctions: []
}

function getMethodsDescriptors(target: any, options: AspectOptions): {propertyDescriptor: PropertyDescriptor, methodName: string}[]{
    return Object.getOwnPropertyNames(target)
        .filter(methodName => {
            return !options.ignoredFunctions.includes(methodName) && typeof target[methodName] === 'function'
        })
        .map(methodName => ({propertyDescriptor: Object.getOwnPropertyDescriptor(target, methodName), methodName}));
}

// function methodsFilter(options: AspectOptions, methodName: string) {
//     return !options?.ignoredFunctions?.includes(methodName);
// }

// function staticFunctionsSelector(propertyDescriptor: PropertyDescriptor) {
//     return (
//         propertyDescriptor.writable &&
//         typeof propertyDescriptor.value === 'function' &&
//         propertyDescriptor.value
//     );
// }

function getFunctionArguments(argsNames: string[], values: any[]): FunctionArguments {
    let args = {};
    values.forEach((value, index) => {
        args[argsNames[index]] = value;
    });
    return args;
}