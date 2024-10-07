import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IProjetoInstance } from "./projeto";

export interface IClienteProps extends IBaseProps{
  nome: string;
  Projetos?: IProjetoInstance[];
}

export interface IClienteInstance extends IClienteProps, Model {}

export const clienteModelOptions = {
  nome: DataTypes.STRING,
} as ModelAttributes<IClienteInstance>;