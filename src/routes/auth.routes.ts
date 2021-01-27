import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';

export default () => {
  const router = Router();

  const controller = new AuthController(new AuthService());
  router.route('/login').post((req, res, next) => controller.login(req, res, next));
  router.route('/signup').post((req, res, next) => controller.signup(req, res, next));

  return router;
};
