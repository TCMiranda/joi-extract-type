/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

const schema = Joi.array().items(
  Joi.array().items(Joi.number(), Joi.string()).required(),
  Joi.string().required()
);

type InternalArray = (number | string)[];
type DesiredType = (InternalArray | string)[] | undefined;

type ExtractedType = Joi.extractType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = [];
v = ['2'];
v = ['2', ['test', 2]];
v = undefined;

// Array iwll remove undefined form union type even if we done set required() for array items
// v = ['2', ['test', 2, undefined]];
// v = ['2', ['test', 2, new Date()]];
// v = null;
