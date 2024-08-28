import { Model, DataTypes } from 'sequelize';
import sequelize from '../dbClients/sequelizeClient.js';

export default class Project extends Model {}

Project.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'project',
});
