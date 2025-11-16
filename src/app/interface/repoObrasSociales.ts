import { ObraSocial } from "../../models/obraSocial.js";
import { IRepositorio } from "./iRepositorio.js";

export interface RepoObrasSociales extends IRepositorio<ObraSocial> {
  obtenerPorNombre(nombre: string): ObraSocial | null;
  existe(nombre: string): boolean;
}

