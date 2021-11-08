/** @format */

import 'joi';

declare module 'joi' {
  /**
   * Helpers
   */
  type ArrayType<T> = T extends (infer U)[] ? U : never;

  // Fix unions when parsing types
  type SpreadObject<T> = T extends {} ? { [K in keyof T]: T[K] } : never;

  /**
   * Field requirements interface
   */
  interface Box<T, R extends boolean> {
    /** Type the schema holds */
    T: T;
    /** If this attribute is required when inside an object */
    R: R;
  }

  // Operators
  type BoxType<B, nT> = B extends Box<infer oT, infer oR> ? Box<nT, oR> : B;
  type BoxUnion<B, nT> = B extends Box<infer oT, infer oR> ? Box<oT | nT, oR> : B;
  type BoxIntersection<B, nT> = B extends Box<infer oT, infer oR>
    ? Box<SpreadObject<oT & nT>, oR>
    : B;
  type BoxReq<B, nR extends boolean> = B extends Box<infer oT, infer oR> ? Box<oT, nR> : B;

  type BoxSchema = Box<any, boolean>;

  /**
   * Every Schema that implements the Box to allow the extraction
   */
  type BoxedPrimitive<T extends BoxSchema = any> =
    | BoxAnySchema<T>
    | BoxStringSchema<T>
    | BoxNumberSchema<T>
    | BoxBooleanSchema<T>
    | BoxDateSchema<T>
    | BoxFunctionSchema<T>
    | BoxArraySchema<T>
    | BoxObjectSchema<T>
    | BoxAlternativesSchema<T>;

  // Base types
  type primitiveType = string | number | boolean | Function | Date | undefined | null | void;

  export type mappedSchema = SchemaLike | BoxedPrimitive;
  export type mappedSchemaMap = { [K: string]: mappedSchema };

  export type extendsGuard<T, S> = S extends T ? S : T;

  export type validationGuard<T, S> = S extends T ? { value: S } : { error: any };

  interface BoxAnySchema<N extends Box<any, boolean>> extends AnySchema {
    __schemaTypeLiteral: 'BoxAnySchema';

    default<T>(
      value: T,
      description?: string
    ): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxUnion<B, T>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    valid<T>(
      ...values: T[]
    ): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxType<B, T>> : never;
    valid<T>(values: T[]): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxType<B, T>> : never;
    valid(...values: any[]): this;
    valid(values: any[]): this;

    required(): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxAnySchema<infer B> ? BoxAnySchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * String: extraction decorated schema
   */
  export interface BoxStringSchema<N extends BoxSchema> extends StringSchema {
    __schemaTypeLiteral: 'BoxStringSchema';

    default<T extends string>(
      value: T,
      description?: string
    ): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxUnion<B, T>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    valid<T extends string>(
      ...values: T[]
    ): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxType<B, T>> : never;
    valid<T extends string>(
      values: T[]
    ): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxType<B, T>> : never;
    valid(...values: any[]): this;
    valid(values: any[]): this;

    required(): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxStringSchema<infer B> ? BoxStringSchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Number: extraction decorated schema
   */
  export interface BoxNumberSchema<N extends BoxSchema> extends NumberSchema {
    __schemaTypeLiteral: 'BoxNumberSchema';

    default<T extends number>(
      value: T,
      description?: string
    ): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxUnion<B, T>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxUnion<B, T>> : never;

    allow(...values: any[]): this;
    allow(values: any[]): this;

    valid<T extends string>(
      ...values: T[]
    ): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxType<B, T>> : never;
    valid<T extends string>(
      values: T[]
    ): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxType<B, T>> : never;

    valid(...values: any[]): this;
    valid(values: any[]): this;

    required(): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxNumberSchema<infer B> ? BoxNumberSchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Boolean: extraction decorated schema
   */
  export interface BoxBooleanSchema<N extends BoxSchema> extends BooleanSchema {
    __schemaTypeLiteral: 'BoxBooleanSchema';

