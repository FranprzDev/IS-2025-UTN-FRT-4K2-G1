import { Request, Response } from "express";
import { UrgenciaService } from "../../service/urgenciaService.js";
import { Doctor } from "../../../models/doctor.js";
import { Cuil } from "../../../models/valueobjects/cuil.js";
import { Email } from "../../../models/valueobjects/email.js";
import { JwtPayload } from "../../interface/jwtProvider.js";

export class ReclamoController {
  private urgenciaService: UrgenciaService;

  public constructor(urgenciaService: UrgenciaService) {
    this.urgenciaService = urgenciaService;
  }

  public async reclamarProximoPaciente(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const user = (req as any).user as JwtPayload;

      if (!user || user.rol !== "medico") {
        res
          .status(403)
          .json({ error: "Solo los médicos pueden reclamar pacientes." });
        return;
      }

      const { ingresoCuil, nombre, apellido, cuil, matricula } = req.body;
      const nombreDoctor: string = nombre?.trim() || user.email.split("@")[0] || "medico";
      const apellidoDoctor: string = apellido?.trim() || "Cuenta";
      const cuilDoctor: Cuil = new Cuil(this.normalizarCuil(cuil || "20123456789"));
      const doctorEmail: Email = new Email(user.email);
      const doctor: Doctor = new Doctor(
        cuilDoctor,
        nombreDoctor,
        apellidoDoctor,
        doctorEmail,
        matricula?.trim() || "MAT-DEFAULT",
      );

      const ingresoReclamado = this.urgenciaService.reclamarPaciente(
        doctor,
        ingresoCuil,
      );
      res
        .status(200)
        .json({
          message: "Paciente reclamado exitosamente",
          ingreso: ingresoReclamado.toJSON(),
        });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al reclamar paciente";
      res.status(400).json({ error: errorMessage });
    }
  }

  public async obtenerIngresosDelDoctor(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const user = (req as any).user as JwtPayload;

      if (!user || user.rol !== "medico") {
        res
          .status(403)
          .json({ error: "Solo los médicos pueden ver sus ingresos." });
        return;
      }

      const ingresos = this.urgenciaService.obtenerIngresosDelDoctor(
        user.email,
      );
      res.status(200).json(ingresos.map((ingreso) => ingreso.toJSON()));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener ingresos del médico";
      res.status(400).json({ error: errorMessage });
    }
  }

  private normalizarCuil(valor: string): string {
    return valor.replace(/\D/g, "");
  }
}
