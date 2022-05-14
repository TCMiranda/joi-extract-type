/** @format */

import * as Joi from 'joi';
// import { ObjectSchema, Schema } from 'joi';

/**
 * Helpers
 */
// type ArrayType<T> = T extends (infer U)[] ? U : never;

declare module 'joi' {
  /**
   * Allow extend() to use Joi types by default
   */
  // export function extend(
  //   extension: Extension | Extension[],
  //   ...extensions: Array<Extension | Extension[]>
  // ): typeof Joi;

  // export type mappedSchema = BoxedPrimitive;
  // export type ExtendedSchemaMap = Record<string, GenericSchema>;

  // export type extendsGuard<T, S> = S extends T ? S : T;

  /**
   * Validation: extraction decorated methods
   */
  // export function validate<T, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S
  // ): ValidationResult<extendsGuard<T, extractType<S>>>;
  // export function validate<T, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions
  // ): ValidationResult<extendsGuard<T, extractType<S>>>;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions,
  //   callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  // ): R;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  // ): R;

  /**
   * ------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------
   * Generic Schema helper
   */

  type AnyKeys = 'allow' | 'default' | 'exist' | 'optional' | 'required' | 'valid';
  type OmitAnyKeys<T> = Omit<T, AnyKeys>;

  interface AnySchemaExtension<ValueType, Optional = true> {
    allow<T>(
      ...values: T[]
    ): this extends AnySchemaExtension<infer V, infer O> ? AnySchemaExtension<V | T, O> : never;
    allow<T>(
      values: T[]
    ): this extends AnySchemaExtension<infer V, infer O> ? AnySchemaExtension<V | T, O> : never;

    default<T extends ValueType>(value: T, description?: string): AnySchemaExtension<ValueType>;
    // alias of required
    exist(): AnySchemaExtension<ValueType, false>;
    optional(): AnySchemaExtension<ValueType>;
    required(): AnySchemaExtension<ValueType, false>;

    valid<T extends ValueType>(
      ...values: T[]
    ): this extends AnySchemaExtension<infer V, infer O> ? AnySchemaExtension<T, O> : never;
    valid<T extends ValueType>(
      values: T[]
    ): this extends AnySchemaExtension<infer V, infer O> ? AnySchemaExtension<T, O> : never;
  }

  /**
   *  Primitive Schemas
   */

  interface ExtendedAnySchema<V = any, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<AnySchema> {}

  interface ExtendedStringSchema<V = string, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<StringSchema> {}

  interface ExtendedNumberSchema<V = number, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<NumberSchema> {}

  interface ExtendedBooleanSchema<V = boolean, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<BooleanSchema> {}

  interface ExtendedDateSchema<V = Date, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<DateSchema> {}

  interface ExtendedFunctionSchema<V = Function, O = true>
    extends AnySchemaExtension<V, O>,
      OmitAnyKeys<FunctionSchema> {}

  /**
   *  Array Schema - ValueType keeps resolved types
   */

  type TupleToUnion<T extends GenericSchema[]> = T[number];
  type ResolveArrayTypes<T extends GenericSchema[]> = {
    // we force the array types to be required - to prevent putting undefined - [v1, undefined]
    [K in keyof T]: T[K] extends AnySchemaExtension<infer V, infer O> ? pullType<V, false> : never;
  };

  interface ExtendedArraySchema<ValueType = any[], Optional = true>
    extends AnySchemaExtension<ValueType, Optional>,
      Omit<OmitAnyKeys<ArraySchema>, 'items'> {
    items<T extends GenericSchema[]>(
      ...values: T
    ): this extends ExtendedArraySchema<infer V, infer O>
      ? ExtendedArraySchema<ResolveArrayTypes<TupleToUnion<T>[]>, O>
      : never;

    items<T extends GenericSchema[]>(
      values: T
    ): this extends ExtendedArraySchema<infer V, infer O>
      ? ExtendedArraySchema<ResolveArrayTypes<TupleToUnion<T>[]>, O>
      : never;
  }

  /**
   * Object: Object Schema
   */

  interface ExtendedObjectSchema<ValueType = any[], Optional = true>
    extends AnySchemaExtension<ValueType, Optional>,
      Omit<OmitAnyKeys<ObjectSchema>, 'keys'> {
    // keys<T extends ExtendedSchemaMap>(
    //   schema: T
    // ): this extends BoxObjectSchema<infer B>
    //   ? BoxObjectSchema<BoxIntersection<B, extractMap<T>>>
    //   : never;
    // keys(schema?: SchemaMap): this;
  }

