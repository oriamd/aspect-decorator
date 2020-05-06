import { ClassMock } from "./mocks/class-mock";
import { mockOptions } from "./mocks/aspect-options-mock";

const classMock = new ClassMock();

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('Success Functions', () => {
    test('should call advice on function call', () => {
        classMock.fn(1,2);
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onSuccess).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onException).not.toHaveBeenCalled();
    })
    
    test('should call advice Async/Await Function call', async () => {
        await classMock.fnAsync(1,2);
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onSuccess).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onException).not.toHaveBeenCalled();
    })

    test('should call advice on Function Promise.then call', (done) => {
        classMock.fnAsync(1,2).then(()=>{
            expect(mockOptions.onEntry).toHaveBeenCalled();
            expect(mockOptions.onSuccess).toHaveBeenCalled();
            expect(mockOptions.onExit).toHaveBeenCalled();
            expect(mockOptions.onException).not.toHaveBeenCalled();
            done();
        })
    })

    test('should call advice on Static Function call', () => {
        ClassMock.fnStatic(1,2);
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onSuccess).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onException).not.toHaveBeenCalled();
    })
})

describe('Failure Functions', () => {
    test('should call advice on functions call', () => {
        try {
            classMock.errorFn(1,2);
        } catch (error) {}
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onException).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onSuccess).not.toHaveBeenCalled();
    })
    
    test('should call advice on Async/Await Function call', async () => {
        try {
            await classMock.errorFnAsync(1,2);
        } catch (error) {}
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onException).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onSuccess).not.toHaveBeenCalled();
    })

    test('should call advice on Function Promise.catch call', (done) => {
        classMock.errorFnAsync(1,2).catch(()=>{
            expect(mockOptions.onEntry).toHaveBeenCalled();
            expect(mockOptions.onException).toHaveBeenCalled();
            expect(mockOptions.onExit).toHaveBeenCalled();
            expect(mockOptions.onSuccess).not.toHaveBeenCalled();
            done();
        });
    })

    test('should call advice on Static Function call', () => {
        try{
            ClassMock.errorFnStatic(1,2);
        }catch(error){}
        expect(mockOptions.onEntry).toHaveBeenCalled();
        expect(mockOptions.onException).toHaveBeenCalled();
        expect(mockOptions.onExit).toHaveBeenCalled();
        expect(mockOptions.onSuccess).not.toHaveBeenCalled();
    })
})