import { ClassMock } from "./mocks/class-mock";
import { AdviceMetadata } from "..";
import { MethodsMock } from "./mocks/methods-mock";

beforeEach(()=>{
    jest.clearAllMocks();
})
enum MocksNames {
    Method = "MethodsMock",
    Class = "ClassMock",
}
const mocks = {
    [MocksNames.Method]: MethodsMock,
    [MocksNames.Class]: ClassMock,
};

describe.each(Object.values(MocksNames))(
    "%s Behavior", (mockName: MocksNames) => {

    const Mock = mocks[mockName];

    const mock = new Mock();

    let adviceMetadata: AdviceMetadata;
    beforeEach(()=>{
        adviceMetadata = {
            className: mockName
        }
    })

    describe('Success Functions', () => {
        test('function should return correct value', () => {
            expect(mock.fn(1,2)).toEqual({a:1,b:2});
        })
        
        test('Async/Await Function should return the correct value', async () => {
            const value = await mock.fnAsync(1,2);
            expect(value).toEqual({a:1,b:2});
        })

        test('function should resolve correct value', (done) => {
            mock.fnAsync(1,2).then((value)=>{
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
                mock.errorFn(1,2);
            } catch (error) {
                expect(error).toEqual({a:1,b:2})
            }
        })
        
        test('Async/Await function should throw correct error', async () => {
            try {
                await mock.errorFnAsync(1,2);
            } catch (error) {
                expect(error).toEqual({a:1,b:2})
            }
        })

        test('function should reject correct error', (done) => {
            mock.errorFnAsync(1,2).catch((error)=>{
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

})