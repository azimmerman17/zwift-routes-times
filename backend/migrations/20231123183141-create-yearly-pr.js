'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Yearly_PRs', {
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
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pr_time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pr_date: {
        type: Sequelize.STRING,
        allowNull: false
      },   
      pr_effort_id: {
        type: Sequelize.BIGINT,
        allowNull: false
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
    await queryInterface.dropTable('Yearly_PRs');

  }
};
