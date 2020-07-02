import { AspectOptions, AdviceFunction } from "../../src/aspect-options";

export const mockClassOptions: AspectOptions = {
    onEntry: jest.fn(),
    onSuccess: jest.fn(),
    onException: jest.fn(),
    onExit: jest.fn()
}

export const mockMethodOptions: AspectOptions = {
    onEntry: jest.fn(),
    onSuccess: jest.fn(),
    onException: jest.fn(),
    onExit: jest.fn()
}