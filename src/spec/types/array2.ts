/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

// default will set type back to optional
// as the validation will provide value
const schema = Joi.array().items(Joi.number().required(), Joi.string().required());
type DesiredType = (string | number)[] | undefined;
type ExtractedType = Joi.pullType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = [];
v = [1, '2'];
v = undefined;

// v = [1, '2', new Date()];
// v = null;
