import { ReadonlyURLSearchParams } from "next/navigation";
import { ISearchParams, ITarefasExpandidas } from "./ISearchParams";

export function tarefasExpandidas(searchParams?: ISearchParams["searchParams"] | ReadonlyURLSearchParams) {
    const tarefasExpandidas: ITarefasExpandidas = {};

    if (searchParams) {
      if (searchParams instanceof ReadonlyURLSearchParams){
        searchParams.forEach((value, key) => {
          const match = key.match(/tarsExps\[(\d+)\]/); // Regex para capturar tarsExps[id]
          if (match) {
            const tarefaId = Number(match[1]);
            tarefasExpandidas[tarefaId] = Number(value) || true;
          }
        });        
      } else {
        Object.keys(searchParams).forEach(key => {
          const match = key.match(/tarsExps\[(\d+)\]/); // Regex para capturar tarsExps[id]
          if (match) {
            const tarefaId = Number(match[1]);
            tarefasExpandidas[tarefaId] = Number((searchParams as any)[key]) || true;
          }
        });
      }
    }
    return tarefasExpandidas;
}