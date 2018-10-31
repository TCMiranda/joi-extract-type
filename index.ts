import "joi";
export { tuple } from './tuple';

type PickAll<T> = { [P in keyof T]: T[P] };

declare module "joi" {

    type Diff<T, U> = T extends U ? never : T;

    // Base types
    type primitiveType = string | number | boolean | Function | Date | undefined | null | void;
    type thruthyPrimitiveType = NonNullable<primitiveType>;
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

    interface DecoratedExtractedValue<T> {
        T: T;
        R: boolean;
    }

    // interface DecoratedSchema<N extends DecoratedExtractedValue<any>> { }

    // interface X<P extends DecoratedSchema<A>, T = any, N extends DecoratedExtractedValue<T> = any> {
    //     valid<T extends string>(...values: T[]): P<{ R: N['R'], T: typeof values[number] }>;
    //     valid<T extends string>(values: T[]): P<{ R: N['R'], T: typeof values[number] }>;
    // }

    /**
     * String: extraction decorated schema
     */
    export interface StringSchema<N extends DecoratedExtractedValue<string> = any> {
        valid<T extends string>(...values: T[]): StringSchema<{ R: N['R'], T: typeof values[number] }>;
        valid<T extends string>(values: T[]): StringSchema<{ R: N['R'], T: typeof values[number] }>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        required(): StringSchema<{ R: true, T: N['T'] }>;
        exist(): StringSchema<{ R: true, T: N['T'] }>;
        optional(): StringSchema<{ R: false, T: N['T'] }>;

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

    export function string<T extends string>(): StringSchema<{ T: extractType<T>, R: false }>;

    export interface NumberSchema<N extends DecoratedExtractedValue<number> = any> {
        required(): NumberSchema<{ R: true; T: N['T'] }>;
        exist(): NumberSchema<{ R: true; T: N['T'] }>;
        optional(): NumberSchema<{ R: false; T: N['T'] }>;
    }

    export function number<T extends number>(): NumberSchema<{ T: extractType<T>; R: false }>;

    // TOOD: implement DecoratedExtractedValue at:
    // T extends BooleanSchema
    // T extends DateSchema
    // T extends FunctionSchema

    /**
     * Array: extraction decorated schema
     */
    export interface ArraySchema<N = never> extends AnySchema {
        items<T extends mappedSchema>(type: T):
            this extends ArraySchema<infer O>
            ? ArraySchema<extractType<T> | O>
            : ArraySchema<extractMap<T>>;
    }

    /**
     * Object: extraction decorated schema
     */
    export interface ObjectSchema<N = null> extends AnySchema {
        keys<T extends mappedSchemaMap>(schema: T):
            this extends ObjectSchema<infer O>
            ? (O extends null
                ? ObjectSchema<extractMap<T>>
                : ObjectSchema<extractMap<T> & O>)
            : ObjectSchema<extractMap<T>>;
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


    // Required | Optional properties engine
    type FilterVoid<T extends (string | number | symbol), O extends any> = {
        [K in T extends (string | number | symbol)
            ? (O[T] extends (null | undefined | void) ? never : T)
            : never
        ]: O[K]
    };

    type MarkRequired<T, B> = {
        [K in keyof T]:
            T[K] extends StringSchema<infer D> ? (D['R'] extends B ? T[K] : void) :
            T[K] extends NumberSchema<infer D> ? (D['R'] extends B ? T[K] : void) :
            (B extends false ? T[K] : void)
    };

    type Required<T> = FilterVoid<keyof T, MarkRequired<T, true>>;
    type Optional<T> = FilterVoid<keyof T, MarkRequired<T, false>>;

    type extractMap<T> = PickAll<{
        [K in keyof Optional<T>]?: extractType<T[K]>;
    } & {
        [K in keyof Required<T>]: extractType<T[K]>;
    }>;

    type extractOne<T extends mappedSchema> =
        T extends primitiveType ? T :
        T extends BooleanSchema ? boolean :
        T extends StringSchema<infer O> ? O['T'] :
        T extends NumberSchema<infer O> ? O['T'] :
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

        /**
         * Handle Objects as schemas, without Joi.object at the root
         */
        T extends { [K: string]: mappedSchema } ? extractMap<T> :

        /**
         * Default case to handle primitives and schemas
         */
        extractOne<T>;
}
