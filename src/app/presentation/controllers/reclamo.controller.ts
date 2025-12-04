import { Request, Response } from 'express';
import { UrgenciaService } from '../../service/urgenciaService.js';
import { Doctor } from '../../../models/doctor.js';
import { Cuil } from '../../../models/valueobjects/cuil.js';
import { Email } from '../../../models/valueobjects/email.js';
import { JwtPayload } from '../../interface/jwtProvider.js';

export class ReclamoController {
  private urgenciaService: UrgenciaService;

  public constructor(urgenciaService: UrgenciaService) {
    this.urgenciaService = urgenciaService;
  }

  public async reclamarProximoPaciente(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user as JwtPayload;
      
      if (!user || user.rol !== 'medico') {
        res.status(403).json({ error: 'Solo los médicos pueden reclamar pacientes.' });
        return;
      }

      const { nombre, apellido, cuil, matricula } = req.body;

      if (!cuil || !nombre || !apellido || !matricula) {
        res.status(400).json({ error: 'Faltan datos del doctor para reclamar un paciente.' });
        return;
      }

      const doctorCuil = new Cuil(cuil.replace(/\D/g, ''));
      const doctorEmail = new Email(user.email);
      const doctor = new Doctor(doctorCuil, nombre, apellido, doctorEmail, matricula);

      const ingresoReclamado = this.urgenciaService.reclamarProximoPaciente(doctor);
      res.status(200).json({ message: 'Paciente reclamado exitosamente', ingreso: ingresoReclamado });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al reclamar paciente';
      res.status(400).json({ error: errorMessage });
    }
  }
}
