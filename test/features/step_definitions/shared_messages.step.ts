import { Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { mensajesContexto } from "./sharedMessages.js";

Then(
  /^[eE]l sistema muestra el siguiente mensaje: "([^"]*)"$/,
  function (mensaje: string) {
    expect(mensajesContexto.ultimoMensaje).to.equal(mensaje);
  },
);

Then(
  /^[eE]l sistema muestra el siguiente mensaje de error: "([^"]*)"\.?$/,
  function (mensaje: string) {
    expect(mensajesContexto.ultimoMensaje).to.equal(mensaje);
    expect(mensajesContexto.ultimoError).to.not.be.null;
  },
);

Then(
  /^El sistema envia el siguiente mensaje de error: "([^"]*)"$/,
  function (mensaje: string) {
    expect(mensajesContexto.ultimoMensaje).to.equal(mensaje);
    expect(mensajesContexto.ultimoError).to.not.be.null;
  },
);

Then(
  /^el sistema muestra el siguiente error: "([^"]*)"$/,
  function (mensaje: string) {
    expect(mensajesContexto.ultimoMensaje).to.equal(mensaje);
    expect(mensajesContexto.ultimoError).to.not.be.null;
  },
);

