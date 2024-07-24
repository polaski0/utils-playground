export class ValidationError extends Error {
    name: string;
    value: any;
    constructor(name: string, value: any) {
        super(name);
        this.name = name;
        this.value = value;
    }
}
