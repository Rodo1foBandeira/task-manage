import { DataTypes, Model, ModelAttributes } from "sequelize";
import IBaseProps from "./IBaseProps";
import { IProjetoInstance } from "./projeto";
import { IHistoricoInstance } from "./historico";

export interface ITarefaProps extends IBaseProps {
  nome: string;
  dataIni?: Date;
  dataFim?: Date;
  Projeto?: IProjetoInstance;
  Historico?: IHistoricoInstance[];
}

export interface ITarefaInstance extends ITarefaProps, Model {}

export const TarefaModelOptios = {
  nome: DataTypes.STRING,
  dataIni: DataTypes.DATE,
  dataFim: DataTypes.DATE,
} as ModelAttributes<ITarefaInstance>;