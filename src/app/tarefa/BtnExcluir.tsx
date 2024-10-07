"use client";
import { IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as actionsTarefa from "@/lib/data/actionsTarefa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnExcluir({ tarefaId, nome }: { tarefaId: number; nome?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const excluir = async () => {
    if (confirm(`Excluir ${nome}?`)) {
      await actionsTarefa.excluir(tarefaId);
      alert("Tarefa excluída");
      const params = new URLSearchParams(searchParams);
      params.delete(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Tooltip title="Tarefa">
      <IconButton aria-label="excluir uma tarefa" size="small" onClick={excluir}>
        <DeleteForeverIcon />
      </IconButton>
    </Tooltip>
  );
}
