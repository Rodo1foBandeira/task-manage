import { Chip, TableCell, TableRow } from "@mui/material";
import Historico from "./Historico";
import BtnExpandir from "./BtnExpandir";
import BtnCriar from "./BtnCriar";
import BtnEditar from "./BtnEditar";
import { IClienteProps } from "@/models/cliente";
import { ITarefaProps } from "@/models/tarefa";
import { ISearchParams } from "./ISearchParams";
import BtnExcluir from "./BtnExcluir";
import BtnEditarPrj from "./BtnEditarPrj";
import BtnEditarCliente from "./BtnEditarCliente";

export default async function Row({
  cliente,
  tarefa,
  projetoIndex,
  tarefaIndex,
  searchParams,
}: {
  cliente: IClienteProps;
  tarefa: ITarefaProps;
  projetoIndex: number;
  tarefaIndex: number;
  searchParams?: ISearchParams["searchParams"];
}) {
  // const expandirTarefa = () => {
  //   const tarefasSelecionadas: number[] = searchParams?.expandirTarefas ? searchParams?.expandirTarefas?.split("e").map(Number) : [];
  //   return tarefasSelecionadas.includes(tarefa.id);
  // };
  return (
    <>
      <TableRow key={"tarefa-" + tarefa.id}>
        {/* x 2 pq row da tarefa e row do historico */}
        {projetoIndex === 0 && tarefaIndex === 0 && (
          <TableCell rowSpan={(cliente.Projetos?.reduce((acc, p) => acc + (p.Tarefas?.length || 0), 0) || 0) * 2}>
            {searchParams?.editarCliente === cliente.id ? <Chip label={cliente.nome} color="warning" variant="outlined" /> : cliente.nome}
            <BtnEditarCliente clienteId={cliente.id} />
          </TableCell>
        )}
        {/* x 2 pq row da tarefa e row do historico */}
        {tarefaIndex === 0 && (
          <TableCell rowSpan={(cliente.Projetos?.[projetoIndex].Tarefas?.length || 0) * 2}>
            {searchParams?.editarProjeto === cliente.Projetos?.[projetoIndex]?.id ? (
              <Chip label={cliente.Projetos?.[projetoIndex].nome} color="warning" variant="outlined" />
            ) : (
              cliente.Projetos?.[projetoIndex].nome
            )}
            <BtnEditarPrj prjId={tarefa.Projeto?.id as number} />
            <BtnCriar projetoId={cliente.Projetos?.[projetoIndex].id as number} />
          </TableCell>
        )}
        <TableCell>
          <BtnExpandir tarefaId={tarefa.id} />
          <BtnEditar tarefaId={tarefa.id} />
          <BtnExcluir tarefaId={tarefa.id} nome={tarefa.nome} />
          {Number(searchParams?.editarTarefa) === tarefa.id ? <Chip label={tarefa.nome} color="warning" variant="outlined" /> : tarefa.nome}
        </TableCell>
        <TableCell>{tarefa.createdAt.toLocaleString()}</TableCell>
        <TableCell>{tarefa.dataIni?.toLocaleString()}</TableCell>
        <TableCell>{tarefa.dataFim?.toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: "5em" }} colSpan={5}>
          {searchParams?.tarsExps?.[tarefa.id] && <Historico tarefaId={tarefa.id} />}
        </TableCell>
      </TableRow>
    </>
  );
}
