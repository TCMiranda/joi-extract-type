import "joi";
import { NumberSchema } from "joi";

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
        any;
}