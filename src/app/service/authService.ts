import { randomUUID } from "crypto";
import { Email } from "../../models/valueobjects/email.js";
import { Usuario, Rol } from "../../models/usuario.js";
import { RepoUsuarios } from "../interface/repoUsuarios.js";
import { PasswordHasher } from "../interface/passwordHasher.js";
import { JwtProvider } from "../interface/jwtProvider.js";
import { AuthError } from "./errors/authError.js";
import { InvalidValueError } from "../../models/valueobjects/errors/InvalidValueError.js";

export class AuthService {
  public constructor(
    private readonly repoUsuarios: RepoUsuarios,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtProvider: JwtProvider,
  ) {}

  public async registrarUsuario(
    email: string,
    password: string,
    rol: Rol,
  ): Promise<Usuario> {
    this.validarPassword(password);

    const emailVO: Email = new Email(email);
    const usuarioExistente: Usuario | null =
      await this.repoUsuarios.buscarPorEmail(emailVO);

    if (usuarioExistente) {
      throw new InvalidValueError("Email ya registrado");
    }

    const passwordHash: string = await this.passwordHasher.hash(password);
    const usuario: Usuario = new Usuario(
      randomUUID(),
      emailVO,
      passwordHash,
      rol,
    );

    await this.repoUsuarios.guardar(usuario);
    return usuario;
  }

  public async iniciarSesion(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const emailVO: Email = new Email(email);
    const usuario: Usuario | null =
      await this.repoUsuarios.buscarPorEmail(emailVO);

    if (!usuario) {
      throw new AuthError("Usuario o contraseña inválidos");
    }

    const passwordValido: boolean = await this.passwordHasher.compare(
      password,
      usuario.PasswordHash,
    );

    if (!passwordValido) {
      throw new AuthError("Usuario o contraseña inválidos");
    }

    const token: string = this.jwtProvider.sign({
      sub: usuario.Id,
      email: usuario.Email.Valor,
      rol: usuario.Rol,
    });

    return { token };
  }

  private validarPassword(password: string): void {
    if (!password || password.length < 8) {
      throw new InvalidValueError(
        "La contraseña debe tener al menos 8 caracteres",
      );
    }
  }
}

