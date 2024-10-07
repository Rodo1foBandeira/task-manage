import sequelize from "../../models";

export default async function Page({ searchParams } : { searchParams?: { a?:number }}) {

  interface ITarefasExpandidas{
    // idTarefa: idHistorico
    [key: number]: number | true;
  }

  const tarefasExpandidas: ITarefasExpandidas = {};

  if (searchParams) {
    Object.keys(searchParams).forEach(key => {
      const match = key.match(/tarsExps\[(\d+)\]/); // Regex para capturar tarsExps[id]
      if (match) {
        const tarefaId = Number(match[1]);
        tarefasExpandidas[tarefaId] = Number((searchParams as any)[key]) || true;
      }
    });
  }
    

  const clientes = await sequelize.Cliente.findAll({
    include: {
      model: sequelize.Projeto, // Inclua o modelo `Projeto`
      as: "Projetos", // O alias da associação precisa estar correto, veja se foi definido com esse alias
    },
  });

  return (
    <ul>
      {clientes.map((c, ci) => (
        <li key={"cli" + ci}>
          Cliente: {c.nome}
          <ul>
            {c.Projetos?.map((p, pi) => (
              <li key={"cli" + pi}>{p.nome}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
