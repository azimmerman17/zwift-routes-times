'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Yearly_PRs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Yearly_PRs.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    strava_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pr_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pr_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pr_effort_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Yearly_PRs',
    timestamps: true
  });
  return Yearly_PRs;
};