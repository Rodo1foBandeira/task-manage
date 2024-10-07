import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IClienteInstance } from "./cliente";
import { ITarefaInstance } from "./tarefa";

export interface IProjetoProps extends IBaseProps {
  nome: string;
  Cliente?: IClienteInstance;
  Tarefas?: ITarefaInstance[];
}

export interface IProjetoInstance extends IProjetoProps, Model {}

export const projetoModelOptios = {
  nome: DataTypes.STRING,
} as ModelAttributes<IProjetoInstance>;