    default<T extends boolean>(
      value: T,
      description?: string
    ): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxUnion<B, T>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    valid<T extends string>(
      ...values: T[]
    ): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxType<B, T>> : never;
    valid<T extends string>(
      values: T[]
    ): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxType<B, T>> : never;
    valid(...values: any[]): this;
    valid(values: any[]): this;

    required(): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxBooleanSchema<infer B> ? BoxBooleanSchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Date: extraction decorated schema
   */
  export interface BoxDateSchema<N extends BoxSchema> extends DateSchema {
    __schemaTypeLiteral: 'BoxDateSchema';

    default<T extends Date>(
      value: T,
      description?: string
    ): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxUnion<B, T>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    valid<T extends string>(
      ...values: T[]
    ): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxType<B, T>> : never;
    valid<T extends string>(
      values: T[]
    ): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxType<B, T>> : never;
    valid(...values: any[]): this;
    valid(values: any[]): this;

    required(): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxDateSchema<infer B> ? BoxDateSchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Function: extraction decorated schema
   */
  export interface BoxFunctionSchema<N extends BoxSchema> extends FunctionSchema {
    __schemaTypeLiteral: 'BoxFunctionSchema';

    allow<T>(
      ...values: T[]
    ): this extends BoxFunctionSchema<infer B> ? BoxFunctionSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxFunctionSchema<infer B> ? BoxFunctionSchema<BoxUnion<B, T>> : never;

    allow(...values: any[]): this;
    allow(values: any[]): this;

    required(): this extends BoxFunctionSchema<infer B>
      ? BoxFunctionSchema<BoxReq<B, true>>
      : never;
    required(): this;

    exist(): this extends BoxFunctionSchema<infer B> ? BoxFunctionSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxFunctionSchema<infer B>
      ? BoxFunctionSchema<BoxReq<B, false>>
      : never;

    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Array: extraction decorated schema
   */
  export interface BoxArraySchema<N extends BoxSchema> extends ArraySchema {
    __schemaTypeLiteral: 'BoxArraySchema';

    default<T extends any[]>(
      value: T,
      description?: string
    ): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxUnion<B, ArrayType<T>>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    items<T extends mappedSchema>(
      type: T
    ): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxUnion<B, extractType<T>>> : never;
    items(...types: SchemaLike[]): this;
    items(types: SchemaLike[]): this;

    required(): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxArraySchema<infer B> ? BoxArraySchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  /**
   * Object: extraction decorated schema
   */
  export interface BoxObjectSchema<N extends BoxSchema> extends ObjectSchema {
    __schemaTypeLiteral: 'BoxObjectSchema';

    default<T extends mappedSchemaMap>(
      value: T,
      description?: string
    ): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxUnion<B, extractType<T>>> : never;
    default(value: any, description?: string): this;
    default(): this;

    allow<T>(
      ...values: T[]
    ): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    keys<T extends mappedSchemaMap>(
      schema: T
    ): this extends BoxObjectSchema<infer B>
      ? BoxObjectSchema<BoxIntersection<B, extractMap<T>>>
      : never;
    keys(schema?: SchemaMap): this;

    append<T extends mappedSchemaMap>(
      schema: T
    ): this extends BoxObjectSchema<infer B>
      ? BoxObjectSchema<BoxIntersection<B, extractMap<T>>>
      : never;
    append(schema?: SchemaMap): this;

    pattern<S extends BoxStringSchema<any>, T extends mappedSchema>(
      pattern: S,
      schema: T
    ): this extends BoxObjectSchema<infer B>
      ? BoxObjectSchema<BoxIntersection<B, extractMap<{ [key in extractType<S>]: T }>>>
      : never;
    pattern<T extends mappedSchema>(
      pattern: RegExp,
      schema: T
    ): this extends BoxObjectSchema<infer B>
      ? BoxObjectSchema<BoxIntersection<B, extractMap<{ [key: string]: T }>>>
      : never;
    pattern(pattern: RegExp | SchemaLike, schema: SchemaLike): this;

