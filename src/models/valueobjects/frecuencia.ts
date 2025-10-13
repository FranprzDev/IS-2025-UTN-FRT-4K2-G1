export abstract class Frecuencia {
  private valor: number;
  private nombre: string;

  protected constructor(nombre: string, valor: number) {
    this.nombre = nombre;
    this.assertValorNoNegativo(valor);
    this.valor = valor;
  }

  public assertValorNoNegativo(valor: number): void {
    if (valor < 0) {
      throw new Error(`La ${this.nombre.toLowerCase()} no puede ser negativa`);
    }
  }
}
