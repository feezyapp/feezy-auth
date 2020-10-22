import Validator from 'fastest-validator';
import { ValidationError } from '../../exceptions/ValidationError';
import { IUserUpdateRequest } from '../../models/requests/IUserUpdateRequest';
import { Role } from '../../models/Role';
import { Status } from '../../models/Status';

const UpdateUserSchema = {
  $$strict: true,
  name: {
    type: 'string',
    min: 1,
    optional: true,
  },
  email: {
    type: 'string',
    min: 1,
    optional: true,
  },
  department: {
    type: 'string',
    min: 1,
    optional: true,
  },
  role: {
    type: 'string',
    enum: Object.values(Role),
    optional: true,
  },
  status: {
    type: 'string',
    enum: Object.values(Status),
    optional: true,
  },
};

const validator = new Validator();
const validateCreate = validator.compile(UpdateUserSchema);

export const validateUpdateUser = (request: IUserUpdateRequest) => {
  const isValidationPassed = validateCreate(request);
  if (typeof isValidationPassed === 'boolean') {
    return isValidationPassed;
  } else {
    throw new ValidationError(isValidationPassed);
  }
};
