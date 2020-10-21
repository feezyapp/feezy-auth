import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { UserService } from '../services/UserService';
import RequestHelper from '../utils/requestHelper';

export default () => {
  const router = Router();

  const controller = new UsersController(new UserService(new RequestHelper()));
  router.route('/users').get((req, res, next) => controller.get(req, res, next));

  return router;
};
