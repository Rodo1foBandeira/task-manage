import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import mariadb from "mariadb";
import { IProjetoInstance, projetoModelOptios } from "./projeto";
import { clienteModelOptions, IClienteInstance } from "./cliente";
import { ITarefaInstance, TarefaModelOptios } from "./tarefa";
import { HistoricoModelOptios, IHistoricoInstance } from "./historico";
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// import config from "../config/config.json"

const sequelize = new Sequelize("task_manage", "remoto", "1234", {
  dialect: "mariadb",
  dialectModule: mariadb,
  host: "192.168.15.7",
});

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts" && file.indexOf(".test.js") === -1;
//   })
//   .forEach(async (file) => {
//     try {
//       const model = (await import(path.join(__dirname, file))).default(sequelize, DataTypes);
//       sequelize[model.name] = model;
//     } catch (error) {
//       console.error(error);
//     }
//   });

// Object.keys(sequelize).forEach((modelName) => {
//   try {
//     if (sequelize[modelName].associate) {
//       sequelize[modelName].associate(sequelize);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

//db.sequelize = sequelize;
//db.Sequelize = Sequelize;

const _Cliente = sequelize.define<IClienteInstance>("Cliente", clienteModelOptions);
const _Projeto = sequelize.define<IProjetoInstance>("Projeto", projetoModelOptios);
const _Tarefa = sequelize.define<ITarefaInstance>("Tarefa", TarefaModelOptios);
const _Historico = sequelize.define<IHistoricoInstance>("Historico", HistoricoModelOptios);

declare module "sequelize" {
  interface Sequelize {
    Cliente: typeof _Cliente;
    Projeto: typeof _Projeto;
    Tarefa: typeof _Tarefa;
    Historico: typeof _Historico;
  }
}

sequelize.Cliente = _Cliente;
sequelize.Projeto = _Projeto;
sequelize.Tarefa = _Tarefa;
sequelize.Historico = _Historico;

sequelize.Cliente.hasMany(_Projeto, { foreignKey: "cliente_id" });
sequelize.Projeto.belongsTo(_Cliente, { foreignKey: "cliente_id", as: "Cliente" });
sequelize.Projeto.hasMany(_Tarefa, { foreignKey: "projeto_id" });
sequelize.Tarefa.belongsTo(_Projeto, { foreignKey: "projeto_id", as: "Projeto" });
sequelize.Tarefa.hasMany(_Historico, { foreignKey: "tarefa_id" });
sequelize.Historico.belongsTo(_Tarefa, { foreignKey: "tarefa_id" });

export default sequelize;
