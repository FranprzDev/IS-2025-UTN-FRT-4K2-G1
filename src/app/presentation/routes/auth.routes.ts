import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { crearAuthMiddleware, crearAdminMiddleware } from '../../infrastructure/security/authMiddleware.js';
import { JwtTokenProvider } from '../../infrastructure/security/jwtTokenProvider.js';

export const crearAuthRouter = (authController: AuthController, jwtProvider: JwtTokenProvider): Router => {
  const router = Router();
  const authMiddleware = crearAuthMiddleware(jwtProvider);
  const adminMiddleware = crearAdminMiddleware();

  router.post('/register', authMiddleware, adminMiddleware, (req, res) => authController.registrar(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};
