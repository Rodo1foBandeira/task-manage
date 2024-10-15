"use client";

import { FocusEvent, FormEvent, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { IProjetoProps } from "@/models/projeto";
import * as actionsCliente from "@/lib/data/actionsCliente";
import * as actionsProjeto from "@/lib/data/actionsProjeto";
import * as actionsTarefa from "@/lib/data/actionsTarefa";
import { Autocomplete, Button, CircularProgress, Grid2, IconButton, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ISearchParams, UrlParamsEnum } from "./ISearchParams";
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
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const urlParams: ISearchParams = {
    criarTarefaPorPrj: Number(params.get(UrlParamsEnum.CriarTarefaPorPrj)),
    editarTarefa: Number(params.get(UrlParamsEnum.EditarTarefa)),
    editarProjeto: Number(params.get(UrlParamsEnum.EditarProjeto)),
    editarCliente: Number(params.get(UrlParamsEnum.EditarCliente)),
  };

  const [previousParams, setPreviousParams] = useState<ISearchParams>({});

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      setLoading(true);
  
      if (urlParams.criarTarefaPorPrj) {
        // Para criar tarefa com cliente e projeto selecionado
        // deve bloquear autocomplete de cliente e projeto
        const _projeto = (await actionsProjeto.comCliente(urlParams.criarTarefaPorPrj)) as IProjetoProps;
        setProjetos([_projeto as IOption]);
        setProjeto(_projeto as IOption);
        setClientes([_projeto.Cliente as IOption]);
        setCliente(_projeto.Cliente as IOption);
      } else if (urlParams.editarTarefa) {
        // Para editar tarefa
        // deve buscar a tarefa com projeto e cliente
        // deve bloquear autocomplete de cliente e projeto
        const _tarefa = await actionsTarefa.comProjetoComCliente(urlParams.editarTarefa);
        if (_tarefa){
          setClientes([_tarefa.Projeto?.Cliente as IOption]);
          setCliente(_tarefa.Projeto?.Cliente as IOption);
          setProjetos([_tarefa.Projeto as IOption]);
          setProjeto(_tarefa.Projeto as IOption);
          setTarefa(_tarefa as IOption);
        }        
      } else if (urlParams.editarProjeto) {
        const _prj = await actionsProjeto.get(urlParams.editarProjeto);
        setProjetos([_prj as IOption]);
        setProjeto(_prj as IOption);
        setTarefa({ nome: "" });
        setClientes([]);
        setCliente({ nome: "" });
      } else if (urlParams.editarCliente) {
        const _cli = await actionsCliente.get(urlParams.editarCliente);
        setClientes([_cli as IOption]);
        setCliente(_cli as IOption);
        setTarefa({ nome: "" });
        setProjetos([]);
        setProjeto({ nome: "" });
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

  const desabilitaCampoCliente = () => {
    if (urlParams.editarProjeto) return true;
    if (urlParams.criarTarefaPorPrj) return true;
    if (urlParams.editarTarefa) return true;
    return false;
  };

  const desabilitaCampoProjeto = () => {
    if (urlParams.editarCliente) return true;
    if (urlParams.criarTarefaPorPrj) return true;
    if (urlParams.editarTarefa) return true;
    return false;
  };

  const desabilitaCampoTarefa = () => {
    if (urlParams.editarCliente) return true;
    if (urlParams.editarProjeto) return true;
    return false;
  };

  const desabilitaEnvio = () => {
    if (urlParams.editarCliente){
      if (!cliente.id && cliente.nome.length === 0) return true;
    } else if (urlParams.editarProjeto) {
      if (!projeto.id && projeto.nome.length === 0) return true;
    } else {
      // Se não estou editando cliente nem prj então estou editando ou criando tarefa
      if (!cliente.id && cliente.nome.length === 0) return true;
      if (!projeto.id && projeto.nome.length === 0) return true;
      if (tarefa.nome.length === 0) return true;
    }    
    return false;
  };

  const fetchSetProjetosPorCliente = async (clienteId: number) => {
    setLoading(true);
    const projetos = await actionsProjeto.porCliente(clienteId);
    setProjetos(projetos as IOption[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!(urlParams.criarTarefaPorPrj || urlParams.editarCliente || urlParams.editarProjeto || urlParams.editarTarefa)){
      if (cliente.id) {
        fetchSetProjetosPorCliente(cliente.id);
      } else {
        setProjeto({ id: undefined, nome: ""})
        setProjetos([]);
      }
    }    
  }, [cliente, urlParams.criarTarefaPorPrj, urlParams.editarCliente, urlParams.editarProjeto, urlParams.editarTarefa]);

  const resetForm = async () => {
    setCliente({ id: undefined, nome: "" });
    setProjetos([]);
    setProjeto({ id: undefined, nome: "" });
    setTarefa({ id: undefined, nome: "" });
    setClientes(await actionsCliente.todos());
  };

  const handleAction = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);
    await actionsTarefa.criar({
      tarefa,
      cliente,
      projeto
    });
    limparCancelar();
    setLoading(false);
    // push("/tarefas")
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

  interface IEntidade {
    option: IOption;
    editando?: number;
  }

  const entidades: Record<string, IEntidade> = {
    Cliente: {
      option: cliente,
      editando: urlParams.editarCliente
    },
    Projeto: {
      option: projeto,
      editando: urlParams.editarProjeto
    }
  }

  const autocompleteLabel = (entidade: "Cliente" | "Projeto"): string => entidades[entidade].editando ? `Editar ${entidade}` : entidades[entidade].option.id ? `${entidade} selecionado` : `Novo ${entidade}`;

  return (
    <form onSubmit={handleAction}>
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
            renderInput={(params) => <TextField {...params} label={autocompleteLabel("Cliente")} />}
            onChange={(e, v) => handleChange(e, v, setCliente)}
            onBlur={(e) => handleBlur(e as FocusEvent<HTMLInputElement>, setCliente, cliente)}
            disabled={desabilitaCampoCliente()}
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
            renderInput={(params) => <TextField {...params} label={autocompleteLabel("Projeto")} />}
            onChange={(e, v) => handleChange(e, v, setProjeto)}
            onBlur={(e) => handleBlur(e as FocusEvent<HTMLInputElement>, setProjeto, projeto)}
            disabled={desabilitaCampoProjeto()}
          />
        </Grid2>
        <Grid2 size={5}>
          <TextField disabled={desabilitaCampoTarefa()} fullWidth size="small" value={tarefa.nome} onChange={(e) => setTarefa((t) => ({ ...t, nome: e.target.value }))} label={(tarefa.id ? "Editar" : "Nova") + " Tarefa"} />
        </Grid2>
        <Grid2 size={2}>
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
