import Aspect from "../src/Aspect";

beforeEach(()=>{
    jest.clearAllMocks();
})

test('should not decorate function when disableAspect', () => {
    const decorator = Aspect({
        disableAspect: true
    })
    expect(decorator).toBeNull();
})

test('should ignore function', () => {
    const onEntry = jest.fn();
    const Decorator = Aspect({
        onEntry,
        ignoredFunctions: ['fnToIgnore']
    })
    @Decorator
    class ClassWithIgnore{
        fnToIgnore(){}
    }
    new ClassWithIgnore().fnToIgnore();
    expect(onEntry).not.toHaveBeenCalled();
})