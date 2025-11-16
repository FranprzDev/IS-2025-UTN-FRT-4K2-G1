export interface IRepositorio<T> {
  guardar(entidad: T): void;
  obtenerPorId(id: string): T | null;
  obtenerTodos(): T[];
}

