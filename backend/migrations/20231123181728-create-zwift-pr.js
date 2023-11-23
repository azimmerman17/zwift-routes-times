'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Zwift_PRs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      strava_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_effort_time: {
        type: Sequelize.INTEGER
      },
      last_effort_date: {
        type: Sequelize.STRING
      },
      pr_time: {
        type: Sequelize.INTEGER
      },
      pr_date: {
        type: Sequelize.STRING
      },
      pr_effort_id: {
        type: Sequelize.BIGINT
      },
      silver_time: {
        type: Sequelize.INTEGER
      },
      silver_date: {
        type: Sequelize.STRING
      },	
      silver_effort_id: {
        type: Sequelize.BIGINT
      },
      bronze_time: {
        type: Sequelize.INTEGER
      },
      bronze_date: {
        type: Sequelize.STRING 
      },
      bronze_effort_id: {
        type: Sequelize.BIGINT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Zwift_PRs');

  }
};
