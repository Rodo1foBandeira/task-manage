"use client";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnEditarCliente({ clienteId }: { clienteId: number }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setEditarCliente = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(UrlParamsEnum.CriarTarefaPorPrj);
    params.delete(UrlParamsEnum.EditarTarefa);
    params.delete(UrlParamsEnum.EditarProjeto);
    params.set(UrlParamsEnum.EditarCliente, clienteId.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tooltip title="Cliente">
      <IconButton aria-label="editar cliente" size="small" onClick={setEditarCliente}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
