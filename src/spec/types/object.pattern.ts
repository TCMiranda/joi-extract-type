/** @format */

import * as Joi from 'joi';
import '../../index';
import { CommonPartType } from '../copareTypes';

// default will set type back to optional
// as the validation will provide value
const schema = Joi.object()
  // keys will be invalidated
  .keys({
    test: Joi.number(),
    test2: Joi.number().required(),
    test3: Joi.string().required(),
  })
  .pattern('any', Joi.any())
  .required();

type Obj = {
  [k: string]: any;
  test?: number;
  test2: number;
  test3: string;
};
type DesiredType = Obj;
type ExtractedType = Joi.pullType<typeof schema>;
type Type = CommonPartType<DesiredType, ExtractedType>;

let v: Type = { test2: 2, test3: 't' };
v = { z: 'z', test2: 2, test3: 'est', y: 2 };

// v = { test: 2 };
// v = { test: 1, test2: 2, test3: 'test' };
// v = null;
