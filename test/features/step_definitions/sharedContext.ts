import { Before } from "@cucumber/cucumber";
import { Doctor } from "../../../src/models/doctor.js";
import { UrgenciaService } from "../../../src/app/service/urgenciaService.js";
import { DBPruebaEnMemoria } from "../../../src/test/mocks/DBPruebaEnMemoria.js";

export interface EscenarioMedicoContexto {
  doctor: Doctor | null;
  db: DBPruebaEnMemoria | null;
  servicioUrgencias: UrgenciaService | null;
}

export const escenarioMedicoContexto: EscenarioMedicoContexto = {
  doctor: null,
  db: null,
  servicioUrgencias: null,
};

Before(() => {
  escenarioMedicoContexto.doctor = null;
  escenarioMedicoContexto.db = null;
  escenarioMedicoContexto.servicioUrgencias = null;
});

