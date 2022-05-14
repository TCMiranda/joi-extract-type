/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

// value is by default optional to check if it works
// we have to set required first
const schema = Joi.number().required().optional();
type DesiredType = number | undefined;
type ExtractedType = Joi.extractType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = 2;
v = undefined;