    required(): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxReq<B, true>> : never;
    required(): this;

    exist(): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxReq<B, true>> : never;
    exist(): this;

    optional(): this extends BoxObjectSchema<infer B> ? BoxObjectSchema<BoxReq<B, false>> : never;
    optional(): this;

    validate<T>(
      value: T
    ): this extends BoxObjectSchema<infer B> ? validationGuard<T, B['T']> : never;
    validate<T>(
      value: T,
      options: ValidationOptions
    ): this extends BoxObjectSchema<infer B> ? validationGuard<T, B['T']> : never;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (
        err: ValidationError,
        value: this extends BoxObjectSchema<infer B> ? extendsGuard<T, B['T']> : never
      ) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (
        err: ValidationError,
        value: this extends BoxObjectSchema<infer B> ? extendsGuard<T, B['T']> : never
      ) => R
    ): R;
  }

  /**
   * Alternatives: extraction decorated schema
   */
  export interface BoxAlternativesSchema<N extends BoxSchema> extends AlternativesSchema {
    __schemaTypeLiteral: 'BoxAlternativesSchema';

    allow<T>(
      ...values: T[]
    ): this extends BoxAlternativesSchema<infer B> ? BoxAlternativesSchema<BoxUnion<B, T>> : never;
    allow<T>(
      values: T[]
    ): this extends BoxAlternativesSchema<infer B> ? BoxAlternativesSchema<BoxUnion<B, T>> : never;
    allow(...values: any[]): this;
    allow(values: any[]): this;

    try<T extends mappedSchema[]>(
      ...values: T
    ): this extends BoxAlternativesSchema<infer O>
      ? O extends Box<infer oT, infer oR>
        ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
        : BoxAlternativesSchema<Box<extractType<T>, false>>
      : BoxAlternativesSchema<Box<extractType<T>, false>>;
    try<T extends mappedSchema[]>(
      values: T
    ): this extends BoxAlternativesSchema<infer O>
      ? O extends Box<infer oT, infer oR>
        ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
        : BoxAlternativesSchema<Box<extractType<T>, false>>
      : BoxAlternativesSchema<Box<extractType<T>, false>>;
    try(...types: SchemaLike[]): this;
    try(types: SchemaLike[]): this;

    required(): this extends BoxAlternativesSchema<infer B>
      ? BoxAlternativesSchema<BoxReq<B, true>>
      : never;
    required(): this;

    exist(): this extends BoxAlternativesSchema<infer B>
      ? BoxAlternativesSchema<BoxReq<B, true>>
      : never;
    exist(): this;

    optional(): this extends BoxAlternativesSchema<infer B>
      ? BoxAlternativesSchema<BoxReq<B, false>>
      : never;
    optional(): this;

    when<
      R,
      T1 extends mappedSchema,
      T2 extends mappedSchema,
      T extends { then: T1; otherwise: T2 }
    >(
      ref: R,
      defs: T
    ): this extends BoxAlternativesSchema<infer O>
      ? O extends Box<infer oT, infer oR>
        ? BoxAlternativesSchema<
            BoxType<O, oT | extractType<T['then']> | extractType<T['otherwise']>>
          >
        : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>
      : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>;
    when(ref: string | Reference, options: WhenOptions): this;
    when(ref: Schema, options: WhenSchemaOptions): this;

    validate<T>(value: T): validationGuard<T, extractType<this>>;
    validate<T>(value: T, options: ValidationOptions): validationGuard<T, extractType<this>>;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
    validate<T, R>(
      value: T,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<this>>) => R
    ): R;
  }

  // Required | Optional properties engine
  type Required<T, K = keyof T> = {
    [j in K extends keyof T
      ? T[K] extends BoxedPrimitive<infer B>
        ? B['R'] extends true
          ? K
          : never
        : never
      : never]: true;
  };

