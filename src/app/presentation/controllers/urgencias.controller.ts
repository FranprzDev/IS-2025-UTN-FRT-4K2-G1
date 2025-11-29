import { Request, Response } from 'express';
import { UrgenciaService } from '../../service/urgenciaService.js';
import { Enfermera } from '../../../models/enfermera.js';
import { NivelEmergencia, NivelEmergenciaCodigo } from '../../../models/nivelEmergencia.js';
import { Paciente } from '../../../models/paciente.js';
import { RepoPacientes } from '../../interface/repoPacientes.js';
import { Cuil } from '../../../models/valueobjects/cuil.js';
import { Email } from '../../../models/valueobjects/email.js';
import { Afiliado } from '../../../models/afiliado.js';
import { ObraSocial } from '../../../models/obraSocial.js';
import { Domicilio } from '../../../models/domicilio.js';

export class UrgenciasController {
  private urgenciaService: UrgenciaService;
  private repoPacientes: RepoPacientes;

  public constructor(urgenciaService: UrgenciaService, repoPacientes: RepoPacientes) {
    this.urgenciaService = urgenciaService;
    this.repoPacientes = repoPacientes;
  }

    public async crearPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, apellido, cuil, obraSocial, email, numeroAfiliado, calle, numero, localidad } = req.body;
      
      const cuilSanitized = cuil.replace(/\D/g, '');
      const cuilObj: Cuil = new Cuil(cuilSanitized);
      const emailObj: Email = new Email(email || `${nombre.toLowerCase()}.${apellido.toLowerCase()}@example.com`);
      const obraSocialObj: ObraSocial = new ObraSocial("1", obraSocial);
      const afiliado: Afiliado = new Afiliado(obraSocialObj, numeroAfiliado || "00000000");
      const domicilio: Domicilio = new Domicilio(
        calle || "Sin especificar",
        numero || "0",
        localidad || "San Miguel de Tucumán"
      );
      
      const paciente: Paciente = new Paciente(cuilObj, nombre, apellido, emailObj, afiliado, domicilio);
      this.repoPacientes.guardarPaciente(paciente);
      
      res.status(201).json({ message: 'Paciente creado exitosamente', paciente });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ error: errorMessage });
    }
  }

  public async registrarUrgencia(req: Request, res: Response): Promise<void> {
    try {
      const {
        cuil,
        enfermera,
        informe,
        nivelEmergencia,
        temperatura,
        frecuenciaCardiaca,
        frecuenciaRespiratoria,
        frecuenciaSistolica,
        frecuenciaDiastolica
      } = req.body;

      const nivelEmergenciaObj = this.obtenerNivelEmergencia(nivelEmergencia);
      const cuilEnfermeraSanitized = (enfermera.cuil || "27123456789").replace(/\D/g, '');
      const cuilEnfermera: Cuil = new Cuil(cuilEnfermeraSanitized);
      const emailEnfermera: Email = new Email(enfermera.email || `${enfermera.nombre.toLowerCase()}.${enfermera.apellido.toLowerCase()}@example.com`);
      const enfermeraObj: Enfermera = new Enfermera(
        cuilEnfermera,
        enfermera.nombre,
        enfermera.apellido,
        emailEnfermera,
        enfermera.matricula || "ENF00000"
      );

      this.urgenciaService.registrarUrgencia({
        cuil,
        enfermera: enfermeraObj,
        informe,
        nivelEmergencia: nivelEmergenciaObj,
        temperatura,
        frecuenciaCardiaca,
        frecuenciaRespiratoria,
        frecuenciaSistolica,
        frecuenciaDiastolica
      });

      res.status(201).json({ message: 'Urgencia registrada exitosamente' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ error: errorMessage });
    }
  }

  public async obtenerListaEspera(req: Request, res: Response): Promise<void> {
    try {
      const ingresosPendientes = this.urgenciaService.obtenerIngresosPendientes();
      res.status(200).json(ingresosPendientes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: errorMessage });
    }
  }

  private obtenerNivelEmergencia(nivel: string): NivelEmergencia {
    const niveles = [
      NivelEmergencia.CRITICA,
      NivelEmergencia.EMERGENCIA,
      NivelEmergencia.URGENCIA,
      NivelEmergencia.URGENCIA_MENOR,
      NivelEmergencia.SIN_URGENCIA
    ];

    const nivelEncontrado = niveles.find(n => n.descripcion === nivel);
    if (!nivelEncontrado) {
      throw new Error(`Nivel de emergencia '${nivel}' no válido`);
    }
    return nivelEncontrado;
  }
}
