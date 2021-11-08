/** @format */

import Joi from 'joi';
import './index';

const extJoi = Joi.extend({} as Joi.Extension);

// Unknown types or AnySchema defaults to type any
const any_schema = Joi.any();
type extractAny = Joi.extractType<typeof any_schema>;
export const extractedAny: extractAny = 'anything';

const is_enabled = Joi.boolean();
type extractBoolean = Joi.extractType<typeof is_enabled>;
export const extractedBoolean: extractBoolean = true;

const full_name = extJoi.string();
type extractString = Joi.extractType<typeof full_name>;
export const extractedString: extractString = 'string';

const created_at = Joi.date();
type extractDate = Joi.extractType<typeof created_at>;
export const extractedDate: extractDate = new Date();

const priority = extJoi.number();
type extractNumber = Joi.extractType<typeof priority>;
export const extractedNumber: extractNumber = 5;

const userAsObject = {
  full_name: full_name.required(),
  short_desc: extJoi.string(),
  is_enabled,
  has_credentials: Joi.boolean().valid(true).required(),
  created_at,
  priority,
};
const user = Joi.object(userAsObject);
type extractObject = Joi.extractType<typeof userAsObject>;
type extractObjectSchema = Joi.extractType<typeof user>;
export const extractedObject: extractObject = {
  created_at: extractedDate,
  full_name: extractedString,
  is_enabled: extractedBoolean,
  priority: extractedNumber,
  has_credentials: true,
};
export const extractedObjectSchema: extractObjectSchema = extractedObject;

const roles = extJoi
  .array()
  .items(extJoi.string().valid(['admin', 'member', 'guest']))
  .items(extJoi.number());
type extractArray = Joi.extractType<typeof roles>;
export const extractedArray: extractArray = ['admin', 2];

const uuid_exp = `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`;
const uuid_pattern = new RegExp(uuid_exp, 'i');
const uuid = extJoi.string().regex(uuid_pattern);
type extractUuid = Joi.extractType<typeof uuid>;
export const extractedUuid: extractUuid = '123e4567-e89b-12d3-a456-426655440000';

const apply = extJoi.array().items(Joi.object({ id: uuid.required() }));
type extractApply = Joi.extractType<typeof apply>;
const anyApply = [{ id: '3' }, { id: undefined }];
export const extractedApply: extractApply = anyApply;

const rule_flat = extJoi
  .array()
  .items(extJoi.string())
  .items(Joi.object({ id: uuid.required() }));
type extractRuleFlat = Joi.extractType<typeof rule_flat>;
export const extractedRuleFlat: extractRuleFlat = [{ id: 'string' }, 'test'];

const rule = Joi.object().keys({ apply, id: uuid.required() });
type extractRule = Joi.extractType<typeof rule>;
export const extractedRule: extractRule = {
  apply: extractedApply,
  id: 'string',
};

export const ruleMap = Joi.object().pattern(/\w+/, rule);
type extractRuleMap = Joi.extractType<typeof ruleMap>;
export const extractedRuleMap: extractRuleMap = { somekey: extractedRule };

export const jobOperatorRoleSchema = Joi.object({
  id: extJoi.string().required(),
  user_id: extJoi.string().required(),
  job_id: extJoi.string(),
  index: extJoi.number(),
  parent_index: extJoi.number().required(),
  role: extJoi.string().valid('recruiter', 'requester'),
  pipeline_rules: extJoi.array().items(rule).required(),
});
type extractComplexType = Joi.extractType<typeof jobOperatorRoleSchema>;
export const extractedComplexType: extractComplexType = {
  id: '2015',
  user_id: '102',
  job_id: '52',
  role: 'requester',
  parent_index: 5,
  pipeline_rules: [extractedRule],
};

export const usingDefaultWithProps = Joi.object({
  number_prop_with_default: extJoi.number().default(2),
  string_prop_with_default: extJoi.string().default('string'),
  boolean_prop_with_default: Joi.boolean().default(false),
  date_prop_with_default: Joi.date().default(new Date()),
  array_prop_with_default: extJoi.array().default([5]),
  object_prop_with_default: Joi.object({ number: extJoi.number() }).default({
    string: extJoi.string(),
  }),
});
type usingDefaultWithPropsType = Joi.extractType<typeof usingDefaultWithProps>;
export const extractedUsingDefaultWithProps: usingDefaultWithPropsType = {
  number_prop_with_default: 20,
  string_prop_with_default: 'string',
  boolean_prop_with_default: true,
  date_prop_with_default: new Date(),
  array_prop_with_default: [1, 2],
  object_prop_with_default: { number: 5 },
};

export const extractedComplexTypeValidationResponse = jobOperatorRoleSchema.validate({});

const appendedJobOperatorRoleSchema = jobOperatorRoleSchema.append({
  excluded: Joi.boolean(),
});

type extractAppendedSchema = Joi.extractType<typeof appendedJobOperatorRoleSchema>;
export const extractedAppended: extractAppendedSchema = {
  ...extractedComplexType,
  excluded: true,
};

function someFunction() {
  return someFunction;
}
const createUserSchema = Joi.func();
type extractFunction = Joi.extractType<typeof createUserSchema>;
export const extractedFunction: extractFunction = someFunction;

const number_string = Joi.alt().try(extJoi.number().valid(1, 2, 3), extJoi.string());
type extractNumberString = Joi.extractType<typeof number_string>;
export const extractNumberStringNumber: extractNumberString = 2;
export const extractNumberStringString: extractNumberString = '2';

const date_time1 = Joi.alternatives([Joi.date(), extJoi.number(), extJoi.string()]);
type extractDateTime1 = Joi.extractType<typeof date_time1>;
export const extractDateTimeDate1: extractDateTime1 = new Date();
export const extractDateTimeTime1: extractDateTime1 = +new Date();
export const extractDateTimeString1: extractDateTime1 = new Date().toISOString();

