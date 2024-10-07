//import React, { useState } from "react";
import { clientesComProjetosComTarefas } from "@/lib/data/actionsCliente";
import Row from "./Row";
import Table from "./Table";
import Form from "./Form";
import { Grid2, Typography } from "@mui/material";
import { ISearchParams } from "./ISearchParams";
import { tarefasExpandidas } from "./utils";

// Componente principal da tabela
export default async function Page({ searchParams }: ISearchParams) {
  const clientes = await clientesComProjetosComTarefas();
  if (searchParams){
    searchParams.tarsExps = tarefasExpandidas(searchParams);
  }
  return (
    <Grid2 container direction="column" spacing={2}>
      <Grid2>
        <Typography variant="h5">Tarefas</Typography>
      </Grid2>
      <Grid2>
        <Form />
      </Grid2>
      <Grid2>
        <Table>
          {clientes.map((cliente) =>
            cliente.Projetos?.map((projeto, projetoIndex) =>
              projeto.Tarefas?.map((tarefa, tarefaIndex) => <Row key={tarefaIndex} {...{ cliente, tarefa, projetoIndex, tarefaIndex, searchParams }} />)
            )
          )}
        </Table>
      </Grid2>
    </Grid2>
  );
}
