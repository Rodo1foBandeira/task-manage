"use client";

import { FocusEvent, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { IProjetoProps } from "@/models/projeto";
import * as actionsCliente from "@/lib/data/actionsCliente";
import * as actionsProjeto from "@/lib/data/actionsProjeto";
import * as actionsTarefa from "@/lib/data/actionsTarefa";
import { Autocomplete, Button, CircularProgress, Grid2, IconButton, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ISearchParams, UrlParamsEnum } from "./ISearchParams";
import { objToURLSearchParams } from "@/lib/utils";
import { isEqual } from "lodash";

export default function Form() {
  interface IOption {
    id?: number;
    nome: string;
  }
  const [clientes, setClientes] = useState<IOption[]>([]);
  const [projetos, setProjetos] = useState<IOption[]>([]);
  const [tarefa, setTarefa] = useState<IOption>({ id: undefined, nome: "" });
  const [projeto, setProjeto] = useState<IOption>({ id: undefined, nome: "" });
  const [cliente, setCliente] = useState<IOption>({ id: undefined, nome: "" });
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const urlParams: ISearchParams["searchParams"] = {
    criarTarefaPorPrj: Number(params.get(UrlParamsEnum.CriarTarefaPorPrj)),
    editarTarefa: Number(params.get(UrlParamsEnum.EditarTarefa)),
    editarProjeto: Number(params.get(UrlParamsEnum.EditarProjeto)),
    editarCliente: Number(params.get(UrlParamsEnum.EditarCliente)),
  };

  const [previousParams, setPreviousParams] = useState<ISearchParams["searchParams"]>({});

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      setLoading(true);
  
      if (urlParams.criarTarefaPorPrj) {
        // Para criar tarefa com cliente e projeto selecionado
        // deve bloquear autocomplete de cliente e projeto
        const projeto = (await actionsProjeto.comCliente(urlParams.criarTarefaPorPrj)) as IProjetoProps;
        setProjetos([projeto as IOption]);
        setProjeto(projeto as IOption);
        setClientes([projeto.Cliente as IOption]);
        setCliente(projeto.Cliente as IOption);
      } else if (urlParams.editarTarefa) {
        // Para editar tarefa
        // deve buscar a tarefa com projeto e cliente
        // deve bloquear autocomplete de cliente e projeto
        const _tarefa = await actionsTarefa.comProjetoComCliente(urlParams.editarTarefa);
        setClientes([_tarefa?.Projeto?.Cliente as IOption]);
        setCliente(_tarefa?.Projeto?.Cliente as IOption);
        setProjetos([_tarefa?.Projeto as IOption]);
        setProjeto(_tarefa?.Projeto as IOption);
        setTarefa(_tarefa as IOption);
      } else if (urlParams.editarProjeto) {
        // Lógica para editar projeto
      } else if (urlParams.editarCliente) {
        // Lógica para editar cliente
      } else {
        setClientes(await actionsCliente.todos());
      }
      setLoading(false);
    };

    const verificaESetaDados = async () => {
      if (!isEqual(urlParams, previousParams)) {
        await fetchData();
        //setPreviousParams(urlParams);
      }
    };
    fetchData();
  }, [urlParams.criarTarefaPorPrj, urlParams.editarCliente, urlParams.editarProjeto, urlParams.editarTarefa]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, value: IOption | string | null, setVar: (v: IOption) => void) => {
    if (typeof value === "object" && value !== null) {
      setVar({ id: value.id, nome: value.nome });
    } else {
      setVar({ id: undefined, nome: "" });
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>, setVar: (v: IOption) => void, estado: IOption) => {
    if (e.target.value !== estado.nome) {
      setVar({ id: undefined, nome: e.target.value });
    }
  };

  const desabilitaAutocomplete = () => {
    if (urlParams.criarTarefaPorPrj && urlParams.criarTarefaPorPrj > 0) {
      // Para criar tarefa com cliente e projeto selecionado
      // deve bloquear autocomplete de cliente e projeto
      return true;
    }
    if (urlParams.editarTarefa && urlParams.editarTarefa > 0) {
      // Para editar tarefa
      // deve buscar a tarefa com projeto e cliente
      // deve bloquear autocomplete de cliente e projeto
      return true;
    }
    return false;
  };

  const desabilitaEnvio = () => {
    if (!cliente.id && cliente.nome.length === 0) return true;
    if (!projeto.id && projeto.nome.length === 0) return true;
    if (tarefa.nome.length === 0) return true;
    return false;
  };

  const fetchSetProjetosPorCliente = async (clienteId: number) => {
    setLoading(true);
    const projetos = await actionsProjeto.porCliente(clienteId);
    setProjetos(projetos as IOption[]);
    setLoading(false);
  };
  useEffect(() => {
    if (cliente.id) {
      fetchSetProjetosPorCliente(cliente.id);
    } else {
      setProjeto({ id: undefined, nome: ""})
      setProjetos([]);
    }
  }, [cliente]);

  const resetForm = () => {
    setCliente({ id: undefined, nome: "" });
    setProjetos([]);
    setProjeto({ id: undefined, nome: "" });
    setTarefa({ id: undefined, nome: "" });
  };

  const handleAction = async () => {
    const form = new FormData();
    form.append("tarefa.nome", tarefa.nome);
    if (tarefa.id) form.append("tarefa.id", tarefa.id?.toString());
    else {
      if (projeto.id) form.append("projeto.id", projeto.id?.toString());
      else form.append("projeto.nome", projeto.nome);
      if (cliente.id) form.append("cliente.id", cliente.id?.toString());
      else form.append("cliente.nome", cliente.nome);
    }
    await actionsTarefa.criar(form);
    limparCancelar();
    //router.push("/tarefa")
  };

  const desabilitaCancelar = () => {
    return !(cliente.id || cliente.nome || projeto.id || projeto.nome || tarefa.id || tarefa.nome);
  };

  const limparCancelar = () => {
    resetForm();
    params.delete(UrlParamsEnum.CriarTarefaPorPrj);
    params.delete(UrlParamsEnum.EditarTarefa);
    params.delete(UrlParamsEnum.EditarCliente);
    params.delete(UrlParamsEnum.EditarProjeto);
    replace(`${pathname}?${params.toString()}`);
  };

  const labelEnvio = () => (urlParams?.editarCliente || urlParams?.editarProjeto || urlParams?.editarTarefa)
    ? "Salvar" : "Criar";

  const autocompleteLabel = (option: IOption, entidade: string, ) => option.id ? `${entidade} selecionado` : `Novo ${entidade}`;

  return (
    <form action={handleAction}>
      <Grid2 container spacing={2}>
        <Grid2 sx={{ width: "31px" }}>{loading && <CircularProgress size={30} />}</Grid2>
        <Grid2 size={2}>
          <Autocomplete
            freeSolo
            size="small"
            value={cliente}
            options={clientes}
            getOptionLabel={(option: IOption | string) => {
              if (typeof option === "string") {
                return option; // Para suportar digitação livre
              }
              return option.nome; // Para suportar opções de objetos
            }}
            renderInput={(params) => <TextField {...params} label={autocompleteLabel(cliente, "Cliente")} />}
            onChange={(e, v) => handleChange(e, v, setCliente)}
            onBlur={(e) => handleBlur(e as FocusEvent<HTMLInputElement>, setCliente, cliente)}
            disabled={desabilitaAutocomplete()}
          />
        </Grid2>
        <Grid2 size={2}>
          <Autocomplete
            freeSolo
            size="small"
            value={projeto}
            options={projetos}
            getOptionLabel={(option: IOption | string) => {
              if (typeof option === "string") {
                return option; // Para suportar digitação livre
              }
              return option.nome; // Para suportar opções de objetos
            }}
            renderInput={(params) => <TextField {...params} label={autocompleteLabel(projeto, "Projeto")} />}
            onChange={(e, v) => handleChange(e, v, setProjeto)}
            onBlur={(e) => handleBlur(e as FocusEvent<HTMLInputElement>, setProjeto, projeto)}
            disabled={desabilitaAutocomplete()}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField fullWidth size="small" value={tarefa.nome} onChange={(e) => setTarefa((t) => ({ ...t, nome: e.target.value }))} label={(tarefa.id ? "Editar " : "Nova ") + "Tarefa"} />
        </Grid2>
        <Grid2 size={4}>
          <IconButton sx={{ marginRight: 2 }} color="error" disabled={desabilitaCancelar()} onClick={limparCancelar}>
            <ClearIcon />
          </IconButton>
          <Button variant="contained" disabled={desabilitaEnvio()} type="submit">
           {labelEnvio()}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}
