import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IProjetoInstance } from "./projeto";
import { IUsuarioInstance } from "./usuario";

export interface IClienteProps extends IBaseProps{
  nome: string;
  Projetos?: IProjetoInstance[];
  Usuario?: IUsuarioInstance;
}

export interface IClienteInstance extends IClienteProps, Model {}

export const clienteModelOptions = {
  nome: DataTypes.STRING,
} as ModelAttributes<IClienteInstance>;