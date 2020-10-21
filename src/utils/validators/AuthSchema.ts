import Validator from 'fastest-validator';
import { ValidationError } from '../../exceptions/ValidationError';
import { ILoginRequest } from '../../models/requests/ILoginRequest';

const AuthSchema = {
  $$strict: true,
  username: {
    type: 'string',
    min: 1,
  },
  password: {
    type: 'string',
    min: 1,
  },
};

const validator = new Validator();
const validateCreate = validator.compile(AuthSchema);

export const validateUser = (request: ILoginRequest) => {
  const isValidationPassed = validateCreate(request);
  if (typeof isValidationPassed === 'boolean') {
    return isValidationPassed;
  } else {
    throw new ValidationError(isValidationPassed);
  }
};
