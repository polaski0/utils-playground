export type Message = string;

export interface CommonLocale {
    default?: Message;
    required?: Message;
}

export interface ArrayLocale {
    default?: Message;
    min?: Message;
    max?: Message;
    contains?: Message;
}

export interface BooleanLocale {
    default?: Message;
}

export interface DateLocale {
    default?: Message;
}

export interface ObjectLocale {
    default?: Message;
}

export interface NumberLocale {
    default?: Message;
    min?: Message;
    max?: Message;
}

export interface StringLocale {
    default?: Message;
    min?: Message;
    max?: Message;
    matches?: Message;
}

export const common: Required<CommonLocale> = {
    default: "Invalid field.",
    required: "Required."
}

export const array: Required<ArrayLocale> = {
    default: "This field must be an array.",
    min: "This array must contain at least {min} items.",
    max: "This array cannot contain more than {max} items.",
    contains: "This array must include the specified value.",
}

export const boolean: Required<BooleanLocale> = {
    default: "This field must be a boolean value (true or false).",
}

export const date: Required<DateLocale> = {
    default: "This field must be a valid date.",
}

export const object: Required<ObjectLocale> = {
    default: "This field must be an object.",
}

export const number: Required<NumberLocale> = {
    default: "This field must be a number.",
    min: "This number must be at least {min}.",
    max: "This number cannot be greater than {max}.",
}

export const string: Required<StringLocale> = {
    default: "This field must be a string.",
    min: "This string must be at least {min} characters long.",
    max: "This string cannot be longer than {max} characters.",
    matches: "This string must match the required pattern.",
}
