import { Sequelize } from "sequelize";
//import mariadb from "mariadb";
import { IProjetoInstance, projetoModelOptios } from "./projeto";
import { clienteModelOptions, IClienteInstance } from "./cliente";
import { ITarefaInstance, tarefaModelOptios } from "./tarefa";
import { historicoModelOptios, IHistoricoInstance } from "./historico";
import { IUsuarioInstance, usuarioModelOptios } from "./usuario";

// const sequelize = new Sequelize(process.env.DB_TASK_MANAGE, {
//   dialectModule: mariadb,
// });
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessário para conexões SSL
    },
  },
});

const _Usuario = sequelize.define<IUsuarioInstance>("Usuario", usuarioModelOptios);
const _Cliente = sequelize.define<IClienteInstance>("Cliente", clienteModelOptions);
const _Projeto = sequelize.define<IProjetoInstance>("Projeto", projetoModelOptios);
const _Tarefa = sequelize.define<ITarefaInstance>("Tarefa", tarefaModelOptios);
const _Historico = sequelize.define<IHistoricoInstance>("Historico", historicoModelOptios);

declare module "sequelize" {
  interface Sequelize {
    Usuario: typeof _Usuario;
    Cliente: typeof _Cliente;
    Projeto: typeof _Projeto;
    Tarefa: typeof _Tarefa;
    Historico: typeof _Historico;
  }
}

sequelize.Usuario = _Usuario;
sequelize.Cliente = _Cliente;
sequelize.Projeto = _Projeto;
sequelize.Tarefa = _Tarefa;
sequelize.Historico = _Historico;

sequelize.Usuario.hasMany(_Cliente, { foreignKey: "usuario_id" });
sequelize.Cliente.belongsTo(_Usuario, { foreignKey: "usuario_id", as: "Usuario" });
sequelize.Cliente.hasMany(_Projeto, { foreignKey: "cliente_id" });
sequelize.Projeto.belongsTo(_Usuario, { foreignKey: "usuario_id", as: "Usuario" });
sequelize.Projeto.belongsTo(_Cliente, { foreignKey: "cliente_id", as: "Cliente" });
sequelize.Projeto.hasMany(_Tarefa, { foreignKey: "projeto_id" });
sequelize.Tarefa.belongsTo(_Usuario, { foreignKey: "usuario_id", as: "Usuario" });
sequelize.Tarefa.belongsTo(_Projeto, { foreignKey: "projeto_id", as: "Projeto" });
sequelize.Tarefa.hasMany(_Historico, { foreignKey: "tarefa_id" });
sequelize.Historico.belongsTo(_Usuario, { foreignKey: "usuario_id", as: "Usuario" });
sequelize.Historico.belongsTo(_Tarefa, { foreignKey: "tarefa_id", as: "Tarefa" });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

testConnection();

export default sequelize;
