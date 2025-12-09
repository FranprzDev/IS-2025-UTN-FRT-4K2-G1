import { Before } from "@cucumber/cucumber";

export interface MensajesContexto {
  ultimoMensaje: string | null;
  ultimoError: Error | null;
}

export const mensajesContexto: MensajesContexto = {
  ultimoMensaje: null,
  ultimoError: null,
};

Before(() => {
  mensajesContexto.ultimoMensaje = null;
  mensajesContexto.ultimoError = null;
});

