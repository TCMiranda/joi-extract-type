/** @format */

import { jobOperatorRoleSchema } from './index.spec';
import extractType from './index';

export type expectedType = extractType<typeof jobOperatorRoleSchema>;

export const response = ((unpredictableData: expectedType) => {
  const validation = unpredictableData.validate(jobOperatorRoleSchema);

  if (!validation.error) return validation.value;
})(undefined);
