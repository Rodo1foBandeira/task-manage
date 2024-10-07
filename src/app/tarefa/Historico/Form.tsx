"use client";
import { Button, CircularProgress, Grid2, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UrlParamsEnum } from "../ISearchParams";
import * as actionsHistorico from "@/lib/data/actionsHistorico";
import { IHistoricoProps } from "@/models/historico";
import { tarefasExpandidas } from "../utils";

export default function Form({ tarefaId }: { tarefaId: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  interface IOption {
    id?: number;
    observacao: string;
  }

  const [obs, setObs] = useState<IOption>({ id: undefined, observacao: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSetHistorico = async () => {
      const tarefasExpandidasParams = tarefasExpandidas(searchParams);
      if (tarefasExpandidasParams[tarefaId] !== true && tarefasExpandidasParams[tarefaId] > 0) {
        setLoading(true);
        const historico = await actionsHistorico.get(tarefasExpandidasParams[tarefaId])
        setObs({ id: historico.id, observacao: historico.observacao });
        setLoading(false);
      } else {
        setObs({ id: undefined, observacao: "" });
      }
    };
    fetchSetHistorico();
  }, [searchParams]);

  const desabilitaCancelar = () => {
    return !(obs.id || obs.observacao);
  };

  const limparCancelar = () => {
    setObs({ id: undefined, observacao: "" });
    const params = new URLSearchParams(searchParams);
    params.set(`${UrlParamsEnum.TarefasExpandidas}[${tarefaId}]`, 'true');
    replace(`${pathname}?${params.toString()}`);
  };

  const desabilitaEnvio = () => {
    return !obs.observacao;
  };

  const handleAction = async () => {
    const form = new FormData();
    form.append("historico.observacao", obs.observacao);
    form.append("historico.tarefaId", tarefaId.toString());
    if (obs.id) form.append("historico.id", obs.id.toString());

    await actionsHistorico.criar(form);
    limparCancelar();
  };

  return (
    <form action={handleAction}>
      <Grid2 container spacing={2}>
        <Grid2 size={1} sx={{ width: "31px" }}>{loading && <CircularProgress size={30} />}</Grid2>
        <Grid2 size={{ lg: 7, md: 6 }}>
          <TextField fullWidth size="small" value={obs.observacao} onChange={(e) => setObs((t) => ({ ...t, observacao: e.target.value }))} label="Observação" />
        </Grid2>
        <Grid2 size={{ lg: 3, md: 4 }}>
          <IconButton sx={{ marginRight: 2 }} color="error" disabled={desabilitaCancelar()} onClick={limparCancelar}>
            <ClearIcon />
          </IconButton>
          <Button variant="contained" disabled={desabilitaEnvio()} type="submit">
            {obs.id ? "Salvar" : "Criar"}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}
