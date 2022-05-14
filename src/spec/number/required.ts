/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

const schema = Joi.number().required();
type DesiredType = number;
type ExtractedType = Joi.extractType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = 2;

// v = undefined;

