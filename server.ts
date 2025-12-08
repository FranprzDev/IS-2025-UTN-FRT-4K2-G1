import express from 'express';
import cors from 'cors';
import { crearUrgenciasRouter } from './src/app/presentation/routes/urgencias.routes.js';
import { crearAuthRouter } from './src/app/presentation/routes/auth.routes.js';
import { crearReclamoRouter } from './src/app/presentation/routes/reclamo.routes.js';
import { crearAtencionRouter } from './src/app/presentation/routes/atencion.routes.js';
import { UrgenciasController } from './src/app/presentation/controllers/urgencias.controller.js';
import { AuthController } from './src/app/presentation/controllers/auth.controller.js';
import { ReclamoController } from './src/app/presentation/controllers/reclamo.controller.js';
import { AtencionController } from './src/app/presentation/controllers/atencion.controller.js';
import { UrgenciaService } from './src/app/service/urgenciaService.js';
import { AuthService } from './src/app/service/authService.js';
import { DBPruebaEnMemoria } from './src/test/mocks/DBPruebaEnMemoria.js';
import { InMemoryRepoUsuarios } from './src/app/infrastructure/persistence/inMemoryRepoUsuarios.js';
import { BcryptPasswordHasher } from './src/app/infrastructure/security/bcryptPasswordHasher.js';
import { JwtTokenProvider } from './src/app/infrastructure/security/jwtTokenProvider.js';
import { Paciente } from './src/models/paciente.js';
import { Cuil } from './src/models/valueobjects/cuil.js';
import { Email } from './src/models/valueobjects/email.js';
import { ObraSocial } from './src/models/obraSocial.js';
import { Afiliado } from './src/models/afiliado.js';
import { Domicilio } from './src/models/domicilio.js';
import { Enfermera } from './src/models/enfermera.js';
import { NivelEmergencia } from './src/models/nivelEmergencia.js';

const app = express();
const puerto = parseInt(process.env.PORT || '3000', 10);
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
const atencionController = new AtencionController(urgenciaService);

app.use('/api/urgencias', crearUrgenciasRouter(urgenciasController));
app.use('/api/auth', crearAuthRouter(authController, jwtProvider));
app.use('/api/reclamo', crearReclamoRouter(reclamoController, jwtProvider));
app.use('/api/atencion', crearAtencionRouter(atencionController, jwtProvider));

