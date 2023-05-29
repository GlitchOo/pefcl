import 'reflect-metadata';
import { DataTypes } from '@sequelize/core';

export const timestamps = {
  createdAt: {
    type: DataTypes.DATE,
    get() {
      return new Date(this.getDataValue('createdAt') ?? '').getTime();
    },
  },
};
