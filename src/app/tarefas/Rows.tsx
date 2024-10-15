import { Chip, TableCell, TableRow } from "@mui/material";
import Historico from "./Historico";
import BtnExpandir from "./BtnExpandir";
import BtnCriar from "./BtnCriar";
import BtnEditar from "./BtnEditar";
import { ISearchParams } from "./ISearchParams";
import BtnExcluir from "./BtnExcluir";
import { headers } from "next/headers";
import { urlSearchParamsToObj } from "@/lib/utils";
import { clientesComProjetosComTarefas } from "@/lib/data/actionsCliente";
import { Fragment } from "react";

export default async function Rows() {
  const _headers = headers();
  const searchParams = urlSearchParamsToObj<ISearchParams>(_headers.get("searchParams") || "");

  const clientes = await clientesComProjetosComTarefas();

  return clientes.map((cliente) =>
    cliente.Projetos?.map((projeto, projetoIndex) =>
      projeto.Tarefas?.map((tarefa, tarefaIndex) => (
        <Fragment key={"frag-" + tarefaIndex}>
          <TableRow key={"tarefa-" + tarefaIndex}>
            {/* x 2 pq row da tarefa e row do historico */}
            {projetoIndex === 0 && tarefaIndex === 0 && (
              <TableCell rowSpan={(cliente.Projetos.reduce((acc, p) => acc + (p.Tarefas.length || 0), 0) || 0) * 2}>
                {searchParams.editarCliente == cliente.id ? <Chip label={cliente.nome} color="warning" variant="outlined" /> : cliente.nome}
                <BtnEditar id={cliente.id} entidade="Cliente" />
                <BtnExcluir id={cliente.id} nome={cliente.nome} entidade="Cliente" />
              </TableCell>
            )}
            {/* x 2 pq row da tarefa e row do historico */}
            {tarefaIndex === 0 && (
              <TableCell rowSpan={(projeto.Tarefas.length || 0) * 2}>
                {searchParams.editarProjeto == projeto.id ? <Chip label={projeto.nome} color="warning" variant="outlined" /> : projeto.nome}
                <BtnEditar id={projeto.id} entidade="Projeto" />
                <BtnExcluir id={projeto.id} nome={projeto.nome} entidade="Projeto" />
                <BtnCriar projetoId={projeto.id} />
              </TableCell>
            )}
            <TableCell>
              <BtnExpandir tarefaId={tarefa.id} />
              <BtnEditar id={tarefa.id} entidade="Tarefa" />
              <BtnExcluir id={tarefa.id} nome={tarefa.nome} entidade="Tarefa" />
              {searchParams.editarTarefa == tarefa.id ? <Chip label={tarefa.nome} color="warning" variant="outlined" /> : tarefa.nome}
            </TableCell>
            <TableCell>{tarefa.createdAt.toLocaleString()}</TableCell>
            <TableCell>{tarefa.dataIni?.toLocaleString()}</TableCell>
            <TableCell>{tarefa.dataFim?.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: "5em" }} colSpan={5}>
              {searchParams.tarsExps?.[tarefa.id] && <Historico tarefaId={tarefa.id} />}
            </TableCell>
          </TableRow>
        </Fragment>
      ))
    )
  );
}
