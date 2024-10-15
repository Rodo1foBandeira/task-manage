//import React, { useState } from "react";
import { clientesComProjetosComTarefas } from "@/lib/data/actionsCliente";
import Rows from "./Rows";
import Table from "./Table";
import Form from "./Form";
import { Grid2, Typography } from "@mui/material";
import { Suspense } from "react";
import SkeletonRows from "@/components/dataDisplay/Table/SkeletonRows";

// Componente principal da tabela
export default async function Page() {  
  return (
    <Grid2 container direction="column" spacing={2}>
      <Grid2>
        <Typography variant="h5">Tarefas</Typography>
      </Grid2>
      <Grid2 size={12}>
        <Form />
      </Grid2>
      <Grid2>
        <Table>
          <Suspense fallback={<SkeletonRows colRepeat={6} rowRepeat={5} />}>
            <Rows />
          </Suspense>          
        </Table>
      </Grid2>
    </Grid2>
  );
}
