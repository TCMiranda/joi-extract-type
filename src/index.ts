/** @format */

import * as Joi from 'joi';
import { AnySchema } from 'joi';
// import { ObjectSchema, Schema } from 'joi';

declare module 'joi' {
  /**
   * Generic Schema helper
   */

  type ExtendedAnyKeys = 'allow' | 'default' | 'exist' | 'optional' | 'required' | 'valid';
  type OmitExtendedAnyKeys<T> = Omit<T, ExtendedAnyKeys>;

  interface AnySchemaHelper<ValueType, Optional = true> {
    allow<T>(
      ...values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<V | T, O> : never;
    allow<T>(
      values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<V | T, O> : never;

    default<T extends ValueType>(value: T, description?: string): AnySchemaHelper<ValueType>;
    // alias of required
    exist(): AnySchemaHelper<ValueType, false>;
    optional(): AnySchemaHelper<ValueType>;
    required(): AnySchemaHelper<ValueType, false>;

    valid<T extends ValueType>(
      ...values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<T, O> : never;
    valid<T extends ValueType>(
      values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<T, O> : never;
  }

  /**
   *  Primitive Schemas
   */

  interface ExtendedAnySchema<O = true>
    extends AnySchemaHelper<any, O>,
      OmitExtendedAnyKeys<AnySchema> {}

  interface ExtendedStringSchema<O = true>
    extends AnySchemaHelper<string, O>,
      OmitExtendedAnyKeys<StringSchema> {}

  interface ExtendedNumberSchema<O = true>
    extends AnySchemaHelper<number, O>,
      OmitExtendedAnyKeys<NumberSchema> {}

  interface ExtendedBooleanSchema<O = true>
    extends AnySchemaHelper<boolean, O>,
      OmitExtendedAnyKeys<BooleanSchema> {}

  interface ExtendedDateSchema<O = true>
    extends AnySchemaHelper<Date, O>,
      OmitExtendedAnyKeys<DateSchema> {}

  interface ExtendedFunctionSchema<O = true>
    extends AnySchemaHelper<Function, O>,
      OmitExtendedAnyKeys<FunctionSchema> {}

  /**
   *  Array Schema - ValueType keeps resolved types
   */

  type ResolveToRequired<T> = T extends AnySchemaHelper<infer V, infer O>
    ? MaybeType<V, false>
    : never;

  type TupleToUnion<T extends GenericSchema[]> = T[number];
  type ResolveArrayTypes<T extends GenericSchema[]> = {
    // we force the array types to be required - to prevent putting undefined - [v1, undefined]
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  interface ExtendedArraySchema<ValueType = any[], Optional = true>
    extends AnySchemaHelper<ValueType, Optional>,
      Omit<OmitExtendedAnyKeys<ArraySchema>, 'items'> {
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

    // TODO: add ordered - simply not resolve tuple
  }

  /**
   * Object: Object Schema
   */

  // TS bug prevented me of using common parametrized type. I had to split it into two
  // GetOptionalKeys andGetRequiredKeys types - with 'extends false' instead of 'extends OptionalCase'
  export type GetOptionalKeys<T extends ObjectSchemaArgument> = {
    [K in keyof T]: T[K] extends AnySchemaHelper<infer V, infer O>
      ? // TS bug: false can be changed to true and it behave as nothing happen
        // reordered the '? : ' values instead
        O extends false
        ? never
        : K
      : never;
  }[keyof T];

  export type GetRequiredKeys<T extends ObjectSchemaArgument> = {
    [K in keyof T]: T[K] extends AnySchemaHelper<infer V, infer O>
      ? O extends false
        ? K
        : never
      : never;
  }[keyof T];

  type OptionalObjectKeys<T, Keys> = {
    [K in keyof T as Extract<K, Keys>]?: T[K];
  };

  type RequiredObjectKeys<T, Keys> = {
    [K in keyof T as Extract<K, Keys>]-?: T[K];
  };

  type ResolveObjectValues<T> = {
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  type ResolveObjectTypes<
    T extends ObjectSchemaArgument,
    R = ResolveObjectValues<T>,
    OptionalKeys = GetOptionalKeys<T>,
    RequiredKeys = GetRequiredKeys<T>
  > = OptionalObjectKeys<R, OptionalKeys> & RequiredObjectKeys<R, RequiredKeys>;

  interface ExtendedObjectSchema<ValueType = {}, Optional = true>
    extends AnySchemaHelper<ValueType, Optional>,
      Omit<OmitExtendedAnyKeys<ObjectSchema>, 'keys' | 'append' | 'pattern'> {
    keys<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>, O>
      : never;

    append<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>, O>
      : never;

    pattern<T extends GenericSchema>(
      pattern: any,
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<{ [key: string]: ResolveToRequired<T> } & V, O>
      : never;
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
   *  Methods
   */

  export function any(): ExtendedAnySchema;
  export function string(): ExtendedStringSchema;
  export function number(): ExtendedNumberSchema;
  export function boolean(): ExtendedBooleanSchema;
  export function date(): ExtendedDateSchema;
  export function func(): ExtendedFunctionSchema;
  export function array(): ExtendedArraySchema;

  export function object<T extends ObjectSchemaArgument>(
    schema?: T
  ): ExtendedObjectSchema<ResolveObjectTypes<T>>;
  /**
   * Allow extend() to use Joi types by default
   */
  // export function extend(
  //   extension: Extension | Extension[],
  //   ...extensions: Array<Extension | Extension[]>
  // ): typeof Joi;

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

  type MaybeType<V, Optional> = Optional extends false ? V : V | undefined;

  type GenericSchema = AnySchemaHelper<any, boolean>;
  type ObjectOrArraySchema = GenericSchema; // | GenericSchema[];
  type ObjectSchemaArgument = Record<string, ObjectOrArraySchema>;

  type pullType<T> = T extends AnySchemaHelper<infer V, infer O> ? MaybeType<V, O> : T;

  // TODO: add
  //  pullInType = pullType
  //  pullOutType = pullType where default types are mandatory
}
