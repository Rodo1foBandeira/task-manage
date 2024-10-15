import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IClienteInstance } from "./cliente";

export interface IUsuarioProps extends Omit<IBaseProps, "usuario_id"> {
  email: string;
  Cliente: IClienteInstance[];
}

export interface IUsuarioCreationProps extends Optional<IUsuarioProps, "id" | "createdAt" | "updatedAt" | "Cliente"> { }

export interface IUsuarioInstance extends Model<IUsuarioProps, IUsuarioCreationProps>, IUsuarioProps { }

export const usuarioModelOptions: ModelAttributes<IUsuarioInstance, IUsuarioCreationProps> = {
  nome: DataTypes.STRING,
  email:  DataTypes.STRING,
};