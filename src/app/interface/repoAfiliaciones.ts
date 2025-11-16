import { IRepositorio } from "./iRepositorio.js";

export interface Afiliacion {
  cuil: string;
  nombreObraSocial: string;
  numeroAfiliado: string;
}

export interface RepoAfiliaciones extends IRepositorio<Afiliacion> {
  estaAfiliado(cuil: string, nombreObraSocial: string, numeroAfiliado: string): boolean;
}

