'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const route_csv = require('./routes')
    const csvArray = require('../functions/csvArray')

    const seed = csvArray(route_csv)
    seed.forEach(record => {
      const { restriction } = record
      if (restriction === '') record.restriction = null
      record.createdAt = new Date()
      record.updatedAt = new Date()
      
    })

    return queryInterface.bulkInsert('Routes', seed)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Routes', null, {});
     
  }
};
