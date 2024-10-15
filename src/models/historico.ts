import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import IBaseProps from "./IBaseProps";
import { ITarefaInstance } from "./tarefa";

export interface IHistoricoProps extends Omit<IBaseProps, "nome"> {
  observacao: string;
  tarefa_id: number;
  Tarefa: ITarefaInstance;
}

export interface IHistoricoCreationProps extends Optional<IHistoricoProps, "id" | "createdAt" | "updatedAt" | "Tarefa"> { }

export interface IHistoricoInstance extends Model<IHistoricoProps, IHistoricoCreationProps>, IHistoricoProps { }

export const historicoModelOptions: ModelAttributes<IHistoricoInstance, IHistoricoCreationProps> = {
  observacao: DataTypes.STRING,
  tarefa_id: DataTypes.NUMBER,
  usuario_id: DataTypes.NUMBER,
};