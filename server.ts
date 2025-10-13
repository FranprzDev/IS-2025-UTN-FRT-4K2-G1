import express from 'express';
import cors from 'cors';
import { crearUrgenciasRouter } from './src/app/presentation/routes/urgencias.routes.js';
import { UrgenciasController } from './src/app/presentation/controllers/urgencias.controller.js';
import { UrgenciaService } from './src/app/service/urgenciaService.js';
import { DBPruebaEnMemoria } from './src/test/mocks/DBPruebaEnMemoria.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const repoPacientes = new DBPruebaEnMemoria();
const urgenciaService = new UrgenciaService(repoPacientes);
const urgenciasController = new UrgenciasController(urgenciaService, repoPacientes);

app.use('/api/urgencias', crearUrgenciasRouter(urgenciasController));

app.listen(port, () => {
  console.log(`Servidor Express ejecutándose en http://localhost:${port}`);
});
