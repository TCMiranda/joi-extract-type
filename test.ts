/** @format */

import JoiExtractType from './index';
import { jobOperatorRoleSchema } from './index.spec';

export type expectedType = JoiExtractType.extractType<typeof jobOperatorRoleSchema>;

export const response = ((unpredictableData: expectedType) => {
  const validation = unpredictableData.validate(jobOperatorRoleSchema);

  if (!validation.error) return validation.value;
})(undefined);
