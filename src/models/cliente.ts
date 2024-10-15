import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IProjetoInstance } from "./projeto";
import { IUsuarioInstance } from "./usuario";

export interface IClienteProps extends IBaseProps{  
  Projetos: IProjetoInstance[];
  Usuario: IUsuarioInstance;
}

export interface IClienteCreationProps extends Optional<IClienteProps, "id" | "createdAt" | "updatedAt" | "Projetos" | "Usuario"> { }

export interface IClienteInstance extends Model<IClienteProps, IClienteCreationProps>, IClienteProps { }

export const clienteModelOptions: ModelAttributes<IClienteInstance, IClienteCreationProps> = {
  nome: DataTypes.STRING,
  usuario_id: DataTypes.NUMBER,
};