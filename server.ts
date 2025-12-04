import express from 'express';
import cors from 'cors';
import { crearUrgenciasRouter } from './src/app/presentation/routes/urgencias.routes.js';
import { crearAuthRouter } from './src/app/presentation/routes/auth.routes.js';
import { crearReclamoRouter } from './src/app/presentation/routes/reclamo.routes.js';
import { UrgenciasController } from './src/app/presentation/controllers/urgencias.controller.js';
import { AuthController } from './src/app/presentation/controllers/auth.controller.js';
import { ReclamoController } from './src/app/presentation/controllers/reclamo.controller.js';
import { UrgenciaService } from './src/app/service/urgenciaService.js';
import { AuthService } from './src/app/service/authService.js';
import { DBPruebaEnMemoria } from './src/test/mocks/DBPruebaEnMemoria.js';
import { InMemoryRepoUsuarios } from './src/app/infrastructure/persistence/inMemoryRepoUsuarios.js';
import { BcryptPasswordHasher } from './src/app/infrastructure/security/bcryptPasswordHasher.js';
import { JwtTokenProvider } from './src/app/infrastructure/security/jwtTokenProvider.js';
import { createServer } from 'http';

const app = express();
const puertoInicial = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

app.use(cors());
app.use(express.json());

const repoPacientes = new DBPruebaEnMemoria();
const repoUsuarios = new InMemoryRepoUsuarios();
const passwordHasher = new BcryptPasswordHasher();
const jwtProvider = new JwtTokenProvider(JWT_SECRET);

const urgenciaService = new UrgenciaService(repoPacientes);
const authService = new AuthService(repoUsuarios, passwordHasher, jwtProvider);

const urgenciasController = new UrgenciasController(urgenciaService, repoPacientes);
const authController = new AuthController(authService);
const reclamoController = new ReclamoController(urgenciaService);

app.use('/api/urgencias', crearUrgenciasRouter(urgenciasController));
app.use('/api/auth', crearAuthRouter(authController, jwtProvider));
app.use('/api/reclamo', crearReclamoRouter(reclamoController, jwtProvider));

const inicializarUsuariosPorDefecto = async (): Promise<void> => {
  try {
    const { Email } = await import('./src/models/valueobjects/email.js');
    const { Rol } = await import('./src/models/usuario.js');
    
    const emailAdmin = new Email('admin@test.com');
    const usuarioAdminExistente = await repoUsuarios.buscarPorEmail(emailAdmin);
    if (!usuarioAdminExistente) {
      await authService.registrarUsuario('admin@test.com', 'password123456', Rol.ADMISION);
      console.log('Usuario administrativo creado: admin@test.com / password123456');
    }
    
    const emailMedico = new Email('medico@test.com');
    const usuarioMedicoExistente = await repoUsuarios.buscarPorEmail(emailMedico);
    if (!usuarioMedicoExistente) {
      await authService.registrarUsuario('medico@test.com', 'password123456', Rol.MEDICO);
      console.log('Usuario médico creado: medico@test.com / password123456');
    }
    
    const emailEnfermera = new Email('enfermera@test.com');
    const usuarioEnfermeraExistente = await repoUsuarios.buscarPorEmail(emailEnfermera);
    if (!usuarioEnfermeraExistente) {
      await authService.registrarUsuario('enfermera@test.com', 'password123456', Rol.ENFERMERA);
      console.log('Usuario enfermera creado: enfermera@test.com / password123456');
    }
  } catch (error) {
    console.error('Error al inicializar usuarios por defecto:', error);
  }
};

const encontrarPuertoDisponible = async (puertoInicial: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const intentarPuerto = (puerto: number): void => {
      const server = createServer();
      
      server.listen(puerto, () => {
        server.close(() => {
          resolve(puerto);
        });
      });
      
      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          intentarPuerto(puerto + 1);
        } else {
          reject(error);
        }
      });
    };
    
    intentarPuerto(puertoInicial);
  });
};

const iniciarServidor = async (): Promise<void> => {
  const puerto = await encontrarPuertoDisponible(puertoInicial);
  
  app.listen(puerto, async () => {
    console.log(`Servidor Express ejecutándose en http://localhost:${puerto}`);
    await inicializarUsuariosPorDefecto();
  });
};

iniciarServidor().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
