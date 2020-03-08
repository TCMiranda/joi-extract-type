/** @format */

import * as Joi from '@hapi/joi';
import './index';

// Unknown types or AnySchema defaults to type any
const any_schema = Joi.any();
type extractAny = Joi.extractType<typeof any_schema>;
export const extractedAny: extractAny = 'anything';

const is_enabled = Joi.boolean();
type extractBoolean = Joi.extractType<typeof is_enabled>;
export const extractedBoolean: extractBoolean = true;

const full_name = Joi.string();
type extractString = Joi.extractType<typeof full_name>;
export const extractedString: extractString = 'string';

const created_at = Joi.date();
type extractDate = Joi.extractType<typeof created_at>;
export const extractedDate: extractDate = new Date();

const priority = Joi.number();
type extractNumber = Joi.extractType<typeof priority>;
export const extractedNumber: extractNumber = 5;

const userAsObject = {
  full_name: full_name.required(),
  short_desc: Joi.string(),
  is_enabled,
  has_credentials: Joi.boolean()
    .valid(true)
    .required(),
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

const roles = Joi.array()
  .items(Joi.string().valid(['admin', 'member', 'guest']))
  .items(Joi.number());
type extractArray = Joi.extractType<typeof roles>;
export const extactedArray: extractArray = ['admin', 2];

const uuid_exp = `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`;
const uuid_pattern = new RegExp(uuid_exp, 'i');
const uuid = Joi.string().regex(uuid_pattern);
type extractUuid = Joi.extractType<typeof uuid>;
export const extractedUuid: extractUuid = '123e4567-e89b-12d3-a456-426655440000';

const apply = Joi.array().items(Joi.object({ id: uuid.required() }));
type extractApply = Joi.extractType<typeof apply>;
const anyApply = [{ id: '3' }, { id: undefined }];
export const extractedApply: extractApply = anyApply;

const rule_flat = Joi.array()
  .items(Joi.string())
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
  id: Joi.string().required(),
  user_id: Joi.string().required(),
  job_id: Joi.string(),
  index: Joi.number(),
  parent_index: Joi.number().required(),
  role: Joi.string().valid('recruiter', 'requester'),
  pipeline_rules: Joi.array()
    .items(rule)
    .required(),
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
  number_prop_with_default: Joi.number().default(2),
  string_prop_with_default: Joi.string().default('string'),
  boolean_prop_with_default: Joi.boolean().default(false),
  date_prop_with_default: Joi.date().default(new Date()),
  array_prop_with_default: Joi.array().default([5]),
  object_prop_with_default: Joi.object({ number: Joi.number() }).default({ string: Joi.string() }),
})
type usingDefaultWithPropsType = Joi.extractType<typeof usingDefaultWithProps>;
export const extractedUsingDefaultWithProps: usingDefaultWithPropsType = {
  number_prop_with_default: 20,
  string_prop_with_default: 'string',
  boolean_prop_with_default: true,
  date_prop_with_default: new Date(),
  array_prop_with_default: [1, 2],
  object_prop_with_default: { number: 5 },
};

export const extractedComplexTypeValidationResponse = Joi.validate(
  { },
  jobOperatorRoleSchema
)

const appendedJobOperatorRoleSchema = jobOperatorRoleSchema.append({
  excluded: Joi.boolean()
})

type extractAppendedSchema = Joi.extractType<typeof appendedJobOperatorRoleSchema>
export const extractedAppended: extractAppendedSchema = {
  ...extractedComplexType,
  excluded: true
}

function someFunction() {
  return someFunction;
}
const createUserSchema = Joi.func<typeof someFunction>();
type extractFunction = Joi.extractType<typeof createUserSchema>;
export const extractedFunction: extractFunction = someFunction;

const number_string = Joi.alt().try(Joi.number().valid(1, 2, 3), Joi.string());
type extractNumberString = Joi.extractType<typeof number_string>;
export const extractNumberStringNumber: extractNumberString = 2;
export const extractNumberStringString: extractNumberString = '2';

const date_time1 = Joi.alternatives([Joi.date(), Joi.number(), Joi.string()]);
type extractDateTime1 = Joi.extractType<typeof date_time1>;
export const extractDateTimeDate1: extractDateTime1 = new Date();
export const extractDateTimeTime1: extractDateTime1 = +new Date();
export const extractDateTimeString1: extractDateTime1 = new Date().toISOString();

const when = Joi.alt().when('x', { is: 'a', then: Joi.string(), otherwise: Joi.number() });
type extractedWhen = Joi.extractType<typeof when>;
export const extractWhen1: extractedWhen = 2;
export const extractWhen2: extractedWhen = '2';

const required_alt = {
  required: Joi.object({
    start_date: date_time1.required(),
    end_date: date_time1,
    value: when.required(),
  }).required(),
};
type extractedRequiredAlt = Joi.extractType<typeof required_alt>;
export const extractRequiredAlt: extractedRequiredAlt = {
  required: { start_date: new Date(), value: '2' },
};

const required_alt_augmented = Joi.object(required_alt).keys({
  required2: Joi.object({
    value: Joi.number(),
  })
    .required()
    .pattern(/\w+/, Joi.number())
    .pattern(Joi.string(), Joi.number())
    .pattern(Joi.string().valid('pattern_key'), Joi.number()),
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
  Joi.string().default('test' as 'test'),
  Joi.array()
    .items([Joi.string(), Joi.number()])
    .valid('string', 2), // TODO overwrite valid on ArraySchema
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
type priorityValidationResponse = { error: any; value: extractNumber };
export const validationExtractedNumber1: priorityValidationResponse = Joi.validate(
  extractedNumber,
  priority
);
export const validationExtractedNumber2: priorityValidationResponse = Joi.validate(
  extractedNumber,
  priority,
  {}
);
export const validatedNumber: number =
  validationExtractedNumber2.value || validationExtractedNumber1.value;

type strictEnum = 'tag';
export const validationOverwrittenReturn: strictEnum = Joi.validate(
  extractedNumber,
  priority,
  (err, value: extractNumber) => {
    if (typeof value === 'number') return 'tag' as 'tag';
  }
);
