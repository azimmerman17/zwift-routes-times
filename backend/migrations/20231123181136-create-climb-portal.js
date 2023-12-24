'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Climb_Portal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      strava_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      fr_strava_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      rw_strava_id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
      },
      zi_link: {
        type: Sequelize.STRING,
      },
      climb_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.FLOAT
      },
      elevation: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      avg_grade: {
        type: Sequelize.FLOAT
      }, 
      climb_cat: {
        type: Sequelize.STRING, 
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Climb_Portal');
  }
};