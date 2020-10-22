import { UserService } from '../services/UserService';
import { Response, NextFunction } from 'express';
import { Request } from '../models/Request';
import { IUsersListRequest } from '../models/requests/IUsersListRequest';

export class UsersController {
  constructor(protected userService: UserService) {}

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { index, size, all } = req.query;
      const data = await this.userService.get(<IUsersListRequest>{ size, index, all }, req.user);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.update(req.params.id, req.body, req.user);
      return res.status(200).json({ message: 'user details updated!', data: { id: req.params.id, ...data.claims } });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.delete(req.params.id, req.user);
      return res.status(200).json({ message: `User with id (${req.params.id}) deleted successfully!` });
    } catch (error) {
      return next(error);
    }
  }
}
