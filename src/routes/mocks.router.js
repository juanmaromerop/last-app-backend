import { Router } from 'express';
import { generateMockPets } from '../mocks/petMock.js';
import { generateMockUser } from '../mocks/userMock.js';
import usersModel from '../dao/models/User.js';
import petsModel from '../dao/models/Pet.js';

const router = Router();

router.get('/mockingpets', (req, res) => {
  const pets = Array.from({ length: 50 }, generateMockPets);
  res.json(pets);
});

router.get('/mockingusers', async (req, res) => {
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await generateMockUser();
    users.push(user);
  }
  res.json(users);
});

router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = [];
    for (let i = 0; i < users; i++) {
      const user = await generateMockUser();
      mockUsers.push(user);
    }

    const mockPets = Array.from({ length: pets }, generateMockPets);

    const insertedUsers = await usersModel.insertMany(mockUsers);
    const insertedPets = await petsModel.insertMany(mockPets);

    res.status(201).json({
      message: 'Datos insertados con éxito',
      usersInserted: insertedUsers.length,
      petsInserted: insertedPets.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar datos', detail: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await usersModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detail: error.message });
  }
});

router.get('/pets', async (req, res) => {
  try {
    const pets = await petsModel.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascotas', detail: error.message });
  }
});
export default router;
