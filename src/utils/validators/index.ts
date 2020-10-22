import { validateUser } from './AuthSchema';
import { validateCreateUser } from './SignupSchema';
import { validateUpdateUser } from './UpdateUserSchema';
const validators = {
  validateUser,
  validateCreateUser,
  validateUpdateUser,
};
export default validators;