const inicializarUsuariosPorDefecto = async (): Promise<void> => {
  try {
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

const inicializarPacientesEnEspera = (): void => {
  if (repoPacientes.obtenerTodos().length > 0) {
    return;
  }

  const enfermera = new Enfermera(
    new Cuil('27123456789'),
    'Ana',
    'Garcia',
    new Email('ana@hospital.com'),
    'ENF1234'
  );

  const obraSocial = new ObraSocial('1', 'OSDE');

  const seeds = [
    { nombre: 'Juan', apellido: 'Perez', cuil: '20-30000000-0', nivel: NivelEmergencia.CRITICA, informe: 'Dolor torácico', temp: 38.5, fc: 110, fr: 24, ps: 150, pd: 95, localidad: 'Cordoba' },
    { nombre: 'Maria', apellido: 'Gomez', cuil: '27-30000001-1', nivel: NivelEmergencia.EMERGENCIA, informe: 'Disnea aguda', temp: 37.9, fc: 105, fr: 22, ps: 140, pd: 90, localidad: 'Cordoba' },
    { nombre: 'Luis', apellido: 'Lopez', cuil: '20-30000002-2', nivel: NivelEmergencia.URGENCIA, informe: 'Fractura expuesta', temp: 37.2, fc: 98, fr: 20, ps: 130, pd: 85, localidad: 'Cordoba' },
    { nombre: 'Ana', apellido: 'Diaz', cuil: '27-30000003-3', nivel: NivelEmergencia.URGENCIA_MENOR, informe: 'Esguince de tobillo', temp: 36.8, fc: 88, fr: 18, ps: 125, pd: 80, localidad: 'Cordoba' },
    { nombre: 'Carlos', apellido: 'Mendez', cuil: '20-30000004-4', nivel: NivelEmergencia.SIN_URGENCIA, informe: 'Control de dolor crónico', temp: 36.6, fc: 76, fr: 16, ps: 120, pd: 78, localidad: 'Cordoba' },
    { nombre: 'Lucia', apellido: 'Romero', cuil: '27-30000005-5', nivel: NivelEmergencia.CRITICA, informe: 'Politraumatismo', temp: 38.9, fc: 118, fr: 26, ps: 155, pd: 100, localidad: 'Cordoba' },
    { nombre: 'Sofia', apellido: 'Martinez', cuil: '27-30000006-6', nivel: NivelEmergencia.EMERGENCIA, informe: 'Accidente vial', temp: 37.5, fc: 102, fr: 23, ps: 142, pd: 92, localidad: 'Cordoba' },
    { nombre: 'Diego', apellido: 'Suarez', cuil: '20-30000007-7', nivel: NivelEmergencia.URGENCIA, informe: 'Corte profundo', temp: 36.9, fc: 94, fr: 19, ps: 128, pd: 82, localidad: 'Cordoba' },
    { nombre: 'Paula', apellido: 'Herrera', cuil: '27-30000008-8', nivel: NivelEmergencia.URGENCIA_MENOR, informe: 'Alergia cutánea', temp: 36.7, fc: 82, fr: 17, ps: 122, pd: 79, localidad: 'Cordoba' },
    { nombre: 'Martin', apellido: 'Vega', cuil: '20-30000009-9', nivel: NivelEmergencia.SIN_URGENCIA, informe: 'Dolor lumbar', temp: 36.5, fc: 78, fr: 16, ps: 118, pd: 76, localidad: 'Cordoba' },
    { nombre: 'Florencia', apellido: 'Castro', cuil: '27-30000010-0', nivel: NivelEmergencia.CRITICA, informe: 'ACV sospechado', temp: 37.8, fc: 108, fr: 22, ps: 148, pd: 94, localidad: 'Cordoba' },
    { nombre: 'Bruno', apellido: 'Aguilar', cuil: '20-30000011-1', nivel: NivelEmergencia.EMERGENCIA, informe: 'Dolor abdominal severo', temp: 38.2, fc: 104, fr: 21, ps: 136, pd: 88, localidad: 'Cordoba' },
    { nombre: 'Valentina', apellido: 'Navarro', cuil: '27-30000012-2', nivel: NivelEmergencia.URGENCIA, informe: 'Luxación de hombro', temp: 37.0, fc: 90, fr: 18, ps: 124, pd: 81, localidad: 'Cordoba' },
    { nombre: 'Gabriel', apellido: 'Benitez', cuil: '20-30000013-3', nivel: NivelEmergencia.URGENCIA_MENOR, informe: 'Cefalea moderada', temp: 36.8, fc: 80, fr: 17, ps: 120, pd: 78, localidad: 'Cordoba' },
    { nombre: 'Camila', apellido: 'Rios', cuil: '27-30000014-4', nivel: NivelEmergencia.SIN_URGENCIA, informe: 'Control rutinario', temp: 36.6, fc: 76, fr: 16, ps: 115, pd: 75, localidad: 'Cordoba' }
  ];

  seeds.forEach((seed, index) => {
    const paciente = new Paciente(
      new Cuil(seed.cuil.replace(/\D/g, '')),
      seed.nombre,
      seed.apellido,
      new Email(`${seed.nombre.toLowerCase()}.${seed.apellido.toLowerCase()}@example.com`),
      new Afiliado(obraSocial, `AFI${3000 + index}`),
      new Domicilio('Calle Falsa', `${100 + index}`, seed.localidad)
    );

    repoPacientes.guardarPaciente(paciente);

    urgenciaService.registrarUrgencia({
      cuil: seed.cuil,
      enfermera,
      informe: seed.informe,
      nivelEmergencia: seed.nivel,
      temperatura: seed.temp,
      frecuenciaCardiaca: seed.fc,
      frecuenciaRespiratoria: seed.fr,
      frecuenciaSistolica: seed.ps,
      frecuenciaDiastolica: seed.pd
    });
  });
};

app.listen(puerto, async () => {
  console.log(`Servidor Express ejecutándose en http://localhost:${puerto}`);
  await inicializarUsuariosPorDefecto();
  inicializarPacientesEnEspera();
});
