import { mockClassOptions } from "./aspect-options-mock";
import Aspect from "../../lib/aspect";

const mockDecorator = Aspect(mockClassOptions);

@mockDecorator
export class ClassMock {
    
    fn(a?, b?): {a:any,b:any}{
        return {a,b};
    }
    
    async fnAsync(a?,b?): Promise<{a:any,b:any}> {
        return {a,b};
    }

    static fnStatic(a?,b?): {a:any,b:any}{
        return {a,b};
    }

    errorFn(a?, b?){
        throw {a,b};
    }
    
    async errorFnAsync(a,b){
        throw {a,b};
    }

    static errorFnStatic(a?,b?){
        throw {a,b};
    }
};