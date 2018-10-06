import "joi";

declare module "joi" {

    // Base types
    type primitiveType = string | number | boolean | Date | undefined | Function;
    type schemaMap = { [key: string]: mappedSchema, };
    type mappedSchema = SchemaLike | mappedSchemaMap;
    type mappedSchemaMap<T extends schemaMap = any> = { [K in keyof T]: T[K]; };

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
    >(a: T1, b: T2, c: T3, d: T4, e: T5): AlternativesSchema<
        extractType<T1>, extractType<T2>, extractType<T3>, extractType<T4>, extractType<T5>
    >;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema, T3 extends mappedSchema, T4 extends mappedSchema,
    >(a: T1, b: T2, c: T3, d: T4): AlternativesSchema<
        extractType<T1>, extractType<T2>, extractType<T3>, extractType<T4>
    >;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema, T3 extends mappedSchema,
    >(a: T1, b: T2, c: T3): AlternativesSchema<
        extractType<T1>, extractType<T2>, extractType<T3>
    >;

    export function alternatives<
        T1 extends mappedSchema, T2 extends mappedSchema,
    >(a: T1, b: T2): AlternativesSchema<
        extractType<T1>, extractType<T2>
    >;

    // TODO copy alternatives signature to the alias `alt`

    // Extraction
    type extractMap<T> = { [K in keyof T]: extractType<T[K]> };

    export type extractType<T extends mappedSchema> =
        T extends primitiveType ? T :
        T extends BooleanSchema ? boolean :
        T extends StringSchema ? string :
        T extends NumberSchema ? number :
        T extends DateSchema ? Date :
        T extends FunctionSchema<infer O> ? O :
        T extends ArraySchema<infer O> ? O[] :
        T extends ObjectSchema<infer O> ? O :
        T extends mappedSchemaMap<infer O> ? O :
        T extends Array<infer O> ? any : // O : // TODO
        T extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4, infer O5> ? O1 | O2 | O3 | O4 | O5 :
        T extends AlternativesSchema<infer O1, infer O2, infer O3, infer O4> ? O1 | O2 | O3 | O4 :
        T extends AlternativesSchema<infer O1, infer O2, infer O3> ? O1 | O2 | O3 :
        T extends AlternativesSchema<infer O1, infer O2> ? O1 | O2 :
        any;
}