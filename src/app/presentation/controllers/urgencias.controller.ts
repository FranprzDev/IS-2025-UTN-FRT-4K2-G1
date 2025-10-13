import { Request, Response } from 'express';
import { UrgenciaService } from '../../service/urgenciaService.js';
import { Enfermera } from '../../../models/enfermera.js';
import { NivelEmergencia, NivelEmergenciaCodigo } from '../../../models/nivelEmergencia.js';
import { Paciente } from '../../../models/paciente.js';
import { RepoPacientes } from '../../interface/repoPacientes.js';

export class UrgenciasController {
  private urgenciaService: UrgenciaService;
  private repoPacientes: RepoPacientes;

  public constructor(urgenciaService: UrgenciaService, repoPacientes: RepoPacientes) {
    this.urgenciaService = urgenciaService;
    this.repoPacientes = repoPacientes;
  }

  public async crearPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, apellido, cuil, obraSocial } = req.body;
      
      const paciente = new Paciente(nombre, apellido, cuil, obraSocial);
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
      const enfermeraObj = new Enfermera(enfermera.nombre, enfermera.apellido);

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
