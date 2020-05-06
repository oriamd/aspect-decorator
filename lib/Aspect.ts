import Utils from "../utils";
import { AspectOptions, AdviceMetadata } from "./aspect-options";

export default function Aspect(options?: AspectOptions) {
    options = {...defaultOptions, ...options};
    function decorator(target) {
        try {
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
    const metadata: AdviceMetadata = {
        className,
        methodName
    }
    Object.defineProperty(target, methodName, 
        {
        ...methodDescriptor,
        value: function(...argsValues) {
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
    })
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