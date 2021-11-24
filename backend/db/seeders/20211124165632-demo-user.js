'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'DemoUs',
        hashedPassword: bcrypt.hashSync('passwordDemo')
      },
      {
        firstName: 'Kendra',
        lastName: 'Miller',
        email: 'kendramiller@user.io',
        username: 'kchauntell',
        hashedPassword: bcrypt.hashSync('KendraMiller21!')
      },
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['DemoUs', 'kchauntell', 'FakeUser1'] }
    }, {});
  }
};
