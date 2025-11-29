import { Request, Response } from 'express';
import { AuthService } from '../../service/authService.js';
import { Rol } from '../../../models/usuario.js';

export class AuthController {
  private authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rol } = req.body;
      // Default role to ADMISION if not provided or invalid, for simplicity in this demo
      const userRole = rol === 'MEDICO' ? Rol.MEDICO : (rol === 'ENFERMERA' ? Rol.ENFERMERA : Rol.ADMISION);
      
      const usuario = await this.authService.registrarUsuario(email, password, userRole);
      res.status(201).json({ message: 'Usuario registrado exitosamente', id: usuario.Id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ error: errorMessage });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token } = await this.authService.iniciarSesion(email, password);
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(401).json({ error: errorMessage });
    }
  }
}
