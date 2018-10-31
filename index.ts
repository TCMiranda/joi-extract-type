import "joi";

/**
 * Helpers
 */
type Map<T> = { [P in keyof T]: T[P] };
type Diff<T, U> = T extends U ? never : T;

declare module "joi" {

    /**
     * Field requirements interface
     */
    interface Box<T, R extends boolean> {
        /** Type the schema holds */
        T: T;
        /** If this attribute is required when inside an object */
        R: R;
    }

    type BoxType<B, nT> =
        B extends Box<infer oT, infer oR> ? Box<nT, oR> : B;
    type BoxReq<B, nR extends boolean> =
        B extends Box<infer oT, infer oR> ? Box<oT, nR> : B;

    /**
     * Every Schema that implements the Box to allow the extraction
     */
    type BoxedPrimitive<T extends Box<any, any> = any>
        = StringSchema<T>
        | NumberSchema<T>
        | BooleanSchema<T>
        | DateSchema<T>
        | FunctionSchema<T>
        // | ArraySchema<T>
        ;

    // Base types
    type primitiveType = string | number | boolean | Function | Date | undefined | null | void;
    type thruthyPrimitiveType = NonNullable<primitiveType>;
    type schemaMap = { [key: string]: mappedSchema, };
    type mappedSchema = SchemaLike | BoxedPrimitive | mappedSchemaMap;
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

    // TODO: concat
    // concat(schema: this): this;

    // TODO: when
    // when(ref: string, options: WhenOptions): AlternativesSchema;
    // when(ref: Reference, options: WhenOptions): AlternativesSchema;
    // when(ref: Schema, options: WhenSchemaOptions): AlternativesSchema;

    // TODO: see if .default union makes sense;

    /**
     * String: extraction decorated schema
     */
    export interface StringSchema<N extends Box<string, boolean> = any> {
        default(): this;
        default(value: any, description?: string): this;
        default<T extends string>(value: T, description?: string): StringSchema<BoxType<N, N['T'] | T>>;

        valid<T extends string>(...values: T[]): StringSchema<BoxType<N, typeof values[number]>>;
        valid<T extends string>(values: T[]): StringSchema<BoxType<N, typeof values[number]>>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        required(): StringSchema<BoxReq<N, true>>;
        required(): this;
        exist(): StringSchema<BoxReq<N, true>>;
        exist(): this;
        optional(): StringSchema<BoxReq<N, false>>;
        optional(): this;
    }

    export function string<T extends string>(): StringSchema<{ T: extractType<T>, R: false }>;

    /**
     * Number: extraction decorated schema
     */
    export interface NumberSchema<N extends Box<number, boolean> = any> {
        default(): this;
        default(value: any, description?: string): this;
        default<T extends number>(value: T, description?: string): NumberSchema<BoxType<N, N['T'] | T>>;

        valid<T extends number>(...values: T[]): NumberSchema<BoxType<N, typeof values[number]>>;
        valid<T extends number>(values: T[]): NumberSchema<BoxType<N, typeof values[number]>>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        required(): NumberSchema<BoxReq<N, true>>;
        required(): this;
        exist(): NumberSchema<BoxReq<N, true>>;
        exist(): this;
        optional(): NumberSchema<BoxReq<N, false>>;
        optional(): this;
    }

    export function number<T extends number>(): NumberSchema<Box<extractType<T>, false>>;

    /**
     * Boolean: extraction decorated schema
     */
    export interface BooleanSchema<N extends Box<boolean, boolean> = any> {
        default(): this;
        default(value: any, description?: string): this;
        default<T extends boolean>(value: T, description?: string): BooleanSchema<BoxType<N, N['T'] | T>>;

        valid<T extends boolean>(...values: T[]): BooleanSchema<BoxType<N, typeof values[number]>>;
        valid<T extends boolean>(values: T[]): BooleanSchema<BoxType<N, typeof values[number]>>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        required(): BooleanSchema<BoxReq<N, true>>;
        required(): this;
        exist(): BooleanSchema<BoxReq<N, true>>;
        exist(): this;
        optional(): BooleanSchema<BoxReq<N, false>>;
        optional(): this;
    }

    export function boolean<T extends boolean>(): BooleanSchema<Box<T, false>>

    /**
     * Date: extraction decorated schema
     */
    export interface DateSchema<N extends Box<Date, boolean> = any> {
        default(): this;
        default(value: any, description?: string): this;
        default<T extends Date>(value: T, description?: string): DateSchema<BoxType<N, N['T'] | T>>;

        valid<T extends Date>(...values: T[]): DateSchema<BoxType<N, typeof values[number]>>;
        valid<T extends Date>(values: T[]): DateSchema<BoxType<N, typeof values[number]>>;
        valid(...values: any[]): this;
        valid(values: any[]): this;

        required(): DateSchema<BoxReq<N, true>>;
        required(): this;
        exist(): DateSchema<BoxReq<N, true>>;
        exist(): this;
        optional(): DateSchema<BoxReq<N, false>>;
        optional(): this;
    }

    export function date<T extends Date>(): DateSchema<Box<T, false>>;

    // TOOD: implement DecoratedExtractedValue at:
    // T extends DateSchema
    // T extends FunctionSchema

     /**
     * Function: extraction decorated schema
     */
    export interface FunctionSchema<N extends Box<Function, boolean> = any> {
        required(): FunctionSchema<BoxReq<N, true>>;
        required(): this;
        exist(): FunctionSchema<BoxReq<N, true>>;
        exist(): this;
        optional(): FunctionSchema<BoxReq<N, false>>;
        optional(): this;
    }

    export function func<T extends Function>(): FunctionSchema<Box<T, false>>;

    /**
     * Array: extraction decorated schema
     */
    export interface ArraySchema<N = never> extends AnySchema {
        items<T extends mappedSchema>(type: T): (
            this extends ArraySchema<infer O>
            ? ArraySchema<extractType<T> | O>
            : ArraySchema<extractMap<T>>
        );
        // items<T extends mappedSchema>(type: T): (
        //     this extends ArraySchema<infer O>
        //     ? ArraySchema<{ T: extractType<typeof type> | O['T'], R: O['R'] }>
        //     : ArraySchema<{ T: extractMap<typeof type>, R: false }>
        // );
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
            T[K] extends BoxedPrimitive<infer D> ? (
                D['R'] extends B ? T[K] : void
            ) :
            (B extends false ? T[K] : void)
    };

    type Required<T> = FilterVoid<keyof T, MarkRequired<T, true>>;
    type Optional<T> = FilterVoid<keyof T, MarkRequired<T, false>>;

    type extractMap<T> = Map<{
        [K in keyof Optional<T>]?: extractType<T[K]>;
    } & {
        [K in keyof Required<T>]: extractType<T[K]>;
    }>;

    type extractOne<T extends mappedSchema> =
        /** Primitive types */
        T extends primitiveType ? T :
        T extends BooleanSchema<infer O> ? O['T'] :
        T extends StringSchema<infer O> ? O['T'] :
        T extends NumberSchema<infer O> ? O['T'] :
        T extends DateSchema<infer O> ? O['T'] :
        T extends FunctionSchema<infer O> ? O['T'] :

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
