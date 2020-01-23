import Utils from "../utils";
import { FunctionArguments, AspectOptions, AdviceMetadata } from "./AspectOptions";

export default function Aspect(options?: AspectOptions) {
    options = {...defaultOptions, ...options};
    function decorator(class_target) {
        try {
            Object.getOwnPropertyNames(class_target.prototype)
                .filter((methodName)=>methodsFilter(options, methodName))
                .forEach(methodName =>
                    applyDecoratorToMethod(options, class_target.name, class_target.prototype, methodName),
                );
            Object.values(Object.getOwnPropertyDescriptors(class_target))
                .filter(staticFunctionsSelector)
                .filter((staticFunctionsSelector)=>methodsFilter(options, staticFunctionsSelector.value.name))
                .forEach((staticFunction: PropertyDescriptor) =>
                    applyDecoratorToMethod(options, class_target.name, class_target, staticFunction.value.name),
                );
        } catch (error) {
            console.log(error);
        }
    }
    return !options?.disableAspect ? decorator : null;
}

function applyDecoratorToMethod(options: AspectOptions, class_name, class_target, methodName: string) {
    let methodDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
        class_target,
        methodName,
    );
    if (!methodDescriptor && typeof methodDescriptor.value !== 'function') return;
    const originalMethod = methodDescriptor.value;
    if (!originalMethod) return;

    const argNames = Utils.getParamNames(originalMethod);

    class_target[methodName] = function(...argsValues) {
        let className = class_name;
        let args: FunctionArguments = getFunctionArguments(argNames, argsValues);
        try {
            options?.onEntry({className, methodName, args});
            
            let returnValue = originalMethod.apply(this, argsValues);

            if (returnValue && returnValue.then) {
                handelPromiseReturnedValue(options, returnValue, {className, methodName, args, returnValue});
            } else {
                options?.onSuccess({className, methodName, args, returnValue});
                options?.onExit({className, methodName, args, returnValue});
            }
            return returnValue;
        } catch (error) {
            options?.onException({className, methodName, args, error});
            options?.onExit({className, methodName, args, error});
            throw error;
        }
    };
}

async function handelPromiseReturnedValue(options, returnedPromise, {className, methodName, args }:AdviceMetadata) {
    try {
        let returnValue = await returnedPromise;
        options?.onEntry({className, methodName, args, returnValue});
        options?.onExit({className, methodName, args, returnValue});
    } catch (error) {
        options?.onException({className, methodName, args, error});
        options?.onExit({className, methodName, args, error});
    }
}

const defaultOptions: AspectOptions = {
    disableAspect: false,
    ignoredFunctions: [],
    onEntry: ()=>{},
    onSuccess: ()=>{},
    onException: ()=>{},
    onExit: ()=>{},
}

function methodsFilter(options: AspectOptions, methodName: string) {
    return !options?.ignoredFunctions?.includes(methodName);
}

function staticFunctionsSelector(propertyDescriptor: PropertyDescriptor) {
    return (
        propertyDescriptor.writable &&
        typeof propertyDescriptor.value === 'function' &&
        propertyDescriptor.value
    );
}

function getFunctionArguments(argsNames: string[], values: any[]): FunctionArguments {
    let args = {};
    values.forEach((value, index) => {
        args[argsNames[index]] = value;
    });
    return args;
}