'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const portal_csv = require('../csv_seeds/climb_portal')
    const csvArray = require('../functions/csvArray')

    const seed = csvArray(portal_csv)

    seed.forEach(record => {
      const { restriction } = record
      if (restriction === '') record.restriction = null

      record.createdAt = new Date()
      record.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('Climb_Portal', seed)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Climb_Portal', null, {});

  }
};
