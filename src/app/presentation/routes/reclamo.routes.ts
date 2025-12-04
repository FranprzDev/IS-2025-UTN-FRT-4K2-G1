import { Router } from 'express';
import { ReclamoController } from '../controllers/reclamo.controller.js';
import { crearAuthMiddleware } from '../../infrastructure/security/authMiddleware.js';
import { JwtTokenProvider } from '../../infrastructure/security/jwtTokenProvider.js';

export const crearReclamoRouter = (reclamoController: ReclamoController, jwtProvider: JwtTokenProvider): Router => {
  const router = Router();
  const authMiddleware = crearAuthMiddleware(jwtProvider);

  router.post('/reclamar', authMiddleware, (req, res) => {
    reclamoController.reclamarProximoPaciente(req, res);
  });

  return router;
};