const when = Joi.alt().when('x', { is: 'a', then: extJoi.string(), otherwise: extJoi.number() });
type extractedWhen = Joi.extractType<typeof when>;
export const extractWhen1: extractedWhen = 2;
export const extractWhen2: extractedWhen = '2';

const required_alt = Joi.object({
  required: Joi.object({
    start_date: date_time1.required(),
    end_date: date_time1,
    value: when.required(),
  }).required(),
});
type extractedRequiredAlt = Joi.extractType<typeof required_alt>;
export const extractRequiredAlt: extractedRequiredAlt = {
  required: { start_date: new Date(), value: '2' },
};

const required_alt_augmented = required_alt.keys({
  required2: Joi.object({
    value: extJoi.number(),
  })
    .required()
    .pattern(/\w+/, extJoi.number())
    .pattern(extJoi.string(), extJoi.number())
    .pattern(extJoi.string().valid('pattern_key'), extJoi.number()),
});
type extractedRequiredAltAugmented = Joi.extractType<typeof required_alt_augmented>;
export const extractRequiredAltAugmented: extractedRequiredAltAugmented = {
  required: {
    start_date: new Date(),
    value: 2,
  },
  required2: {},
};

const string_array_schema = [
  extJoi.string().default('test' as 'test'),
  extJoi.array().items([extJoi.string(), extJoi.number()]).valid('string', 2), // TODO overwrite valid on ArraySchema
];
type extractStringArray = Joi.extractType<typeof string_array_schema>;
export const extractStringArrayString: extractStringArray = 'string';
export const extractStringArrayArray: extractStringArray = ['string', 2];

// A extends B type guard
type numberExtendsAny = Joi.extendsGuard<any, extractNumber>;
export const asNumber: numberExtendsAny = 2;

type stringNotNumber = Joi.extendsGuard<string, extractNumber>;
export const asString: stringNotNumber = 'string';

// Validation methods
type priorityValidationResponse = { error?: any; value: extractNumber };
export const validationExtractedNumber1: priorityValidationResponse =
  priority.validate(extractedNumber);
export const validationExtractedNumber2: priorityValidationResponse = priority.validate(
  extractedNumber,
  {}
);
export const validatedNumber: number =
  validationExtractedNumber2.value || validationExtractedNumber1.value;

type strictEnum = 'tag';
export const validationOverwrittenReturn: strictEnum = rule.validate(
  extractedRule,
  (_err, value) => {
    if (typeof value === 'number') return 'tag' as 'tag';
  }
);

const ruleValidationResult = rule.validate(extractedRule);
export const validResult: extractRule = ruleValidationResult.value;

const ruleGlobalValidationResult = Joi.validate(extractedRule, rule);
export const validGlobalResult: extractRule = ruleGlobalValidationResult.value;

const nullableString = extJoi.string().valid('string').allow(null, 0);
type extractNullableString = Joi.extractType<typeof nullableString>;
export const extractedNullableStringNull: extractNullableString = null;
export const extractedNullableStringZero: extractNullableString = 0;
export const extractedNullableString: extractNullableString = 'string';

const nullableNumber = extJoi
  .number()
  .allow(null as null)
  .default(5);
type extractNullableNumber = Joi.extractType<typeof nullableNumber>;
export const extractedNullableNumberNull: extractNullableNumber = null;
export const extractedNullableNumber: extractNullableNumber = 15;

const nullType = null as null;
const allNullable = {
  nullableString,
  nullableNumber,
  nullableBoolean: Joi.boolean().required().allow(nullType),
  nullableFunc: Joi.func().required().allow(nullType),
  nullableDate: Joi.date().required().allow(nullType),
  nullableArray: extJoi.array().items(extJoi.string()).allow(nullType),
  nullableObject: Joi.object({ nullableString }).allow(nullType),
  nullableAlt: Joi.alt(nullableString, nullableNumber).allow(nullType),
};
type extractAllNullable = Joi.extractType<typeof allNullable>;
export const extractedAllNullable: extractAllNullable = {
  nullableString: null,
  nullableNumber: null,
  nullableBoolean: null,
  nullableFunc: null,
  nullableDate: null,
  nullableArray: null,
  nullableObject: null,
  nullableAlt: null,
};

export const anyRequired = Joi.any().required();
export const anyOptional = Joi.any();
export const anyTestSchema = { anyRequired, anyOptional };
type extractedAnyTest = Joi.extractType<typeof anyTestSchema>;

export let anyTests: extractedAnyTest;
anyTests = { anyRequired: 'test', anyOptional: 'test' };
anyTests = { anyRequired: 'test' };
anyTests = { anyRequired: 123, anyOptional: 123 };

// Test for issue #27
const nestedObjSchema = Joi.object()
  .required()
  .keys({
    nested: Joi.object().required().keys({
      foo: Joi.string().required(),
    }),
    opt: Joi.object().keys({
      bar: Joi.string().required(),
    }),
  });

type extractNestedObjSchema = Joi.extractType<typeof nestedObjSchema>;
export const extractedNestedObjSchema: extractNestedObjSchema = {
  nested: {
    foo: 'string',
  },
};

// Test for issue #36
export const stdSchemaMethods = [
  Joi.any().tag('tags').label('any'),
  Joi.string().tag('tags').label('string'),
  Joi.boolean().tag('tags').label('boolean'),
  Joi.number().tag('tags').label('number'),
  Joi.date().tag('tags').label('date'),
  Joi.object().tag('tags').label('object'),
  Joi.array().tag('tags').label('array'),
  Joi.alt().tag('tags').label('alt'),
];
