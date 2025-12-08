import { Router } from "express";
import { AtencionController } from "../controllers/atencion.controller.js";
import { JwtTokenProvider } from "../../infrastructure/security/jwtTokenProvider.js";
import { crearAuthMiddleware } from "../../infrastructure/security/authMiddleware.js";

export const crearAtencionRouter = (
  atencionController: AtencionController,
  jwtProvider: JwtTokenProvider,
): Router => {
  const router = Router();
  const authMiddleware = crearAuthMiddleware(jwtProvider);

  router.post("/registrar", authMiddleware, (req, res) => {
    atencionController.registrarAtencion(req, res);
  });

  return router;
};

