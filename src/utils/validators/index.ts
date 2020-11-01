import { validateUser } from './AuthSchema';
import { validateCreateUser } from './SignupSchema';
import { validateUpdateUser } from './UpdateUserSchema';
import { validateUserPassword } from './ResetPasswordSchema';
const validators = {
  validateUser,
  validateCreateUser,
  validateUpdateUser,
  validateUserPassword,
};
export default validators;
