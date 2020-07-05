import { ClassMock } from "./mocks/class-mock";
import { mockClassOptions } from "./mocks/aspect-options-mock";
import { mockMethodOptions } from "./mocks/aspect-options-mock";
import { MethodsMock } from "./mocks/methods-mock";
import { AdviceMetadata } from "../src/aspect-options";

beforeEach(() => {
    jest.clearAllMocks();
});
enum MocksNames {
    Method = "MethodsMock",
    Class = "ClassMock",
}
const mocks = {
    [MocksNames.Method]: MethodsMock,
    [MocksNames.Class]: ClassMock,
};
const mocksOptions = {
    [MocksNames.Method]: mockMethodOptions,
    [MocksNames.Class]: mockClassOptions,
};

describe.each(Object.values(MocksNames))(
    "%s Advice",
    (mockName: MocksNames) => {

        const Mock = mocks[mockName];
        const mockOptions = mocksOptions[mockName];

        const mock = new Mock();

        let adviceMetadata: AdviceMetadata;
        beforeEach(()=>{
            adviceMetadata = {
                className: mockName
            }
        })

        describe("Success Functions", () => {
            test("should call advice on function call", () => {
                adviceMetadata.methodName = 'fn';
                adviceMetadata.args = [1,2];
                const returnValue = mock.fn(...adviceMetadata.args);
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.returnValue = returnValue;
                expect(mockOptions.onSuccess).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });

            test("should call advice Async/Await Function call", async () => {
                adviceMetadata.methodName = 'fnAsync';
                adviceMetadata.args = [1,2];
                const returnValue = await mock.fnAsync(1, 2);
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.returnValue = returnValue;
                expect(mockOptions.onSuccess).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });

            test("should call advice on Function Promise.then call", (done) => {
                adviceMetadata.methodName = 'fnAsync';
                adviceMetadata.args = [1,2];
                mock.fnAsync(1, 2).then((returnValue) => {
                    expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onSuccess).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onException).not.toHaveBeenCalled();

                    expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                    adviceMetadata.returnValue = returnValue;
                    expect(mockOptions.onSuccess).toHaveBeenCalledWith(adviceMetadata);
                    expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
                    done();
                });
            });

            test("should call advice on Static Function call", () => {
                adviceMetadata.methodName = 'fnStatic';
                adviceMetadata.args = [1,2];
                const returnValue = Mock.fnStatic(1, 2);
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.returnValue = returnValue;
                expect(mockOptions.onSuccess).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });
        });

        describe("Failure Functions", () => {
            test("should call advice on functions call", () => {
                adviceMetadata.methodName = 'errorFn';
                adviceMetadata.args = [1,2];
                let returnedError;
                try {
                    mock.errorFn(1, 2);
                } catch (error) {
                    returnedError = error;
                }
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.error = returnedError;
                expect(mockOptions.onException).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });

            test("should call advice on Async/Await Function call", async () => {
                adviceMetadata.methodName = 'errorFnAsync';
                adviceMetadata.args = [1,2];
                let returnedError;
                try {
                    await mock.errorFnAsync(1, 2);
                } catch (error) {
                    returnedError = error;
                }
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.error = returnedError;
                expect(mockOptions.onException).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });

            test("should call advice on Function Promise.catch call", (done) => {
                adviceMetadata.methodName = 'errorFnAsync';
                adviceMetadata.args = [1,2];
                mock.errorFnAsync(1, 2).catch((returnedError) => {
                    expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onException).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                    expect(mockOptions.onSuccess).not.toHaveBeenCalled();

                    expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                    adviceMetadata.error = returnedError;
                    expect(mockOptions.onException).toHaveBeenCalledWith(adviceMetadata);
                    expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
                    done();
                });
            });

            test("should call advice on Static Function call", () => {
                adviceMetadata.methodName = 'errorFnStatic';
                adviceMetadata.args = [1,2];
                let returnedError;
                try {
                    Mock.errorFnStatic(1, 2);
                } catch (error) {
                    returnedError = error;
                }
                expect(mockOptions.onEntry).toHaveBeenCalledTimes(1);
                expect(mockOptions.onException).toHaveBeenCalledTimes(1);
                expect(mockOptions.onExit).toHaveBeenCalledTimes(1);
                expect(mockOptions.onSuccess).not.toHaveBeenCalled();

                expect(mockOptions.onEntry).toHaveBeenCalledWith(adviceMetadata);
                adviceMetadata.error = returnedError;
                expect(mockOptions.onException).toHaveBeenCalledWith(adviceMetadata);
                expect(mockOptions.onExit).toHaveBeenCalledWith(adviceMetadata);
            });
        });
    }
);
