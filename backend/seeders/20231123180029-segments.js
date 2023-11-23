'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const segment_csv = require('../csv_seeds/segments')
    const csvArray = require('../functions/csvArray')

    const seed = csvArray(segment_csv)

    seed.forEach(record => {
      const { zi_link, ele_gain } = record
      if (zi_link === '') record.zi_link = null
      if (ele_gain === '') record.ele_gain = 0

      record.createdAt = new Date()
      record.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('Segments', seed)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Segments', null, {});
  }
};
