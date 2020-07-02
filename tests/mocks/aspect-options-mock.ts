import { AspectOptions, AdviceFunction } from "../../lib/aspect-options";

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