  type Optional<T, K = keyof T> = {
    [j in K extends keyof T
      ? T[K] extends BoxedPrimitive<infer B>
        ? B['R'] extends false
          ? K
          : never
        : never
      : never]: true;
  };

  type extractMap<T extends mappedSchemaMap> = SpreadObject<
    { [K in keyof Optional<T>]?: extractType<T[K]> } & {
      [K in keyof Required<T>]: extractType<T[K]>;
    }
  >;

  type maybeExtractBox<T> = T extends Box<infer O, infer R> ? O : T;

  type extractOne<T extends mappedSchema> =
    /** Primitive types */
    T extends primitiveType
      ? T
      : /** Holds the extracted type */
      T extends BoxAnySchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxBooleanSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxStringSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxNumberSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxDateSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxFunctionSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxArraySchema<infer O>
      ? maybeExtractBox<O>[]
      : T extends BoxObjectSchema<infer O>
      ? maybeExtractBox<O>
      : T extends BoxAlternativesSchema<infer O>
      ? maybeExtractBox<O>
      : T extends AnySchema
      ? any
      : any;

  export type extractType<T extends mappedSchema> =
    /**
     * Hack to support [Schema1, Schema2, ...N] alternatives notation
     * Can't use extractType directly here because of cycles:
     * ```
     * T extends Array<infer O> ? extractType<O> :
     *                            ^ cycle
     * ```
     */
    T extends Array<infer O>
      ? O extends SchemaLike
        ? extractOne<O>
        : O extends BoxedPrimitive
        ? extractOne<O>
        : O
      : /**
       * Handle Objects as schemas, without Joi.object at the root.
       * It needs to come first than mappedSchema.
       * It is difficult to avoid it to be inferred from extends clause.
       */
      T extends mappedSchemaMap
      ? extractMap<T>
      : /**
       * This is the base case for every schema implemented
       */
      T extends SchemaLike
      ? extractOne<T>
      : T extends BoxedPrimitive
      ? extractOne<T>
      : /**
         * Default case to handle primitives and schemas
         */
        extractOne<T>;

  interface Root {
    /**
     * Factory methods.
     */
    any<T extends any>(): BoxAnySchema<Box<T, false>>;
    string<T extends string>(): BoxStringSchema<Box<T, false>>;
    number<T extends number>(): BoxNumberSchema<Box<T, false>>;
    boolean<T extends boolean>(): BoxBooleanSchema<Box<T, false>>;
    date<T extends Date>(): BoxDateSchema<Box<T, false>>;
    func<T extends Function>(): BoxFunctionSchema<Box<T, false>>;
    array(): BoxArraySchema<Box<never, false>>;
    object<T extends mappedSchemaMap>(schema?: T): BoxObjectSchema<Box<extractMap<T>, false>>;
    alternatives<T extends mappedSchema[]>(
      ...alts: T
    ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
    alternatives<T extends mappedSchema[]>(
      alts: T
    ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

    alt<T extends mappedSchema[]>(
      ...alts: T
    ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
    alt<T extends mappedSchema[]>(
      alts: T
    ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

    /**
     * Allow extend() to use Joi types by default
     */
    extend(extension: Extension | Extension[], ...extensions: Array<Extension | Extension[]>): Root;

    /**
     * Validation: extraction decorated methods
     */
    validate<T, S extends mappedSchema>(value: T, schema: S): validationGuard<T, extractType<S>>;
    validate<T, S extends mappedSchema>(
      value: T,
      schema: S,
      options: ValidationOptions
    ): validationGuard<T, extractType<S>>;
    validate<T, S>(value: T, schema: S): ValidationResult;
    validate<T, R, S extends mappedSchema>(
      value: T,
      schema: S,
      options: ValidationOptions,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
    ): R;
    validate<T, R, S extends mappedSchema>(
      value: T,
      schema: S,
      callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
    ): R;
  }
}
