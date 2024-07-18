type TOptions = {
  required: boolean;
};

type TRule = {
  name: string;
  cb: (value: any) => boolean;
};

type TValue = string | number | Record<any, any> | undefined | null;

type TValidationError = ValidationError;

class ValidationError {
  name: string;
  value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

class BaseV {
  _rules: TRule[];
  _options: TOptions;
  errors: ValidationError[];
  isValid: boolean;

  constructor() {
    this._options = {
      required: false,
    };
    this._rules = [];
    this.errors = [];
    this.isValid = true;
  }

  rule(name: string, cb: (value: any) => boolean, opts = {}) {
    this._rules.push({ name, cb, ...opts });
    return this;
  }

  required() {
    this._options.required = true;
    return this.rule(
      "Required",
      (value: any) => value !== undefined && value !== null && value !== "",
    );
  }

  validate<T extends TValue>(value: T) {
    if (!this._isEmpty(value) || this._options.required) {
      this._rules.forEach((rule) => {
        const ok = rule.cb(value);
        if (!ok) {
          this.isValid = false;
          this._addError(new ValidationError(rule.name, value));
        }
      });
    }

    return this;
  }

  /** Push error to _errors array */
  _addError(err: TValidationError | TValidationError[]) {
    if (err instanceof Array) {
      this.errors.push(...err);
    } else {
      this.errors.push(err);
    }
  }

  _isEmpty<T>(value: T) {
    if (value instanceof Array) {
      return value.length > 0 ? false : true;
    }

    if (typeof value === "object" && value !== null) {
      return Object.entries(value).length > 0 ? false : true;
    }

    return !(value !== undefined && value !== null && value !== "");
  }
}

class StringV extends BaseV {
  constructor() {
    super();
    this.rule("String", (value) => typeof value === "string");
  }

  min(num: number) {
    return this.rule(
      "Min",
      (value) => typeof value === "string" && value.length >= num,
    );
  }

  max(num: number) {
    return this.rule(
      "Max",
      (value) => typeof value === "string" && value.length <= num,
    );
  }
}

class NumberV extends BaseV {
  constructor() {
    super();
    this.rule("Number", (value) => typeof value === "number");
  }

  min(num: number) {
    return this.rule(
      "Min",
      (value) => typeof value === "number" && value >= num,
    );
  }

  max(num: number) {
    return this.rule(
      "Min",
      (value) => typeof value === "number" && value <= num,
    );
  }
}

type TObjectSchema = Record<string, BaseV>;

class ObjectV extends BaseV {
  _schema: TObjectSchema;

  constructor(schema: TObjectSchema) {
    super();
    this._schema = schema;
  }

  /** Fix recursive validation of object */
  validate<T extends Record<any, any>>(value: T): this {
    if (typeof value !== "object" && value !== null) {
      this.isValid = false;
      this._addError(new ValidationError("Invalid Object", value));
    } else {
      for (const key in this._schema) {
        const _b = this._schema[key].validate((value as TObjectSchema)[key]);
        if (!_b.isValid) {
          this._addError(_b.errors);
          this.isValid = false;
        }
      }
    }

    return this;
  }
}

const s = {
  string: () => new StringV(),
  number: () => new NumberV(),
  object: (schema: Record<string, BaseV>) => new ObjectV(schema),
};

const objectSchema = s.object({
  name: s.string().required(),
  age: s.number().required(),
  address: s.object({
    zipCode: s.string().required(),
    street_1: s.string(),
  }),
});

const data = {
  name: "John",
  age: 21,
  address: {
    zipCode: "1111",
  },
};

const result = objectSchema.validate(data);
console.log(result);
