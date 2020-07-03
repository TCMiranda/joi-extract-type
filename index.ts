/** @format */

import '@hapi/joi';

/**
 * Helpers
 */
type Map<T> = { [P in keyof T]: T[P] };

declare module '@hapi/joi' {
  /**
   * Field requirements interface
   */
  interface Box<T, R extends boolean> {
    /** Type the schema holds */
    T: T;
    /** If this attribute is required when inside an object */
    R: R;
  }

  type BoxType<B, nT> = B extends Box<infer oT, infer oR> ? Box<nT, oR> : B;
  type BoxUnion<B, nT> = B extends Box<infer oT, infer oR> ? Box<oT | nT, oR> : B;

  type BoxReq<B, nR extends boolean> = B extends Box<infer oT, infer oR> ? Box<oT, nR> : B;

  /**
   * Every Schema that implements the Box to allow the extraction
   */
  type BoxedPrimitive<T extends Box<any, any> = any> =
    | StringSchema<T>
    | NumberSchema<T>
    | BooleanSchema<T>
    | DateSchema<T>
    | FunctionSchema<T>
    | ArraySchema<T>
    | ObjectSchema<T>
    | AlternativesSchema<T>;

  // Base types
  type primitiveType = string | number | boolean | Function | Date | undefined | null | void;
  type thruthyPrimitiveType = NonNullable<primitiveType>;

  export type mappedSchema = SchemaLike | BoxedPrimitive;
  export type mappedSchemaMap<T = any> = { [K: string]: mappedSchema };
  // export type mappedSchemaMap<T extends mappedSchema = any> = { [K in keyof T]: T[K] };

  export type extendsGuard<T, S> = S extends T ? S : T;

  /**
   * Validation: extraction decorated methods
   */
  export function validate<T, S extends mappedSchemaMap>(
    value: T,
    schema: S
  ): ValidationResult<extendsGuard<T, extractType<S>>>;
  export function validate<T, S extends mappedSchemaMap>(
    value: T,
    schema: S,
    options: ValidationOptions
  ): ValidationResult<extendsGuard<T, extractType<S>>>;
  export function validate<T, R, S extends mappedSchemaMap>(
    value: T,
    schema: S,
    options: ValidationOptions,
    callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  ): R;
  export function validate<T, R, S extends mappedSchemaMap>(
    value: T,
    schema: S,
    callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  ): R;

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
    default<T extends string>(value: T, description?: string): StringSchema<Box<N['T'] | T, true>>;
    default(value: any, description?: string): this;
    default(): this;

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

  export function string<T extends string>(): StringSchema<{ T: extractType<T>; R: false }>;

  /**
   * Number: extraction decorated schema
   */
  export interface NumberSchema<N extends Box<number, boolean> = any> {
    default<T extends number>(value: T, description?: string): NumberSchema<Box<N['T'] | T, true>>;
    default(value: any, description?: string): this;
    default(): this;

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
    default<T extends boolean>(
      value: T,
      description?: string
    ): BooleanSchema<Box<N['T'] | T, true>>;
    default(value: any, description?: string): this;
    default(): this;

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

  export function boolean<T extends boolean>(): BooleanSchema<Box<T, false>>;

  /**
   * Date: extraction decorated schema
   */
  export interface DateSchema<N extends Box<Date, boolean> = any> {
    default<T extends Date>(value: T, description?: string): DateSchema<Box<N['T'] | T, true>>;
    default(value: any, description?: string): this;
    default(): this;

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

  // TODO: implement DecoratedExtractedValue at:
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

  type ArrayType<T> = T extends (infer U)[] ? U : never;

  /**
   * Array: extraction decorated schema
   */
  export interface ArraySchema<N = null> {
    default<T extends any[]>(
      value: T,
      description?: string
    ): ArraySchema<BoxReq<BoxUnion<N, extractType<ArrayType<T>>>, true>>;
    default(value: any, description?: string): this;
    default(): this;

