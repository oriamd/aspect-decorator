import { ClassMock } from "./mocks/class-mock";
import { mockClassOptions } from "./mocks/aspect-options-mock";

const classMock = new ClassMock();

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('Class Advice', () => {

    describe('Success Functions', () => {
        test('should call advice on function call', () => {
            classMock.fn(1,2);
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onException).not.toHaveBeenCalled();
        })
        
        test('should call advice Async/Await Function call', async () => {
            await classMock.fnAsync(1,2);
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onException).not.toHaveBeenCalled();
        })

        test('should call advice on Function Promise.then call', (done) => {
            classMock.fnAsync(1,2).then(()=>{
                expect(mockClassOptions.onEntry).toHaveBeenCalled();
                expect(mockClassOptions.onSuccess).toHaveBeenCalled();
                expect(mockClassOptions.onExit).toHaveBeenCalled();
                expect(mockClassOptions.onException).not.toHaveBeenCalled();
                done();
            })
        })

        test('should call advice on Static Function call', () => {
            ClassMock.fnStatic(1,2);
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onException).not.toHaveBeenCalled();
        })
    })

    describe('Failure Functions', () => {
        test('should call advice on functions call', () => {
            try {
                classMock.errorFn(1,2);
            } catch (error) {}
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onException).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).not.toHaveBeenCalled();
        })
        
        test('should call advice on Async/Await Function call', async () => {
            try {
                await classMock.errorFnAsync(1,2);
            } catch (error) {}
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onException).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).not.toHaveBeenCalled();
        })

        test('should call advice on Function Promise.catch call', (done) => {
            classMock.errorFnAsync(1,2).catch(()=>{
                expect(mockClassOptions.onEntry).toHaveBeenCalled();
                expect(mockClassOptions.onException).toHaveBeenCalled();
                expect(mockClassOptions.onExit).toHaveBeenCalled();
                expect(mockClassOptions.onSuccess).not.toHaveBeenCalled();
                done();
            });
        })

        test('should call advice on Static Function call', () => {
            try{
                ClassMock.errorFnStatic(1,2);
            }catch(error){}
            expect(mockClassOptions.onEntry).toHaveBeenCalled();
            expect(mockClassOptions.onException).toHaveBeenCalled();
            expect(mockClassOptions.onExit).toHaveBeenCalled();
            expect(mockClassOptions.onSuccess).not.toHaveBeenCalled();
        })
    })

})