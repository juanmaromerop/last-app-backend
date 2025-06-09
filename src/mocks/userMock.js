import { fakerES as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const generateMockUser = async () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: await hashPassword('coder123'),
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: []
  };
};
