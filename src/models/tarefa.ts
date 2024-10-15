import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IProjetoInstance } from "./projeto";
import { IHistoricoInstance } from "./historico";

export interface ITarefaProps extends IBaseProps {
  dataIni?: Date;
  dataFim?: Date;
  projeto_id: number;
  Projeto: IProjetoInstance;
  Historico: IHistoricoInstance[];
}

export interface ITarefaCreationProps extends Optional<ITarefaProps, "id" | "createdAt" | "updatedAt" | "Projeto" | "Historico"> { }

export interface ITarefaInstance extends Model<ITarefaProps, ITarefaCreationProps>, ITarefaProps { }

export const tarefaModelOptions: ModelAttributes<ITarefaInstance, ITarefaCreationProps> = {
  nome: DataTypes.STRING,
  dataIni: DataTypes.DATE,
  dataFim: DataTypes.DATE,
  projeto_id: DataTypes.NUMBER,
  usuario_id: DataTypes.NUMBER,
} as ModelAttributes<ITarefaInstance>;