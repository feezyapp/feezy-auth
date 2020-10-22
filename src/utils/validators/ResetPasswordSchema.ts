import Validator from 'fastest-validator';
import { ValidationError } from '../../exceptions/ValidationError';
import { IResetPasswordRequest } from '../../models/requests/IUserUpdateRequest';

const ResetPasswordSchema = {
  $$strict: true,
  username: {
    type: 'string',
    min: 1,
  },
  password: {
    type: 'string',
    pattern: new RegExp('^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,15}$'),
    messages: {
      stringPattern:
        'Password should have atleast 8 characters including lowercase, uppercase, special character and number and no more than 15 characters',
    },
  },
  id: {
    type: 'string',
    min: 1,
    optional: true,
  },
};

const validator = new Validator();
const validateCreate = validator.compile(ResetPasswordSchema);

export const validateUserPassword = (request: IResetPasswordRequest) => {
  const isValidationPassed = validateCreate(request);
  if (typeof isValidationPassed === 'boolean') {
    return isValidationPassed;
  } else {
    throw new ValidationError(isValidationPassed);
  }
};
