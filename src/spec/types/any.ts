/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

// default will set type back to optional
// as the validation will provide value
const schema = Joi.any();
type DesiredType = any | undefined;
type ExtractedType = Joi.pullType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = 2;
v = undefined;
v = 'string';
// v = null;