import { Model, DataTypes } from 'sequelize';
import sequelize from '../dbClients/sequelizeClient.js';

export default class User extends Model {}

User.init({
  lastname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  firstname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  code_color: {
    type: DataTypes.TEXT(7),
    allowNull: false,
    defaultValue: '#FFFFFF',
  },
}, {
  sequelize,
  tableName: 'user',
});
