import * as Joi from 'joi';

declare module "joi" {

    export type schemaMap = { [key: string]: mappedSchema, };
    export type mappedSchema = SchemaLike | mappedSchemaMap;
    export type mappedSchemaMap<T extends schemaMap = any> = { [K in keyof T]: T[K]; };

    export interface ArraySchema<N = any> extends AnySchema {
        items<T extends mappedSchema>(type: T): ArraySchema<extractType<T>>;
    }

    export interface ObjectSchema<N = any> extends AnySchema {
        keys<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<N & T>>;
    }

    export function object<T extends mappedSchemaMap>(schema: T): ObjectSchema<extractMap<T>>;

    export type primitiveType = string | number | boolean | undefined | Function;

    export type extractMap<T> = { [K in keyof T]: extractType<T[K]> };

    export type extractType<T extends mappedSchema> =
        T extends primitiveType ? T :
        T extends Array<infer O> ? O[] :
        T extends BooleanSchema ? boolean :
        T extends StringSchema ? string :
        T extends ArraySchema<infer O> ? O[] :
        T extends ObjectSchema<infer O> ? O :
        T extends mappedSchemaMap<infer O> ? O :
        any;
}