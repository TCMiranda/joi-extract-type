/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

// default will set type back to optional
// as the validation will provide value
const schema = Joi.array();
type DesiredType = any[] | undefined;
type ExtractedType = Joi.extractType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = [];
v = [1, '2', null];
v = undefined;
// v = null;
