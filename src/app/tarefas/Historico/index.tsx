import { Collapse, Grid2, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Rows from "./Rows";
import { Suspense } from "react";
import SkeletonRows from "@/components/dataDisplay/Table/SkeletonRows";
import Form from "./Form";

export default async function Index({ tarefaId }: { tarefaId: number }) {
  //   const paramTarefaId = Number(searchParams?.tarefa) || 0;
  //   const open = tarefaId === paramTarefaId;

  return (
    <Collapse in={true}>
      <Grid2 spacing={2} container>
        <Grid2 sx={{ marginTop: 2 }} spacing={2} container size={12}>
          <Grid2 size={1}>
            <Typography variant="h6">Histórico</Typography>
          </Grid2>
          <Grid2 size={11}>
            <Form {...{ tarefaId }} />
          </Grid2>
        </Grid2>
        <Grid2 size={12}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>
                  <Typography variant="subtitle2">Inclusão</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Observação</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Suspense key={tarefaId} fallback={<SkeletonRows colRepeat={2} />}>
                <Rows {...{ tarefaId }} />
              </Suspense>
            </TableBody>
          </Table>
        </Grid2>
      </Grid2>
    </Collapse>
  );
}
