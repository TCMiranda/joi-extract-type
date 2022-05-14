/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

const schema = Joi.number().valid(2, 3, 4);
type DesiredType = 2 | 3 | 4 | undefined;
type ExtractedType = Joi.pullType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = 2;
v = 3;
v = 4;
v = undefined;

// v = 5;
