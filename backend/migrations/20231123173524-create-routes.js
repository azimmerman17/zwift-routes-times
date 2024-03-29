'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      strava_id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      zi_link: {
        type: Sequelize.STRING,
      },    
      world_id: {
        type: Sequelize.INTEGER,
      },
      world_route_id: {
        type: Sequelize.INTEGER,
      },
      route_id: {
        type: Sequelize.INTEGER,
      },
      length: {
        type: Sequelize.FLOAT
      },
      elevation: {
        type: Sequelize.INTEGER,
      },
      restriction: {
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
    await queryInterface.dropTable('Routes');
  }
};