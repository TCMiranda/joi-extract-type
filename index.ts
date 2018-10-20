import "joi";
export { tuple } from './tuple';

declare module "joi" {

    // Base types
    type primitiveType = string | number | boolean | Function | Date | undefined | null | void;
    type schemaMap = { [key: string]: mappedSchema, };
    type mappedSchema = SchemaLike | mappedSchemaMap;
    type mappedSchemaMap<T extends schemaMap = any> = { [K in keyof T]: T[K]; };

    export type extendsGuard<T, S> = S extends T ? S : T;

    /**
     * Validation: extraction decorated methods
     */
    export function validate<T, S extends mappedSchemaMap>(value: T, schema: S):
        ValidationResult<extendsGuard<T, extractType<S>>>;
    export function validate<T, S extends mappedSchemaMap>(value: T, schema: SchemaLike, options: ValidationOptions):
        ValidationResult<extendsGuard<T, extractType<S>>>;
    export function validate<T, R, S extends mappedSchemaMap>(value: T, schema: SchemaLike, options: ValidationOptions,
        callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R): R;
    export function validate<T, R, S extends mappedSchemaMap>(value: T, schema: SchemaLike,
        callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R): R;

    /**
     * String: extraction decorated schema
     */
    export interface StringSchema<N = string, R = false> extends AnySchema {
        valid<T extends string>(...values: T[]): StringSchema<typeof values[number]>;
        valid<T extends string>(values: T[]): StringSchema<typeof values[number]>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        // TODO: required | optional
        // required(): StringSchema<N, true>;
        // exist(): StringSchema<N, true>;
        // optional(): StringSchema<N, false>;

        // TODO: default
        // default(value: any, description?: string): this;
        // default(): this;

        // TODO: concat
        // concat(schema: this): this;

        // TODO: when
        // when(ref: string, options: WhenOptions): AlternativesSchema;
        // when(ref: Reference, options: WhenOptions): AlternativesSchema;
        // when(ref: Schema, options: WhenSchemaOptions): AlternativesSchema;
    }

    export function string<T extends string>(): StringSchema<extractType<T>>;

    /**
     * Array: extraction decorated schema
     */
    export interface ArraySchema<N = any> extends AnySchema {
        items<T extends mappedSchema>(type: T): ArraySchema<extractType<T>>;
    }

    /**
     * Object: extraction decorated schema
     */
    export interface ObjectSchema<N = any> extends AnySchema {
        keys<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<N & T>>;
    }

    export function object<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<T>>;

    /**
     * Function: extraction decorated schema
     */
    export interface FunctionSchema<N = any> extends AnySchema { }

    export function func<T extends Function>(): FunctionSchema<T>;

    /**
     * Alternatives: extraction decorated schema
     */
    export interface AlternativesSchema<T extends mappedSchema = any> extends AnySchema {

        try<T extends mappedSchema[]>(...values: T): AlternativesSchema<extractType<typeof values[number]>>;
        try<T extends mappedSchema[]>(values: T): AlternativesSchema<extractType<typeof values[number]>>;
        try(...types: SchemaLike[]): this;
        try(types: SchemaLike[]): this;
    }

    export function alternatives<T extends mappedSchema[]>(...alts: T):
        AlternativesSchema<extractType<typeof alts[number]>>;
    export function alternatives<T extends mappedSchema[]>(alts: T):
        AlternativesSchema<extractType<typeof alts[number]>>;

    export function alt<T extends mappedSchema[]>(...alts: T):
        AlternativesSchema<extractType<typeof alts[number]>>;
    export function alt<T extends mappedSchema[]>(alts: T):
        AlternativesSchema<extractType<typeof alts[number]>>;

    // Extraction
    // TODO: find required or optional properties:
    // Partial<T> & PickRequired<T>
    type extractMap<T> = { [K in keyof T]: extractType<T[K]> };

    type extractOne<T extends mappedSchema> =
        T extends primitiveType ? T :
        T extends BooleanSchema ? boolean :
        T extends StringSchema<infer O> ? O :
        T extends NumberSchema ? number :
        T extends DateSchema ? Date :
        T extends FunctionSchema<infer O> ? O :

        /** Holds the extracted type */
        T extends ArraySchema<infer O> ? O[] :
        T extends ObjectSchema<infer O> ? O :
        T extends mappedSchemaMap<infer O> ? O :

        /** Supports Joi.alternatives(Schema1, schema2, ...5) */
        T extends AlternativesSchema<infer O> ? O :
        any;

    export type extractType<T extends mappedSchema> =
        /**
         * Hack to support [Schema1, Schema2, ...N] alternatives notation
         * Can't use extractType directly here because of cycles:
         * ```
         * T extends Array<infer O> ? extractType<O> :
         *                            ^ cycle
         * ```
         */
        T extends Array<infer O> ? extractOne<O> :
        extractOne<T>;
}
