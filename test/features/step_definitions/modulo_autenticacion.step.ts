import { Before, Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { AuthService } from "../../../src/app/service/authService.js";
import { PasswordHasher } from "../../../src/app/interface/passwordHasher.js";
import { JwtProvider, JwtPayload } from "../../../src/app/interface/jwtProvider.js";
import { InMemoryUsuariosRepo } from "../../mocks/inMemoryUsuariosRepo.js";
import { Rol, Usuario } from "../../../src/models/usuario.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { InvalidValueError } from "../../../src/models/valueobjects/errors/InvalidValueError.js";
import { AuthError } from "../../../src/app/service/errors/authError.js";
import { mensajesContexto } from "./sharedMessages.js";

class FakePasswordHasher implements PasswordHasher {
  public async hash(plainPassword: string): Promise<string> {
    const normalizado: string = plainPassword.trim().toLowerCase();
    return `hash-${normalizado}`;
  }

  public async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const normalizado: string = plainPassword.trim().toLowerCase();
    return hashedPassword === `hash-${normalizado}`;
  }
}

class FakeJwtProvider implements JwtProvider {
  public sign(payload: JwtPayload): string {
    return JSON.stringify(payload);
  }

  public verify(token: string): JwtPayload {
    return JSON.parse(token) as JwtPayload;
  }
}

let repoUsuarios: InMemoryUsuariosRepo;
let passwordHasher: PasswordHasher;
let jwtProvider: JwtProvider;
let authService: AuthService;
let tokenGenerado: string | null;
let ultimoMensaje: string | null;
let errorAuth: Error | null;

const normalizarRol = (valor: string): Rol => {
  const texto: string = valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (texto.startsWith("med")) {
    return Rol.MEDICO;
  }
  if (texto.startsWith("enf")) {
    return Rol.ENFERMERA;
  }
  return Rol.ADMISION;
};

const mapearMensajeError = (
  error: Error,
  operacion: "registro" | "login",
): string => {
  if (error instanceof InvalidValueError) {
    if (error.message === "Email ya registrado") {
      return "Usuario o contraseña inválidos.";
    }
    if (error.message === "El email no tiene un formato válido") {
      return operacion === "registro"
        ? "El Email no respeta el formato Nombre@email.com"
        : "Usuario o contraseña invalidos.";
    }
    if (error.message === "La contraseña debe tener al menos 8 caracteres") {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    return error.message;
  }
  if (error instanceof AuthError) {
    return operacion === "login"
      ? "Usuario o contraseña invalidos."
      : "Usuario o contraseña inválidos.";
  }
  return error.message;
};

const guardarUsuario = async (
  email: string,
  password: string,
  rolTexto?: string,
): Promise<void> => {
  const rol: Rol = rolTexto ? normalizarRol(rolTexto) : Rol.MEDICO;
  const emailVO: Email = new Email(email);
  const passwordHash: string = await passwordHasher.hash(password);
  const usuario: Usuario = new Usuario(
    `${repoUsuarios.obtenerTodos().length + 1}`,
    emailVO,
    passwordHash,
    rol,
  );
  repoUsuarios.guardarEntidad(usuario);
};

const ejecutarRegistro = async (
  email: string,
  password: string,
  rolTexto: string | undefined,
): Promise<void> => {
  ultimoMensaje = null;
  errorAuth = null;
  tokenGenerado = null;

  if (!email || email.trim() === "") {
    ultimoMensaje = "Se debe completar el campo Email.";
    errorAuth = new Error(ultimoMensaje);
  } else if (!password || password.trim() === "") {
    ultimoMensaje = "Se debe completar el campo Contraseña.";
    errorAuth = new Error(ultimoMensaje);
  } else {
    try {
      await authService.registrarUsuario(email, password, normalizarRol(rolTexto || ""));
      ultimoMensaje = "Usuario generado con éxito";
    } catch (error) {
      errorAuth = error as Error;
      ultimoMensaje = mapearMensajeError(errorAuth, "registro");
    }
  }
  mensajesContexto.ultimoMensaje = ultimoMensaje;
  mensajesContexto.ultimoError = errorAuth;
};

Before(() => {
  repoUsuarios = new InMemoryUsuariosRepo();
  passwordHasher = new FakePasswordHasher();
  jwtProvider = new FakeJwtProvider();
  authService = new AuthService(repoUsuarios, passwordHasher, jwtProvider);
  tokenGenerado = null;
  ultimoMensaje = null;
  errorAuth = null;
});

Given("que el usuario no posee un usuario previamente registrado", function () {
  repoUsuarios.limpiar();
  tokenGenerado = null;
  ultimoMensaje = null;
  errorAuth = null;
});

Given(
  "que el siguiente usuario ya se encuentra registrado en el sistema:",
  async function (dataTable) {
    const row = dataTable.hashes()[0];
    const email = row["Email"];
    const password = row["Contraseña"];
    await guardarUsuario(email, password);
  },
);

Given(
  "que los siguientes usuarios se encuentran registrados en el sistema:",
  async function (dataTable) {
    const rows = dataTable.hashes();
    for (const row of rows) {
      await guardarUsuario(row["Email"], row["Contraseña"], row["Rol"]);
    }
  },
);

When("se completa el registro con los siguientes datos:", async function (dataTable) {
  const row = dataTable.hashes()[0];
  await ejecutarRegistro(row["Email"], row["Contraseña"], row["Rol"]);
});

When(
  /^[sS]e intenta registrar el siguiente usuario:/,
  async function (dataTable) {
    const row = dataTable.hashes()[0];
    await ejecutarRegistro(row["Email"], row["Contraseña"], row["Rol"]);
  },
);

When(
  "se intenta iniciar sesion con el siguiente usuario:",
  async function (dataTable) {
    const row = dataTable.hashes()[0];
    const email = row["Email"];
    const password = row["Contraseña"];
    ultimoMensaje = null;
    errorAuth = null;
    tokenGenerado = null;

    try {
      const resultado = await authService.iniciarSesion(email, password);
      tokenGenerado = resultado.token;
      ultimoMensaje = "Sesión iniciada con éxito.";
    } catch (error) {
      errorAuth = error as Error;
      ultimoMensaje = mapearMensajeError(errorAuth, "login");
    }
    mensajesContexto.ultimoMensaje = ultimoMensaje;
    mensajesContexto.ultimoError = errorAuth;
  },
);

Then("redirige al usuario a la página de inicio de sesión.", function () {
  expect(errorAuth).to.be.null;
  expect(ultimoMensaje).to.equal("Usuario generado con éxito");
  mensajesContexto.ultimoMensaje = ultimoMensaje;
  mensajesContexto.ultimoError = errorAuth;
});

Then("permite al usuario acceder al sistema.", function () {
  expect(errorAuth).to.be.null;
  expect(tokenGenerado).to.not.be.null;
  mensajesContexto.ultimoMensaje = ultimoMensaje;
  mensajesContexto.ultimoError = errorAuth;
});