    items<T extends mappedSchema>(
      type: T
    ): this extends ArraySchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? ArraySchema<BoxType<O, oT | extractType<T>>>
          : ArraySchema<Box<extractType<T>, false>>)
      : ArraySchema<Box<extractType<T>, false>>;

    required(): ArraySchema<BoxReq<N, true>>;
    required(): this;
    exist(): ArraySchema<BoxReq<N, true>>;
    exist(): this;
    optional(): ArraySchema<BoxReq<N, false>>;
    optional(): this;
  }

  export function array(): ArraySchema<Box<never, false>>;

  /**
   * Object: extraction decorated schema
   */
  export interface ObjectSchema<N = null> extends AnySchema {
    default<T extends mappedSchemaMap>(
      value: T,
      description?: string
    ): ObjectSchema<BoxReq<BoxUnion<N, extractType<T>>, true>>;
    default(value: any, description?: string): this;
    default(): this;

    keys<T extends mappedSchemaMap>(
      schema: T
    ): this extends ObjectSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? ObjectSchema<BoxType<O, oT & extractMap<T>>>
          : ObjectSchema<Box<extractMap<T>, false>>)
      : ObjectSchema<Box<extractMap<T>, false>>;

    pattern<S extends StringSchema, T extends mappedSchema>(
      pattern: S,
      schema: T
    ): this extends ObjectSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? ObjectSchema<BoxType<O, oT | extractMap<{ [key in extractType<S>]: T }>>>
          : ObjectSchema<Box<extractMap<{ [key in extractType<S>]: T }>, false>>)
      : ObjectSchema<Box<extractMap<{ [key in extractType<S>]: T }>, false>>;

