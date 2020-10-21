import Validator from 'fastest-validator';
import { ValidationError } from '../../exceptions/ValidationError';
import { ISignupRequest } from '../../models/requests/ISignupRequest';
import { Role } from '../../models/Role';

const AuthSchema = {
  $$strict: true,
  name: {
    type: 'string',
    min: 1,
  },
  username: {
    type: 'string',
    pattern: new RegExp('^[a-z0-9]+$', 'i'),
    max: 50,
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
    optional: true,
  },
  department: {
    type: 'string',
    optional: true,
  },
  role: {
    type: 'string',
    enum: Object.values(Role),
    optional: true,
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
