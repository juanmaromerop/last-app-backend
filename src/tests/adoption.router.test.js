import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Adoption Router Integración', function () {
  this.timeout(10000);

  let userId;
  let petId;
  let adoptionId;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const userRes = await mongoose.connection.collection('users').insertOne({
      first_name: 'Adopt',
      last_name: 'Tester',
      email: 'adopt@test.com',
      age: 28,
      password: '1234',
      pets: []
    });
    userId = userRes.insertedId.toString();

    const petRes = await mongoose.connection.collection('pets').insertOne({
      name: 'Pelusa',
      specie: 'gato',
      birthDate: new Date('2021-01-01'),
      adopted: false
    });
    petId = petRes.insertedId.toString();
  });

  it('GET /api/adoptions debería devolver todas las adopciones', async () => {
    const res = await request.get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.an('array');
  });

  it('POST /api/adoptions/:uid/:pid debería adoptar la mascota', async () => {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Pet adopted');

    const adoption = await mongoose.connection.collection('adoptions').findOne({ owner: new mongoose.Types.ObjectId(userId), pet: new mongoose.Types.ObjectId(petId) });
    adoptionId = adoption._id.toString();
  });

  it('POST /api/adoptions/:uid/:pid con mascota ya adoptada debería fallar', async () => {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal('Pet is already adopted');
  });

  it('GET /api/adoptions/:aid debería devolver una adopción por ID', async () => {
    const res = await request.get(`/api/adoptions/${adoptionId}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload._id).to.equal(adoptionId);
  });

  it('GET /api/adoptions/:aid con ID inexistente debería dar 404', async () => {
    const fakeId = '000000000000000000000000';
    const res = await request.get(`/api/adoptions/${fakeId}`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Adoption not found');
  });

  it('POST /api/adoptions/:uid/:pid con UID inválido debería dar error', async () => {
    const res = await request.post(`/api/adoptions/000000000000000000000000/${petId}`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('user Not found');
  });

  it('POST /api/adoptions/:uid/:pid con PID inválido debería dar error', async () => {
    const res = await request.post(`/api/adoptions/${userId}/000000000000000000000000`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Pet not found');
  });

  after(async () => {
    await mongoose.connection.collection('adoptions').deleteMany({ owner: new mongoose.Types.ObjectId(userId) });
    await mongoose.connection.collection('users').deleteMany({ email: 'adopt@test.com' });
    await mongoose.connection.collection('pets').deleteMany({ name: 'Pelusa' });

    await mongoose.connection.close();
  });
});
