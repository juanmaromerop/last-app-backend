import { fakerES as faker } from '@faker-js/faker';

export const generateMockPets = () => ({
  name: faker.animal.dog(), 
  specie: faker.animal.type(), 
  birthDate: faker.date.past({ years: 5 }),
  adopted: faker.datatype.boolean()
});
