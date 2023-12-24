'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Segments', {
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
      zi_link: {
        type: Sequelize.STRING,        
      },
      segment_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      world_id: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.FLOAT
      },
      ele_gain: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      grade: {
        type: Sequelize.FLOAT
      }, 
      type: {
        type: Sequelize.STRING
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Segments');

  }
};
