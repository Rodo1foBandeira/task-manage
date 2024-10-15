interface IBasic {
    id?: number;
    nome: string;
}
export default interface IFormTarefaCriar {
    tarefa: IBasic;
    projeto?: IBasic;
    cliente?: IBasic;
}