import * as Joi from 'joi';
import './index';

// Tests: the compiler shouldn't find problems and should recursively map the schema to correct type
const is_enabled = Joi.boolean();
type extractBoolean = Joi.extractType<typeof is_enabled>;
export const extractedBoolean: extractBoolean = true;

const full_name = Joi.string();
type extractString = Joi.extractType<typeof full_name>;
export const extractedString: extractString = 'string';

const user = Joi.object({ full_name, is_enabled });
type extractObject = Joi.extractType<typeof user>;
export const extractedObject: extractObject = { full_name: extractedString, is_enabled: extractedBoolean };

const roles = Joi.array().items(Joi.string());
type extractArray = Joi.extractType<typeof roles>;
export const extactedArray: extractArray = ['admin'];

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
    role: Joi.string().valid([ 'recruiter', 'requester' ]),
    pipeline_rules: Joi.array().items(rule),
});
type extractComplexType = Joi.extractType<typeof jobOperatorRoleSchema>;
export const extractedComplexType: extractComplexType = {
    id: '2015',
    user_id: '102',
    job_id: '52',
    role: 'admin',
    pipeline_rules: [extractedRule]
};
