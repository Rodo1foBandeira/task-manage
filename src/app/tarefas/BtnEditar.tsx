"use client";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnEditar({ id, entidade }: { id: number, entidade: "Cliente" | "Projeto" | "Tarefa" }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const entidades: Record<string, string> = {
    Cliente: UrlParamsEnum.EditarCliente,
    Projeto: UrlParamsEnum.EditarProjeto,
    Tarefa: UrlParamsEnum.EditarTarefa
  }

  const setEditar = () => {    
    params.delete(UrlParamsEnum.CriarTarefaPorPrj);
    params.delete(UrlParamsEnum.EditarCliente);
    params.delete(UrlParamsEnum.EditarProjeto);
    params.delete(UrlParamsEnum.EditarTarefa);
    params.set(entidades[entidade], id.toString())
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tooltip title={entidade}>
      <IconButton size="small" onClick={setEditar}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
