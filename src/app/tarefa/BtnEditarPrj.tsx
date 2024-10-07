"use client";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";

export default function BtnEditarPrj({ prjId }: { prjId: number }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setEditarPrj = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(UrlParamsEnum.CriarTarefaPorPrj);
    params.delete(UrlParamsEnum.EditarCliente);
    params.delete(UrlParamsEnum.EditarTarefa);
    params.set(UrlParamsEnum.EditarProjeto, prjId.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tooltip title="Projeto">
      <IconButton aria-label="editar projeto" size="small" onClick={setEditarPrj}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}
