import { ClassMock } from "./mocks/class-mock";
import { mockOptions } from "./mocks/aspect-options-mock";

const classMock = new ClassMock();

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('Success Functions', () => {
    test('function should return correct value', () => {
        expect(classMock.fn(1,2)).toEqual({a:1,b:2});
    })
    
    test('Async/Await Function should return the correct value', async () => {
        const value = await classMock.fnAsync(1,2);
        expect(value).toEqual({a:1,b:2});
    })

    test('function should resolve correct value', (done) => {
        classMock.fnAsync(1,2).then((value)=>{
            expect(value).toEqual({a:1,b:2});
            done();
        })
    })

    test('static function should return correct value', () => {
        expect(ClassMock.fnStatic(1,2)).toEqual({a:1,b:2});
    })
})

describe('Failure Functions', () => {
    test('function should throw correct error', () => {
        try {
            classMock.errorFn(1,2);
        } catch (error) {
            expect(error).toEqual({a:1,b:2})
        }
    })
    
    test('Async/Await function should throw correct error', async () => {
        try {
            await classMock.errorFnAsync(1,2);
        } catch (error) {
            expect(error).toEqual({a:1,b:2})
        }
    })

    test('function should reject correct error', (done) => {
        classMock.errorFnAsync(1,2).catch((error)=>{
            expect(error).toEqual({a:1,b:2})
            done();
        });
    })

    test('static function should throw correct error', () => {
        try{
            ClassMock.errorFnStatic(1,2);
        }catch(error){
            expect(error).toEqual({a:1,b:2})
        }
    })
})