import dotenv from 'dotenv';
dotenv.config();

import { expect } from "chai";
import mongoose from "mongoose";
import { adoptionsService, petsService, usersService } from "../services/index.js";

describe("Adoptions Service – Unit", function () {
  this.timeout(10000);

  let testUser;
  let testPet;
  let createdAdoption;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    await mongoose.connection.collection("users").deleteMany({ email: "test.user@example.com" });

    testUser = await usersService.create({
      first_name: "Test",
      last_name: "User",
      email: "test.user@example.com",
      age: 30,
      password: "123456"
    });

    testPet = await petsService.create({
      name: "Firulais",
      specie: "perro",
      age: 3,
      adopted: false
    });

    createdAdoption = await adoptionsService.create({
      owner: testUser._id,
      pet: testPet._id
    });
  });

  it("debería retornar todas las adopciones en un array", async () => {
    const adoptions = await adoptionsService.getAll();
    expect(adoptions).to.be.an("array");
    expect(adoptions.length).to.be.greaterThan(0);
  });

  it("debería retornar una adopción por su ID", async () => {
    const adoption = await adoptionsService.getBy({ _id: createdAdoption._id });
    expect(adoption).to.be.an("object");
    expect(adoption._id.toString()).to.equal(createdAdoption._id.toString());
  });

  it("debería crear una nueva adopción correctamente", async () => {
    const anotherAdoption = await adoptionsService.create({
      owner: testUser._id,
      pet: testPet._id,
    });

    expect(anotherAdoption).to.have.property("_id");
    expect(anotherAdoption.owner.toString()).to.equal(testUser._id.toString());
    expect(anotherAdoption.pet.toString()).to.equal(testPet._id.toString());

    await adoptionsService.delete(anotherAdoption._id);
  });

  it("debería actualizar la adopción (mock field)", async () => {
    const result = await adoptionsService.update(createdAdoption._id, {
      note: "Adopción verificada"
    });

    expect(result).to.exist;
  });

  it("debería eliminar una adopción", async () => {
    const adoptionToDelete = await adoptionsService.create({
      owner: testUser._id,
      pet: testPet._id,
    });

    const deletion = await adoptionsService.delete(adoptionToDelete._id);
    expect(deletion).to.exist;

    const check = await adoptionsService.getBy({ _id: adoptionToDelete._id });
    expect(check).to.be.null;
  });

  after(async () => {
    if (createdAdoption) await adoptionsService.delete(createdAdoption._id);
    if (testPet) await petsService.delete(testPet._id);
    if (testUser) await usersService.delete(testUser._id);
    await mongoose.connection.close();
  });
});