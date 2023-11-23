'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Routes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Routes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    route_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zi_link: {
      type: DataTypes.STRING,
    },  
    world_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    world_route_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    strava_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    length: {
      type: DataTypes.NUMBER
    },
    elevation: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    restriction: {
      type: DataTypes.STRING, 
    },  
  }, {
    sequelize,
    modelName: 'Routes',
    timestamps: true
  });
  return Routes;
};