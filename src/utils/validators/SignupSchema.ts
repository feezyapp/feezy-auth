import Validator from 'fastest-validator';
import { ValidationError } from '../../exceptions/ValidationError';
import { ISignupRequest } from '../../models/requests/ISignupRequest';

const AuthSchema = {
  $$strict: true,
  firstname: {
    type: 'string',
  },
  lastname: {
    type: 'string',
  },
  password: {
    type: 'string',
    pattern: new RegExp('^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,15}$'),
    messages: {
      stringPattern:
        'Password should have atleast 8 characters including lowercase, uppercase, special character and number and no more than 15 characters',
    },
  },
  email: {
    type: 'email',
  },
  contact: {
    type: 'string',
  },
};

const validator = new Validator();
const validateCreate = validator.compile(AuthSchema);

export const validateCreateUser = (request: ISignupRequest) => {
  const isValidationPassed = validateCreate(request);
  if (typeof isValidationPassed === 'boolean') {
    return isValidationPassed;
  } else {
    throw new ValidationError(isValidationPassed);
  }
};
