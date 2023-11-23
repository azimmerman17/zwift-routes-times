'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Zwift_PRs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Zwift_PRs.init({
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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_effort_time: {
      type: DataTypes.INTEGER
    },
    last_effort_date: {
      type: DataTypes.STRING
    },
    pr_time: {
      type: DataTypes.INTEGER
    },
    pr_date: {
      type: DataTypes.STRING
    },
    pr_effort_id: {
      type: DataTypes.INTEGER
    },
    silver_time: {
      type: DataTypes.INTEGER
    },
    silver_date: {
      type: DataTypes.STRING
    },	
    silver_effort_id: {
      type: DataTypes.INTEGER
    },
    bronze_time: {
      type: DataTypes.INTEGER
    },
    bronze_date: {
      type: DataTypes.STRING 
    }, 
    bronze_effort_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Zwift_PRs',
    timestamps: true
  });
  return Zwift_PRs;
};