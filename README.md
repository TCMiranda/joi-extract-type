<!-- @format -->

# joi-extract-type

Provides native type extraction from [Joi](https://github.com/hapijs/joi) Schemas for Typescript.

---

Joi Schemas are great. But if you use Typescript to define your entities, it is easy to duplicate the definition inside the Schemas and all application interfaces.

This library enhances Joi interfaces to provides an utility to infer the type from a Schema.

**Why should you use it**

- Avoid duplication from Joi Schemas and application interfaces
- Port javascript applications using [Joi](https://github.com/hapijs/joi) to typescript easily
- Does not requires changes to already defined Schemas

**Limitation**

- Joi is probably a superset of typescript in terms of validation, branching, conditional types, etc. This library is probably suitable for most simples cases, but wont ever prevent every validation error to occur with just static analyses.
- This is ~experimental~ and a work in progress. Although I use it in some projects and works for 99% of my schemas.

## Installation

```
npm i --save joi-extract-type
```

**Built for typescript@^3**

For typescript 2.9 support checkout branch /typescript@2 or install with:

```
npm i --save joi-extract-type@ts2-1
```

## Usage

Import the library and patch Joi's typings:

```ts
import * as Joi from '@hapi/joi';
import 'joi-extract-type';
```

Create the schemas and use `Joi.extractType` to infer the type:

```ts
const is_enabled = Joi.boolean();
type extractBoolean = Joi.extractType<typeof is_enabled>;
export const extractedBoolean: extractBoolean = true;
```

**Examples**

The following code is copied from this library spec, which compiles the code with `tsc` that should not output any errors.

```ts
const is_enabled = Joi.boolean();
type extractBoolean = Joi.extractType<typeof is_enabled>;
export const extractedBoolean: extractBoolean = true;

const full_name = Joi.string();
type extractString = Joi.extractType<typeof full_name>;
export const extractedString: extractString = 'string';

const user = Joi.object({ full_name, is_enabled });
type extractObject = Joi.extractType<typeof user>;
export const extractedObject: extractObject = {
  full_name: extractedString,
  is_enabled: extractedBoolean,
};

const roles = Joi.array().items(Joi.string());
type extractArray = Joi.extractType<typeof roles>;
export const extractedArray: extractArray = ['admin'];

const apply = Joi.array().items(Joi.object({ id: Joi.string() }));
type extractApply = Joi.extractType<typeof apply>;
export const extractedApply: extractApply = [{ id: '3' }, { id: '4' }];

const rule = Joi.object({ apply });
type extractRule = Joi.extractType<typeof rule>;
export const extractedRule: extractRule = { apply: extractedApply };

export const jobOperatorRoleSchema = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  role: Joi.string().valid(['recruiter', 'requester']),
  pipeline_rules: Joi.array().items(rule),
});
type extractComplexType = Joi.extractType<typeof jobOperatorRoleSchema>;
export const extractedComplexType: extractComplexType = {
  id: '2015',
  user_id: '102',
  job_id: '52',
  role: 'admin',
  pipeline_rules: [extractedRule],
};

// typeof extractedComplexType
// const extractedComplexType: Joi.extractMap<{
//     id: Joi.StringSchema;
//     user_id: Joi.StringSchema;
//     job_id: Joi.StringSchema;
//     role: Joi.StringSchema;
//     pipeline_rules: Joi.ArraySchema<Joi.extractMap<{
//         apply: Joi.ArraySchema<Joi.extractMap<{
//             id: Joi.StringSchema;
//         }>>;
//     }>>;
// }>
```
