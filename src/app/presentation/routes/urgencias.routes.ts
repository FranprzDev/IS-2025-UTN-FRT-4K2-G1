import { Router } from 'express';
import { UrgenciasController } from '../controllers/urgencias.controller.js';

export const crearUrgenciasRouter = (urgenciasController: UrgenciasController): Router => {
  const router = Router();

  router.post('/crear-paciente', (req, res) => {
    urgenciasController.crearPaciente(req, res);
  });

  router.post('/registrar', (req, res) => {
    urgenciasController.registrarUrgencia(req, res);
  });

  router.get('/lista-espera', (req, res) => {
    urgenciasController.obtenerListaEspera(req, res);
  });

  router.get('/pacientes', (req, res) => {
    urgenciasController.obtenerTodosLosPacientes(req, res);
  });

  return router;
};
