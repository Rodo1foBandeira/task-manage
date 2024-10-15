"use client";
import { IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as actionsAbstratas from "@/lib/data/actionsAbstratas";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "../ISearchParams";

export default function BtnExcluir({ tarefaId, historicoId, obs }: { tarefaId:number, historicoId: number; obs?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const excluir = async () => {
    if (confirm(`Excluir ${obs}?`)) {
      await actionsAbstratas.excluir4Btn("Historico", historicoId);
      alert("Histórico excluído");
      const params = new URLSearchParams(searchParams);
      params.set(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`, 'true');
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Tooltip title="Historico">
      <IconButton aria-label="excluir um historico" size="small" onClick={excluir}>
        <DeleteForeverIcon />
      </IconButton>
    </Tooltip>
  );
}
