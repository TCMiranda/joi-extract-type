/** @format */

import { jobOperatorRoleSchema } from './index.spec';
import Joi from 'joi';
import './index';

export type expectedType = Joi.extractType<typeof jobOperatorRoleSchema>;

export const response = ((unpredictableData: expectedType) => {
  const validation = unpredictableData.validate(jobOperatorRoleSchema);

  if (!validation.error) return validation.value;
})(undefined);
