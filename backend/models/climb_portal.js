'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Climb_Portal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Climb_Portal.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    strava_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    fr_strava_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rw_strava_id: {
      type: DataTypes.INTEGER, 
    },
    zi_link: {
      type: DataTypes.STRING,
    },
    climb_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
    },
    length: {
      type: DataTypes.NUMBER
    },
    elevation: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avg_grade: {
      type: DataTypes.NUMBER
    }, 
    climb_cat: {
      type: DataTypes.STRING, 
    }, 
  }, {
    sequelize,
    modelName: 'Climb_Portal',
    timestamps: true
  });
  return Climb_Portal;
};