import "joi";

export { tuple } from './tuple';

declare module "joi" {

    // Base types
    type primitiveType = string | number | boolean | Function | Date | undefined | null | void;
    type schemaMap = { [key: string]: mappedSchema, };
    type mappedSchema = SchemaLike | mappedSchemaMap;
    type mappedSchemaMap<T extends schemaMap = any> = { [K in keyof T]: T[K]; };

    export interface StringSchema<N = string> extends AnySchema {
        valid<T extends string[]>(...values: T): StringSchema<typeof values[number]>;
        valid<T extends string[]>(values: T): StringSchema<typeof values[number]>;
        valid(...values: any[]): this;
        valid(values: any[]): this;
    }

    export function string<T extends string>(): StringSchema<extractType<T>>;

    // Complex types patch: Array
    export interface ArraySchema<N = any> extends AnySchema {
        items<T extends mappedSchema>(type: T): ArraySchema<extractType<T>>;
    }

    // Complex types patch: Object
    export interface ObjectSchema<N = any> extends AnySchema {
        keys<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<N & T>>;
    }

    export function object<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<T>>;

    // Complex types patch: Function
    export interface FunctionSchema<N = any> extends AnySchema { }

    export function func<T extends Function>(): FunctionSchema<T>;

    // Complex types patch: Alternatives
    export interface AlternativesSchema<
        T1 extends mappedSchema = never,
        T2 extends mappedSchema = never,
        T3 extends mappedSchema = never,
        T4 extends mappedSchema = never,
        T5 extends mappedSchema = never,
    > extends AnySchema {

        // TODO copy alternatives signature to class alias try
    }

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema, T3 extends mappedSchema, T4 extends mappedSchema, T5 extends mappedSchema,
    >(a: T1, b: T2, c: T3, d: T4, e: T5):
        AlternativesSchema<extractType<T1>, extractType<T2>, extractType<T3>, extractType<T4>, extractType<T5>>;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema, T3 extends mappedSchema, T4 extends mappedSchema,
    >(a: T1, b: T2, c: T3, d: T4):
        AlternativesSchema<extractType<T1>, extractType<T2>, extractType<T3>, extractType<T4>>;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema, T3 extends mappedSchema,
    >(a: T1, b: T2, c: T3):
        AlternativesSchema<extractType<T1>, extractType<T2>, extractType<T3>>;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema,
    >(a: T1, b: T2):
        AlternativesSchema<extractType<T1>, extractType<T2>>;

    // TODO copy alternatives signature to the alias `alt`

    // Extraction
    type extractMap<T> = { [K in keyof T]: extractType<T[K]> };

    export type extractType<T extends mappedSchema> =

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

        /**
         * Supports Joi.alternatives(Schema1, schema2, ...5)
         *
         * I think there is a better way of writing this,
         * but couldn't find it at the moment.
         */
        T extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4, infer O5> ? O1 | O2 | O3 | O4 | O5 :
        T extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4> ? O1 | O2 | O3 | O4 :
        T extends AlternativesSchema<infer O1, infer O2, infer O3> ? O1 | O2 | O3 :
        T extends AlternativesSchema<infer O1, infer O2> ? O1 | O2 :

        /**
         * Hack to support [Schema1, Schema2, ...N] alternatives notation
         *
         * Can't use extractType because of cycles:
         * ```
         * T extends Array<infer O> ? extractType<O> :
         *                            ^ cycle
         * ```
         *
         * So one option was to dupplicate extractType here.
         * Im sure we could write it without these dupplication,
         * but some aliasing techinique would be necessary to
         * allow the cycling
         *
         * It is ugly but acctualy works well
         */
        T extends Array<infer O> ? (
            O extends primitiveType ? O :
            O extends BooleanSchema ? boolean :
            O extends StringSchema<infer O> ? O :
            O extends NumberSchema ? number :
            O extends DateSchema ? Date :
            O extends FunctionSchema<infer O> ? O :
            O extends ArraySchema<infer O> ? O[] :
            O extends ObjectSchema<infer O> ? O :
            O extends mappedSchemaMap<infer O> ? O :
            O extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4, infer O5> ? O1 | O2 | O3 | O4 | O5 :
            O extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4> ? O1 | O2 | O3 | O4 :
            O extends AlternativesSchema<infer O1, infer O2, infer O3> ? O1 | O2 | O3 :
            O extends AlternativesSchema<infer O1, infer O2> ? O1 | O2 :
            any
        ) :
        any;
}
