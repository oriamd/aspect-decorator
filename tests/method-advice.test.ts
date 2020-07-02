import { mockMethodOptions } from "./mocks/aspect-options-mock";
import { MethodsMock } from "./mocks/methods-mock";

const methodMock = new MethodsMock();

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('Method Advice', () => {

    describe('Success Functions', () => {
        test('should call advice on function call', () => {
            methodMock.fn(1,2);
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onException).not.toHaveBeenCalled();
        })
        
        test('should call advice Async/Await Function call', async () => {
            await methodMock.fnAsync(1,2);
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onException).not.toHaveBeenCalled();
        })

        test('should call advice on Function Promise.then call', (done) => {
            methodMock.fnAsync(1,2).then(()=>{
                expect(mockMethodOptions.onEntry).toHaveBeenCalled();
                expect(mockMethodOptions.onSuccess).toHaveBeenCalled();
                expect(mockMethodOptions.onExit).toHaveBeenCalled();
                expect(mockMethodOptions.onException).not.toHaveBeenCalled();
                done();
            })
        })

        test('should call advice on Static Function call', () => {
            MethodsMock.fnStatic(1,2);
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onException).not.toHaveBeenCalled();
        })
    })

    describe('Failure Functions', () => {
        test('should call advice on functions call', () => {
            try {
                methodMock.errorFn(1,2);
            } catch (error) {}
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onException).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).not.toHaveBeenCalled();
        })
        
        test('should call advice on Async/Await Function call', async () => {
            try {
                await methodMock.errorFnAsync(1,2);
            } catch (error) {}
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onException).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).not.toHaveBeenCalled();
        })

        test('should call advice on Function Promise.catch call', (done) => {
            methodMock.errorFnAsync(1,2).catch(()=>{
                expect(mockMethodOptions.onEntry).toHaveBeenCalled();
                expect(mockMethodOptions.onException).toHaveBeenCalled();
                expect(mockMethodOptions.onExit).toHaveBeenCalled();
                expect(mockMethodOptions.onSuccess).not.toHaveBeenCalled();
                done();
            });
        })

        test('should call advice on Static Function call', () => {
            try{
                MethodsMock.errorFnStatic(1,2);
            }catch(error){}
            expect(mockMethodOptions.onEntry).toHaveBeenCalled();
            expect(mockMethodOptions.onException).toHaveBeenCalled();
            expect(mockMethodOptions.onExit).toHaveBeenCalled();
            expect(mockMethodOptions.onSuccess).not.toHaveBeenCalled();
        })
    })

})