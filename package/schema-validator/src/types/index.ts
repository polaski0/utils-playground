import { ValidationError } from "./errors";

export type TOptions = {
    required: boolean,
};

export type TRule = {
    name: string,
    cb: (value: any) => boolean,
    message: string,
};

export type TValue = string | number | Record<any, any> | undefined | null;

export type TValidationError = ValidationError;

export type TResult<T> = {
    valid: boolean,
    output?: T,
    issues?: TIssue[],
}

export type TIssue = {
    type: string,
    input: unknown,
    expected: unknown,
    received: unknown,
    message: string,
}
