import { ValidationError } from "./errors";

export type TOptions = {
    required: boolean;
};

export type TRule = {
    name: string;
    cb: (value: any) => boolean;
};

export type TValue = string | number | Record<any, any> | undefined | null;

export type TValidationError = ValidationError;
