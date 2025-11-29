import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const crearAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', (req, res) => authController.registrar(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};
