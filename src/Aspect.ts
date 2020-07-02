import { AspectOptions, AdviceMetadata } from "./aspect-options";

export default function Aspect(options?: AspectOptions): any {
    options = {...defaultOptions, ...options};
    function decorator(target, propertyKey: string, descriptor: PropertyDescriptor): any {
        try {
            let staticMethodsDescriptors = [];
            let methodsDescriptors = [];
            if(!propertyKey && !descriptor){ // If decorating Class
                staticMethodsDescriptors = getMethodsDescriptors(target, options);
                methodsDescriptors = getMethodsDescriptors(target.prototype, options);
                const className = target.name;
                staticMethodsDescriptors.forEach(methodsDescriptor => applyDecoratorToMethod(target, className, methodsDescriptor.methodName, methodsDescriptor.propertyDescriptor, options));
                methodsDescriptors.forEach(methodsDescriptor => applyDecoratorToMethod(target.prototype, className, methodsDescriptor.methodName, methodsDescriptor.propertyDescriptor, options));  
            } else { // If decorating method
                const className = target.constructor.name;
                applyDecoratorToMethod(target, className, propertyKey, descriptor, options, true)
            }
            

        } catch (error) {
            console.error(error);
        }
    }
    return !options?.disableAspect ? decorator : null;
}

function applyDecoratorToMethod(target: any, className: string, methodName: string, methodDescriptor: PropertyDescriptor, options: AspectOptions, is_method_decorator: boolean = false) {
    const originalMethod = methodDescriptor.value;
    if (!originalMethod) return;
    const metadata: AdviceMetadata = {
        className,
        methodName
    }
    const replacementMethod = (...argsValues) => {
        metadata.args = argsValues;
        options.onEntry?.(metadata);
        let returnValue
        try {
            returnValue = originalMethod.apply(this, argsValues)
            if(returnValue?.then){
                handelPromiseReturnedValue(returnValue, options, metadata);
            }else {
                metadata.returnValue = returnValue;
                options.onSuccess?.(metadata);
            }
            return returnValue;
        } catch (error) {
            metadata.error = error;
            options.onException?.(metadata);
            throw error;
        } finally{
            !returnValue?.then && options.onExit?.(metadata);
        }
    }
    if(is_method_decorator) {
        methodDescriptor.value = replacementMethod;
    } else { // Class Decorator
        Object.defineProperty(target, methodName, 
            {
            ...methodDescriptor,
            value: replacementMethod
        })
    }
}


async function handelPromiseReturnedValue(promiseValue, options, metadata :AdviceMetadata) {
    try {
        metadata.returnValue = await promiseValue;
        options.onSuccess?.(metadata);
    } catch (error) {
        metadata.error = error;
        options.onException?.(metadata);
    } finally {
        !metadata.returnValue?.then && options.onExit?.(metadata);
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