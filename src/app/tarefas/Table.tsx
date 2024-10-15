import { Paper, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export default async function Table({ children }: { children: ReactNode | ReactElement | ReactNode[] | ReactElement[] }) {
  return (
    <Paper elevation={5} sx={{ marginLeft:"5px", marginRight: "5px"}}>
      <TableContainer sx={{ height: "calc(100vh - 115px)", marginBottom: "5px" }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Cliente</TableCell>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Projeto</TableCell>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Tarefa</TableCell>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Inclusão</TableCell>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Início</TableCell>
              <TableCell style={{ backgroundColor: "black", color: "white" }}>Fim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}
