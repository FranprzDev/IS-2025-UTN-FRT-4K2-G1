import { describe, it } from "node:test";
import { expect } from "chai";
import { BcryptPasswordHasher } from "../../../src/app/service/bcryptPasswordHasher.js";

describe("BcryptPasswordHasher", () => {
  it("deberia hashear una contraseña", async () => {
    const hasher: BcryptPasswordHasher = new BcryptPasswordHasher();
    const password: string = "password123";
    const hash: string = await hasher.hash(password);

    expect(hash).to.exist;
    expect(hash).to.not.equal(password);
    expect(hash.length).to.be.greaterThan(0);
  });

  it("deberia comparar correctamente una contraseña con su hash", async () => {
    const hasher: BcryptPasswordHasher = new BcryptPasswordHasher();
    const password: string = "password123";
    const hash: string = await hasher.hash(password);

    const resultado: boolean = await hasher.compare(password, hash);
    expect(resultado).to.be.true;
  });

  it("deberia retornar false cuando la contraseña no coincide", async () => {
    const hasher: BcryptPasswordHasher = new BcryptPasswordHasher();
    const password: string = "password123";
    const hash: string = await hasher.hash(password);

    const resultado: boolean = await hasher.compare("wrongpassword", hash);
    expect(resultado).to.be.false;
  });
});

