import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IClienteInstance } from "./cliente";

export interface IUsuarioProps extends IBaseProps {
  nome: string;
  email: string;
  Cliente?: IClienteInstance[];
}

export interface IUsuarioInstance extends IUsuarioProps, Model {}

export const usuarioModelOptios = {
  nome: DataTypes.STRING,
  email:  DataTypes.STRING,
} as ModelAttributes<IUsuarioInstance>;