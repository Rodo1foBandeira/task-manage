import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IClienteInstance } from "./cliente";
import { ITarefaInstance } from "./tarefa";

export interface IProjetoProps extends IBaseProps {
  cliente_id: number;
  Cliente: IClienteInstance;
  Tarefas: ITarefaInstance[];
}

export interface IProjetoCreationProps extends Optional<IProjetoProps, "id" | "createdAt" | "updatedAt" | "Cliente" | "Tarefas"> { }

export interface IProjetoInstance extends Model<IProjetoProps, IProjetoCreationProps>, IProjetoProps { }

export const projetoModelOptions: ModelAttributes<IProjetoInstance, IProjetoCreationProps> = {
  nome: DataTypes.STRING,
  cliente_id: DataTypes.NUMBER,
  usuario_id: DataTypes.NUMBER,
};