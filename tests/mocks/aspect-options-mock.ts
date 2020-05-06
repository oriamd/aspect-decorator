import { AspectOptions, AdviceFunction } from "../../lib/aspect-options";

const onEntry: AdviceFunction = jest.fn();
const onSuccess: AdviceFunction = jest.fn();
const onException: AdviceFunction = jest.fn(); 
const onExit: AdviceFunction = jest.fn();

export const mockOptions: AspectOptions = {
    onEntry,
    onSuccess,
    onException,
    onExit
}