import { MethodsMock } from "./mocks/methods-mock";

const methodMock = new MethodsMock();

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('Method Behavior', () => {

    describe('Success Functions', () => {
        test('function should return correct value', () => {
            expect(methodMock.fn(1,2)).toEqual({a:1,b:2});
        })
        
        test('Async/Await Function should return the correct value', async () => {
            const value = await methodMock.fnAsync(1,2);
            expect(value).toEqual({a:1,b:2});
        })

        test('function should resolve correct value', (done) => {
            methodMock.fnAsync(1,2).then((value)=>{
                expect(value).toEqual({a:1,b:2});
                done();
            })
        })

        test('static function should return correct value', () => {
            expect(MethodsMock.fnStatic(1,2)).toEqual({a:1,b:2});
        })
    })

    describe('Failure Functions', () => {
        test('function should throw correct error', () => {
            try {
                methodMock.errorFn(1,2);
            } catch (error) {
                expect(error).toEqual({a:1,b:2})
            }
        })
        
        test('Async/Await function should throw correct error', async () => {
            try {
                await methodMock.errorFnAsync(1,2);
            } catch (error) {
                expect(error).toEqual({a:1,b:2})
            }
        })

        test('function should reject correct error', (done) => {
            methodMock.errorFnAsync(1,2).catch((error)=>{
                expect(error).toEqual({a:1,b:2})
                done();
            });
        })

        test('static function should throw correct error', () => {
            try{
                MethodsMock.errorFnStatic(1,2);
            }catch(error){
                expect(error).toEqual({a:1,b:2})
            }
        })
    })

})