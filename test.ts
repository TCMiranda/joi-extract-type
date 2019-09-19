/** @format */

import * as Joi from 'joi';
import { jobOperatorRoleSchema } from './index.spec';

export type expectedType = Joi.extractType<typeof jobOperatorRoleSchema>;

export const response = ((unpredictableData: expectedType) => {
  const validation = Joi.validate(unpredictableData, jobOperatorRoleSchema);

  if (!validation.error) return validation.value;
})(undefined);
