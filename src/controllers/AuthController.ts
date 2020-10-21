import { AuthService } from '../services/AuthService';
import { Response, NextFunction } from 'express';
import { Request } from '../models/Request';

export class AuthController {
  constructor(protected authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.authService.login(req.body);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.authService.signup(req.body);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
}
