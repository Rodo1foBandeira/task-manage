import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { ITarefaInstance } from "./tarefa";

export interface IHistoricoProps extends IBaseProps {
  observacao: string;
  Tarefa?: ITarefaInstance;
}

export interface IHistoricoInstance extends IHistoricoProps, Model {}

export const historicoModelOptios = {
  observacao: DataTypes.STRING,
} as ModelAttributes<IHistoricoInstance>;