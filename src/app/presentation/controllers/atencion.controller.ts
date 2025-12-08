import { Request, Response } from "express";
import { UrgenciaService } from "../../service/urgenciaService.js";
import { JwtPayload } from "../../interface/jwtProvider.js";
import { Doctor } from "../../../models/doctor.js";
import { Cuil } from "../../../models/valueobjects/cuil.js";
import { Email } from "../../../models/valueobjects/email.js";

export class AtencionController {
  private urgenciaService: UrgenciaService;

  public constructor(urgenciaService: UrgenciaService) {
    this.urgenciaService = urgenciaService;
  }

  public async registrarAtencion(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user as JwtPayload;

      if (!user || user.rol !== "medico") {
        res
          .status(403)
          .json({ error: "Solo los médicos pueden registrar atenciones." });
        return;
      }

      const { ingresoCuil, informe, nombre, apellido, cuil, matricula } =
        req.body;

      if (!ingresoCuil || ingresoCuil.trim() === "") {
        res.status(400).json({ error: "Se debe indicar el CUIL del ingreso." });
        return;
      }

      const nombreDoctor: string =
        nombre?.trim() || user.email.split("@")[0] || "medico";
      const apellidoDoctor: string = apellido?.trim() || "Cuenta";
      const cuilDoctor: Cuil = new Cuil(
        (cuil || "20123456789").replace(/\D/g, ""),
      );
      const emailDoctor: Email = new Email(user.email);

      const doctor: Doctor = new Doctor(
        cuilDoctor,
        nombreDoctor,
        apellidoDoctor,
        emailDoctor,
        matricula?.trim() || "MAT-DEFAULT",
      );

      const atencion = this.urgenciaService.registrarAtencion(
        doctor,
        ingresoCuil,
        informe,
      );

      res.status(201).json({
        message: "Atención registrada exitosamente",
        atencion: atencion.toJSON(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al registrar la atención";
      res.status(400).json({ error: errorMessage });
    }
  }
}


