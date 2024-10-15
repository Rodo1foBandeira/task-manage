import { porTarefa } from "@/lib/data/actionsHistorico";
import { IHistoricoProps } from "@/models/historico";
import { Chip, TableCell, TableRow } from "@mui/material";
import BtnEditar from "./BtnEditar";
import BtnExcluir from "./BtnExcluir";
import { headers } from "next/headers";
import { tarefasExpandidas } from "../utils";
import { ReadonlyURLSearchParams } from "next/navigation";

export default async function Rows({ tarefaId }: { tarefaId: number }) {  

  let historico: IHistoricoProps[] = [];
  if (tarefaId > 0) {
    // console.log(Date())
    // await simulateDelay();
    // console.log(Date())
    historico = await porTarefa(tarefaId);
  }

  const heads = headers();
  const searchParams = new ReadonlyURLSearchParams(heads.get("searchParams") || "");
  const tarefasExpandidasParams = tarefasExpandidas(searchParams);

  return historico.length === 0 ? (
    <TableRow>
      <TableCell rowSpan={2}>Nenhum registro</TableCell>
    </TableRow>
  ) : (
    historico.map((h, index) => (
      <TableRow key={index}>
        <TableCell sx={{width: 100}}>
          <BtnEditar {...{tarefaId}} historicoId={h.id} />
          <BtnExcluir {...{tarefaId}} historicoId={h.id} obs={h.observacao} />
        </TableCell>
        <TableCell>{h.createdAt.toLocaleString()}</TableCell>
        <TableCell>{tarefasExpandidasParams[tarefaId] === h.id ? <Chip label={h.observacao} color="warning" variant="outlined" /> : h.observacao}</TableCell>
      </TableRow>
    ))
  );
}
