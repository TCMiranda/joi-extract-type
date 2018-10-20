import * as Joi from 'joi';
import './index';

// Unkown types or AnySchema defaults to type any
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

const user = Joi.object({
    full_name: full_name.required(),
    short_desc: Joi.string(),
    is_enabled,
    created_at,
    priority
});
type extractObject = Joi.extractType<typeof user>;
export const extractedObject: extractObject = {
    created_at: extractedDate,
    short_desc: undefined,
    full_name: extractedString,
    is_enabled: extractedBoolean,
    priority: extractedNumber,
};

const roles = Joi.array().items(Joi.string().valid(['admin', 'member', 'guest']));
type extractArray = Joi.extractType<typeof roles>;
export const extactedArray: extractArray = ['admin'];

const uuid_exp = `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`;
const uuid_pattern = new RegExp(uuid_exp, 'i');
const uuid = Joi.string().regex(uuid_pattern);
type extractUuid = Joi.extractType<typeof uuid>;
export const extractedUuid: extractUuid = '123e4567-e89b-12d3-a456-426655440000';

const apply = Joi.array().items(Joi.object({ id: uuid }));
type extractApply = Joi.extractType<typeof apply>;
const anyApply = [{ id: '3' }, { id: '4' }];
export const extractedApply: extractApply = anyApply;

const rule = Joi.object({ apply });
type extractRule = Joi.extractType<typeof rule>;
export const extractedRule: extractRule = { apply: extractedApply };

export const jobOperatorRoleSchema = Joi.object({
    id: Joi.string().required(),
    user_id: Joi.string().required(),
    job_id: Joi.string().required(),
    role: Joi.string().valid('recruiter', 'requester'),
    pipeline_rules: Joi.array().items(rule),
});
type extractComplexType = Joi.extractType<typeof jobOperatorRoleSchema>;
export const extractedComplexType: extractComplexType = {
    id: '2015',
    user_id: '102',
    job_id: '52',
    role: 'requester',
    pipeline_rules: [extractedRule]
};

function someFunction() { return someFunction; }
const createUserSchema = Joi.func<typeof someFunction>();
type extractFunction = Joi.extractType<typeof createUserSchema>;
export const extractedFunction: extractFunction = someFunction;

const number_string = Joi.alt().try(Joi.number(), Joi.string());
type extractNumberString = Joi.extractType<typeof number_string>;
export const extractNumberStringNumber: extractNumberString = 2;
export const extractNumberStringString: extractNumberString = '2';

const date_time1 = Joi.alternatives([Joi.date(), Joi.number(), Joi.string()]);
type extractDateTime1 = Joi.extractType<typeof date_time1>;
export const extractDateTimeDate1: extractDateTime1 = new Date();
export const extractDateTimeTime1: extractDateTime1 = +new Date();
export const extractDateTimeString1: extractDateTime1 = new Date().toISOString();

const string_array_schema = [
    Joi.string(),
    Joi.array()
        .items([Joi.string(), Joi.number()])
        .valid('string', 2) // TODO overwrite valid on ArraySchema
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
type priorityValidationResponse = { error: any, value: extractNumber };
export const validationExtractedNumber1: priorityValidationResponse = Joi.validate(extractedNumber, priority);
export const validationExtractedNumber2: priorityValidationResponse = Joi.validate(extractedNumber, priority, { });

type strictEnum = 'tag';
export const validationOverwrittenReturn: strictEnum = Joi.validate(extractedNumber, priority, (err, value: extractNumber) => {
    if (typeof value === 'number')
        return 'tag' as 'tag';
});