    pattern<T extends mappedSchema>(
      pattern: RegExp,
      schema: T
    ): this extends ObjectSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? ObjectSchema<BoxType<O, oT | extractMap<{ [key: string]: T }>>>
          : ObjectSchema<Box<extractMap<{ [key: string]: T }>, false>>)
      : ObjectSchema<Box<extractMap<{ [key: string]: T }>, false>>;

    append<T extends mappedSchemaMap | null | undefined>(
      schema: T
    ): T extends mappedSchemaMap
      ? (this extends ObjectSchema<infer O>
          ? (O extends Box<infer oT, infer oR>
              ? ObjectSchema<BoxType<O, oT & extractMap<T>>>
              : ObjectSchema<Box<extractMap<T>, false>>)
          : ObjectSchema<Box<extractMap<T>, false>>)
      : this;

    // this extends ObjectSchema<infer O>
    //   ? (O extends null
    //       ? ObjectSchema<extractMap<{ [key: string]: T }>>
    //       : ObjectSchema<extractMap<{ [key: string]: T }> | O>)
    //   : ObjectSchema<extractMap<{ [key: string]: T }>>;

    pattern(pattern: RegExp | SchemaLike, schema: SchemaLike): this;

    required(): ObjectSchema<BoxReq<N, true>>;
    required(): this;
    exist(): ObjectSchema<BoxReq<N, true>>;
    exist(): this;
    optional(): ObjectSchema<BoxReq<N, false>>;
    optional(): this;
  }

  export function object<T extends mappedSchemaMap>(
    schema: T
  ): ObjectSchema<Box<extractMap<T>, false>>;

  /**
   * Alternatives: extraction decorated schema
   */
  export interface AlternativesSchema<N = any> extends AnySchema {
    try<T extends mappedSchema[]>(
      ...values: T
    ): this extends AlternativesSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? AlternativesSchema<BoxType<O, oT | extractType<T>>>
          : AlternativesSchema<Box<extractType<T>, false>>)
      : AlternativesSchema<Box<extractType<T>, false>>;

    try<T extends mappedSchema[]>(
      values: T
    ): this extends AlternativesSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? AlternativesSchema<BoxType<O, oT | extractType<T>>>
          : AlternativesSchema<Box<extractType<T>, false>>)
      : AlternativesSchema<Box<extractType<T>, false>>;

    try(...types: SchemaLike[]): this;
    try(types: SchemaLike[]): this;

    required(): AlternativesSchema<BoxReq<N, true>>;
    required(): this;
    exist(): AlternativesSchema<BoxReq<N, true>>;
    exist(): this;
    optional(): AlternativesSchema<BoxReq<N, false>>;
    optional(): this;

    when<
      R,
      T1 extends mappedSchema,
      T2 extends mappedSchema,
      T extends { then: T1; otherwise: T2 }
    >(
      ref: R,
      defs: T
    ): this extends AlternativesSchema<infer O>
      ? (O extends Box<infer oT, infer oR>
          ? AlternativesSchema<
              BoxType<O, oT | extractType<T['then']> | extractType<T['otherwise']>>
            >
          : AlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>)
      : AlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>;
  }

  export function alternatives<T extends mappedSchema[]>(
    ...alts: T
  ): AlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  export function alternatives<T extends mappedSchema[]>(
    alts: T
  ): AlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

  export function alt<T extends mappedSchema[]>(
    ...alts: T
  ): AlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  export function alt<T extends mappedSchema[]>(
    alts: T
  ): AlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

  // Required | Optional properties engine
  type FilterVoid<T extends string | number | symbol, O extends MarkRequired<any, boolean>> = {
    [K in T extends (string | number | symbol)
      ? (O[T] extends (null | undefined | void) ? never : T)
      : never]: O[K];
  };

  type MarkRequired<T, B> = {
    [K in keyof T]: T[K] extends BoxedPrimitive<infer D>
      ? (D['R'] extends B ? T[K] : void)
      : (B extends false ? T[K] : void);
  };

  type Required<T> = FilterVoid<keyof T, MarkRequired<T, true>>;
  type Optional<T> = FilterVoid<keyof T, MarkRequired<T, false>>;

  type extractMap<T extends mappedSchemaMap> = Map<
    { [K in keyof Optional<T>]?: extractType<T[K]> }
  > & Map<
    { [K in keyof Required<T>]: extractType<T[K]> }
  >;

  type maybeExtractBox<T> = T extends Box<infer O, infer R> ? O : T;

  // prettier-ignore
  type extractOne<T extends mappedSchema> =
    /** Primitive types */
    T extends primitiveType ? T :

    /** Holds the extracted type */
    T extends BooleanSchema<infer O> ? maybeExtractBox<O> :
    T extends StringSchema<infer O> ? maybeExtractBox<O> :
    T extends NumberSchema<infer O> ? maybeExtractBox<O> :
    T extends DateSchema<infer O> ? maybeExtractBox<O> :
    T extends FunctionSchema<infer O> ? maybeExtractBox<O> :
    T extends ArraySchema<infer O> ? maybeExtractBox<O>[] :
    T extends ObjectSchema<infer O> ? maybeExtractBox<O> :

    /** Supports Joi.alternatives(Schema1, schema2, ...) */
    T extends AlternativesSchema<infer O> ? maybeExtractBox<O> :
    T extends mappedSchemaMap<infer O> ? maybeExtractBox<O> :
    T extends AnySchema ? any :
    any;

  // prettier-ignore
  export type extractType<T extends mappedSchema> =
    /**
     * Hack to support [Schema1, Schema2, ...N] alternatives notation
     * Can't use extractType directly here because of cycles:
     * ```
     * T extends Array<infer O> ? extractType<O> :
     *                            ^ cycle
     * ```
     */
    T extends Array<infer O> ? (
        O extends SchemaLike ? extractOne<O> :
        O extends BoxedPrimitive ? extractOne<O> :
        O
    ) :

    /**
     * Handle Objects as schemas, without Joi.object at the root.
     * It needs to come first than mappedSchema.
     * It is difficult to avoid it to be inferred from extends clause.
     */
    T extends mappedSchemaMap ? extractMap<T> :

    /**
     * This is the base case for every schema implemented
     */
    T extends SchemaLike ? extractOne<T> :
    T extends BoxedPrimitive ? extractOne<T> :

    /**
     * Default case to handle primitives and schemas
     */
    extractOne<T>;
}
