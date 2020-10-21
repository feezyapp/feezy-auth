import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import RequestHelper from '../utils/requestHelper';

export default () => {
  const router = Router();

  const controller = new AuthController(new AuthService(new RequestHelper()));
  router.route('/login').post((req, res, next) => controller.login(req, res, next));
  router.route('/signup').post((req, res, next) => controller.signup(req, res, next));

  return router;
};
