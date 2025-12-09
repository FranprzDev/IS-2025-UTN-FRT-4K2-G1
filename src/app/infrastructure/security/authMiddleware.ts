import { Request, Response, NextFunction } from 'express';
import { JwtTokenProvider } from './jwtTokenProvider.js';
import { JwtPayload } from '../../interface/jwtProvider.js';

export const crearAuthMiddleware = (jwtProvider: JwtTokenProvider) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token de autenticación requerido' });
        return;
      }

      const token = authHeader.substring(7);
      const payload: JwtPayload = jwtProvider.verify(token);
      
      (req as any).user = payload;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
};

export const crearAdminMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as JwtPayload;
    
    if (!user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (user.rol !== 'administrativo') {
      res.status(403).json({ error: 'Acceso denegado. Solo usuarios administrativos pueden realizar esta acción' });
      return;
    }

    next();
  };
};