  // export interface BoxObjectSchema<N extends BoxSchema> extends ObjectSchema {
  //   keys<T extends ExtendedSchemaMap>(
  //     schema: T
  //   ): this extends BoxObjectSchema<infer B>
  //     ? BoxObjectSchema<BoxIntersection<B, extractMap<T>>>
  //     : never;
  //   keys(schema?: SchemaMap): this;
  //
  //   append<T extends ExtendedSchemaMap>(
  //     schema: T
  //   ): this extends BoxObjectSchema<infer B>
  //     ? BoxObjectSchema<BoxIntersection<B, extractMap<T>>>
  //     : never;
  //   append(schema?: SchemaMap): this;
  //
  //   //   // TODO: janusz correct this
  //   //   // pattern<S extends ExtendedStringSchema, T extends mappedSchema>(
  //   //   //   pattern: S,
  //   //   //   schema: T
  //   //   // ): this extends BoxObjectSchema<infer B>
  //   //   //   ? BoxObjectSchema<BoxIntersection<B, extractMap<{ [key in extractType<S>]: T }>>>
  //   //   //   : never;
  //   pattern<T extends mappedSchema>(
  //     pattern: RegExp,
  //     schema: T
  //   ): this extends BoxObjectSchema<infer B>
  //     ? BoxObjectSchema<BoxIntersection<B, extractMap<{ [key: string]: T }>>>
  //     : never;
  //
  //   pattern(pattern: RegExp | SchemaLike, schema: SchemaLike): this;
  // }

  /**
   * Alternatives: extraction decorated schema
   */
  // export interface BoxAlternativesSchema<N extends BoxSchema> extends AlternativesSchema {
  //   __schemaTypeLiteral: 'BoxAlternativesSchema';
  //
  //   allow<T>(
  //     ...values: T[]
  //   ): this extends BoxAlternativesSchema<infer B> ? BoxAlternativesSchema<BoxUnion<B, T>> : never;
  //   allow<T>(
  //     values: T[]
  //   ): this extends BoxAlternativesSchema<infer B> ? BoxAlternativesSchema<BoxUnion<B, T>> : never;
  //   allow(...values: any[]): this;
  //   allow(values: any[]): this;
  //
  //   try<T extends mappedSchema[]>(
  //     ...values: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
  //       : BoxAlternativesSchema<Box<extractType<T>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T>, false>>;
  //
  //   try<T extends mappedSchema[]>(
  //     values: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
  //       : BoxAlternativesSchema<Box<extractType<T>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T>, false>>;
  //
  //   try(...types: SchemaLike[]): this;
  //   try(types: SchemaLike[]): this;
  //
  //   required(): this extends BoxAlternativesSchema<infer B>
  //     ? BoxAlternativesSchema<BoxReq<B, true>>
  //     : never;
  //   required(): this;
  //   exist(): this extends BoxAlternativesSchema<infer B>
  //     ? BoxAlternativesSchema<BoxReq<B, true>>
  //     : never;
  //   exist(): this;
  //   optional(): this extends BoxAlternativesSchema<infer B>
  //     ? BoxAlternativesSchema<BoxReq<B, false>>
  //     : never;
  //   optional(): this;
  //
  //   when<
  //     R,
  //     T1 extends mappedSchema,
  //     T2 extends mappedSchema,
  //     T extends { then: T1; otherwise: T2 }
  //   >(
  //     ref: R,
  //     defs: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<
  //           BoxType<O, oT | extractType<T['then']> | extractType<T['otherwise']>>
  //         >
  //       : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>;
  //
  //   when(ref: string | Reference, options: WhenOptions): this;
  //   when(ref: Schema, options: WhenSchemaOptions): this;
  // }

  /**
   *  Composing types
   */

  /**
   *  Methods
   */

  export function any(): ExtendedAnySchema;
  export function string(): ExtendedStringSchema;
  export function number(): ExtendedNumberSchema;
  export function boolean(): ExtendedBooleanSchema;
  export function date(): ExtendedDateSchema;
  export function func(): ExtendedFunctionSchema;
  export function array(): ExtendedArraySchema;

  // export function object<T extends mappedSchemaMap>(
  //   schema?: T
  // ): BoxObjectSchema<Box<extractMap<T>, false>>;
  //
  // export function alternatives<T extends mappedSchema[]>(
  //   ...alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  // export function alternatives<T extends mappedSchema[]>(
  //   alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  //
  // export function alt<T extends mappedSchema[]>(
  //   ...alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  // export function alt<T extends mappedSchema[]>(
  //   alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

  type pullType<V, O> = O extends false ? V : V | undefined;

  type GenericSchema = AnySchemaExtension<any, boolean>;
  // type PrimitiveType = string | number | boolean | object | null;
  //
  // type ExtendedSchemaLike = PrimitiveType | GenericSchema | ExtendedSchemaMap;
  //
  // interface ExtendedSchemaMap {
  //   [key: string]: ExtendedSchemaLike | ExtendedSchemaLike[];
  // }

  type extractType<T> = T extends AnySchemaExtension<infer V, infer O> ? pullType<V, O> : T;
}
