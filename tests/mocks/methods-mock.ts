import { mockClassOptions, mockMethodOptions } from "./aspect-options-mock";
import Aspect from "../../lib/aspect";

const mockDecorator = Aspect(mockMethodOptions);

export class MethodsMock {
    @mockDecorator
    fn(a?, b?): {a:any,b:any}{
        return {a,b};
    }
    @mockDecorator
    async fnAsync(a?,b?): Promise<{a:any,b:any}> {
        return {a,b};
    }
    @mockDecorator
    static fnStatic(a?,b?): {a:any,b:any}{
        return {a,b};
    }
    @mockDecorator
    errorFn(a?, b?){
        throw {a,b};
    }
    @mockDecorator
    async errorFnAsync(a,b){
        throw {a,b};
    }
    @mockDecorator
    static errorFnStatic(a?,b?){
        throw {a,b};
    }
};