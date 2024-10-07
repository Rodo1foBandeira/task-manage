"use client";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { UrlParamsEnum } from "./ISearchParams";
import { tarefasExpandidas } from "./utils";

export default function BtnExpandir({ tarefaId }: { tarefaId: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const tarefasExpandidasParams = tarefasExpandidas(searchParams)

  const setParamTarefaId = async () => {
    if (tarefasExpandidasParams[tarefaId]) {
        params.delete(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`);
    } else {
      params.set(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`, 'true');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tooltip title="Histórico">
      <IconButton aria-label="expand row" size="small" onClick={setParamTarefaId}>
        {tarefasExpandidasParams[tarefaId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Tooltip>
  );
}
