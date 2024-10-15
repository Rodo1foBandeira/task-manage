export interface ITarefasExpandidas{
  // idTarefa: idHistorico
  [key: number]: number | true;
}

export interface ISearchParams {
    tarsExps?: ITarefasExpandidas; // ?tarsExps[3]=1 nextjs não preenche
    //[key: string]: any;
    editarCliente?: number;
    criarTarefaPorPrj?: number;
    editarProjeto?: number;
    editarTarefa?: number;
}

export interface IPageSearchParams {
  searchparams?: ISearchParams
}

export enum UrlParamsEnum {
TarefasExpandidas = "tarsExps",
  EditarCliente= "editarCliente",
  CriarTarefaPorPrj = "criarTarefaPorPrj",
  EditarProjeto = "editarProjeto",
  EditarTarefa = "editarTarefa",
}
