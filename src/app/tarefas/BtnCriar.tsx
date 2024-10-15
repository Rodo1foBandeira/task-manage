"use client";

import { IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnCriar({ projetoId }: { projetoId: number }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setParamsNovaTarefa = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(UrlParamsEnum.EditarCliente);
    params.delete(UrlParamsEnum.EditarProjeto);
    params.delete(UrlParamsEnum.EditarTarefa);
    params.set(UrlParamsEnum.CriarTarefaPorPrj, projetoId.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tooltip title="Tarefa">
      <IconButton aria-label="nova tarefa" size="small" onClick={setParamsNovaTarefa}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Tooltip>
  );
}
