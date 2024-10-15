"use client";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "../ISearchParams";
import * as actionsHistorico from "@/lib/data/actionsHistorico";

export default function BtnEditar({ tarefaId, historicoId }: { tarefaId: number; historicoId: number }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setEditarUmHistorico = async () => {
    const params = new URLSearchParams(searchParams);
    params.set(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`, historicoId.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tooltip title="Historico">
      <IconButton aria-label="editar um historico" size="small" onClick={setEditarUmHistorico}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
