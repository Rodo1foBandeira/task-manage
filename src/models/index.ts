import { ModelStatic, Sequelize } from "sequelize";
import { IProjetoCreationProps, IProjetoInstance, projetoModelOptions } from "./projeto";
import { clienteModelOptions, IClienteCreationProps, IClienteInstance } from "./cliente";
import { ITarefaCreationProps, ITarefaInstance, tarefaModelOptions } from "./tarefa";
import { IHistoricoCreationProps, IHistoricoInstance, historicoModelOptions } from "./historico";
import { IUsuarioCreationProps, IUsuarioInstance, usuarioModelOptions } from "./usuario";
import * as pg from 'pg';

// const sequelize = new Sequelize(process.env.DB_TASK_MANAGE, {
//   dialectModule: mariadb,
// });
const _sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessário para conexões SSL
    },
  },
});

const _Usuario = _sequelize.define<IUsuarioInstance, IUsuarioCreationProps>("Usuario", usuarioModelOptions);
const _Cliente = _sequelize.define<IClienteInstance, IClienteCreationProps>("Cliente", clienteModelOptions);
const _Projeto = _sequelize.define<IProjetoInstance, IProjetoCreationProps>("Projeto", projetoModelOptions);
const _Tarefa = _sequelize.define<ITarefaInstance, ITarefaCreationProps>("Tarefa", tarefaModelOptions);
const _Historico = _sequelize.define<IHistoricoInstance, IHistoricoCreationProps>("Historico", historicoModelOptions);

_Usuario.hasMany(    _Cliente, { foreignKey: "usuario_id" });
_Cliente.belongsTo(  _Usuario, { foreignKey: "usuario_id", as: "Usuario" });
_Cliente.hasMany(    _Projeto, { foreignKey: "cliente_id" });
_Projeto.belongsTo(  _Usuario, { foreignKey: "usuario_id", as: "Usuario" });
_Projeto.belongsTo(  _Cliente, { foreignKey: "cliente_id", as: "Cliente" });
_Projeto.hasMany(    _Tarefa, { foreignKey: "projeto_id" });
_Tarefa.belongsTo(   _Usuario, { foreignKey: "usuario_id", as: "Usuario" });
_Tarefa.belongsTo(   _Projeto, { foreignKey: "projeto_id", as: "Projeto" });
_Tarefa.hasMany(     _Historico, { foreignKey: "tarefa_id" });
_Historico.belongsTo(_Usuario, { foreignKey: "usuario_id", as: "Usuario" });
_Historico.belongsTo(_Tarefa, { foreignKey: "tarefa_id", as: "Tarefa" });

const sequelize = {
  models: {
    Usuario: _Usuario,
    Cliente: _Cliente,
    Projeto: _Projeto,
    Tarefa: _Tarefa,
    Historico: _Historico
  },
  transaction: _sequelize.transaction
}

export default sequelize;
