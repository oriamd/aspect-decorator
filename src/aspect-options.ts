export interface AspectOptions {
    disableAspect?: boolean;
    ignoredFunctions?: string[];
    onEntry?: AdviceFunction;
    onSuccess?: AdviceFunction;
    onException?: AdviceFunction; 
    onExit?: AdviceFunction;
}

export interface AdviceMetadata {
    className?: string, 
    methodName?: string, 
    args?: any[], 
    returnValue?: any,
    error?: any
}

export type AdviceFunction = (params?: AdviceMetadata) => void;