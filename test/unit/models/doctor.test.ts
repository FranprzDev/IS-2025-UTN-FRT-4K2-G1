import { describe, it } from "node:test";
import { expect } from "chai";
import { Doctor } from "../../../src/models/doctor.js";
import { Email } from "../../../src/models/valueobjects/email.js";
import { Cuil } from "../../../src/models/valueobjects/cuil.js";

describe("Doctor", () => {
  it("deberia crear doctor con datos validos", () => {
    const cuil: Cuil = new Cuil("20123456789");
    const email: Email = new Email("doctor@example.com");
    const doctor: Doctor = new Doctor(
      cuil,
      "Carlos",
      "García",
      email,
      "MAT12345",
    );

    expect(doctor).to.exist;
    expect(doctor.Cuil.Valor).to.equal("20123456789");
    expect(doctor.Nombre).to.equal("Carlos");
    expect(doctor.Apellido).to.equal("García");
    expect(doctor.Email.Valor).to.equal("doctor@example.com");
    expect(doctor.Matricula).to.equal("MAT12345");
  });
});

