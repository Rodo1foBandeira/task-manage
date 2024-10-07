"use client";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnEditar({ tarefaId }: { tarefaId: number }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setEditarTarefa = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(UrlParamsEnum.CriarTarefaPorPrj);
    params.delete(UrlParamsEnum.EditarCliente);
    params.delete(UrlParamsEnum.EditarProjeto);
    params.set(UrlParamsEnum.EditarTarefa, tarefaId.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tooltip title="Tarefa">
      <IconButton aria-label="editar tarefa" size="small" onClick={setEditarTarefa}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
