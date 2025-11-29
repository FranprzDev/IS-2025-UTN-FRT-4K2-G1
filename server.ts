import express from 'express';
import cors from 'cors';
import { crearUrgenciasRouter } from './src/app/presentation/routes/urgencias.routes.js';
import { crearAuthRouter } from './src/app/presentation/routes/auth.routes.js';
import { UrgenciasController } from './src/app/presentation/controllers/urgencias.controller.js';
import { AuthController } from './src/app/presentation/controllers/auth.controller.js';
import { UrgenciaService } from './src/app/service/urgenciaService.js';
import { AuthService } from './src/app/service/authService.js';
import { DBPruebaEnMemoria } from './src/test/mocks/DBPruebaEnMemoria.js';
import { InMemoryRepoUsuarios } from './src/app/infrastructure/persistence/inMemoryRepoUsuarios.js';
import { BcryptPasswordHasher } from './src/app/infrastructure/security/bcryptPasswordHasher.js';
import { JwtTokenProvider } from './src/app/infrastructure/security/jwtTokenProvider.js';

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

app.use(cors());
app.use(express.json());

// Repositories & Infrastructure
const repoPacientes = new DBPruebaEnMemoria();
const repoUsuarios = new InMemoryRepoUsuarios();
const passwordHasher = new BcryptPasswordHasher();
const jwtProvider = new JwtTokenProvider(JWT_SECRET);

// Services
const urgenciaService = new UrgenciaService(repoPacientes);
const authService = new AuthService(repoUsuarios, passwordHasher, jwtProvider);

// Controllers
const urgenciasController = new UrgenciasController(urgenciaService, repoPacientes);
const authController = new AuthController(authService);

app.use('/api/urgencias', crearUrgenciasRouter(urgenciasController));
app.use('/api/auth', crearAuthRouter(authController));

app.listen(port, () => {
  console.log(`Servidor Express ejecutándose en http://localhost:${port}`);
});
