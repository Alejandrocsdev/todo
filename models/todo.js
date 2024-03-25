'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {}
  }
  Todo.init(
    {
      name: DataTypes.STRING,
      isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Todo'
    }
  )
  return Todo
}
