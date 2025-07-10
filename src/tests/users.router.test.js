import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Users Router Integración', function () {
  this.timeout(10000);

  let createdUserId;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    await mongoose.connection.collection('users').deleteMany({ email: 'integration@test.com' });

    const res = await mongoose.connection.collection('users').insertOne({
      first_name: 'Test',
      last_name: 'Integration',
      email: 'integration@test.com',
      age: 25,
      password: '1234',
      pets: []
    });

    createdUserId = res.insertedId.toString();
  });

  it('GET /api/users debería retornar todos los usuarios', async () => {
    const res = await request.get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.an('array');
  });

  it('GET /api/users/:uid debería retornar el usuario creado', async () => {
    const res = await request.get(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload._id).to.equal(createdUserId);
  });

  it('PUT /api/users/:uid debería actualizar el usuario', async () => {
    const res = await request.put(`/api/users/${createdUserId}`).send({
      age: 26
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User updated');
  });

  it('DELETE /api/users/:uid debería eliminar el usuario', async () => {
    const res = await request.delete(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User deleted');
  });

  after(async () => {
    await mongoose.connection.collection('users').deleteMany({ email: 'integration@test.com' });
    await mongoose.connection.close();
  });
});