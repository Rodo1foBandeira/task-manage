import { Model } from 'sequelize';

interface BaseAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class BaseModel<T extends Model<T>> extends Model<T> implements BaseAttributes {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}