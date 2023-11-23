'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const zwift_prs_csv = require('../csv_seeds/zwift_prs')
    const csvArray = require('../functions/csvArray')

    const seed = csvArray(zwift_prs_csv)

    seed.forEach(record => {
      record.count = undefined
      record.created_at = new Date()
      record.updated_at = new Date()
    })
    
    return queryInterface.bulkInsert('Zwift_PRs', seed)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Zwift_PRs', null, {});

  }
};
