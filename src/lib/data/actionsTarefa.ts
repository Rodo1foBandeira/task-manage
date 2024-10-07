"use server";

import sequelize from "@/models";
import { ITarefaProps } from "@/models/tarefa";
import { cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function comProjetoComCliente(tarefaId: number) {
  const result = await cacheObj<ITarefaProps>(
    () =>
      sequelize.Tarefa.findByPk(tarefaId, {
        include: [
          {
            model: sequelize.Projeto,
            as: "Projeto",
            include: [
              {
                model: sequelize.Cliente,
                as: "Cliente",
              },
            ],
          },
        ],
      }),
    ["actionTarefa.comProjetoComCliente", tarefaId.toString()],
    { tags: [RevalTagsEnum.Tarefas, RevalTagsEnum.Projetos, RevalTagsEnum.Clientes] }
  );
  return result;
}

export async function criar(formData: FormData, redirectUrl?: string) {
  let persistiu = false;
  if (formData.get("tarefa.id")) {
    // Edita somente tarefa
    sequelize.Tarefa.update({ nome: formData.get("tarefa.nome") }, { where: { id: formData.get("tarefa.id") } });
    persistiu = true;
  } else {
    // Cria tarefa. Edita ou cria Cliente ou Prj
    // const cliente = {
    //   id: Number(formData.get("cliente.id")?.toString()),
    //   nome: formData.get("cliente.nome")?.toString() || ""
    // }; 
    let clienteId = Number(formData.get("cliente.id")?.toString());
    if (!clienteId){
      const nome = formData.get("cliente.nome")?.toString() || "";
      const cliente = await sequelize.Cliente.create({ nome });
      clienteId = cliente.id;
      revalidateTag(RevalTagsEnum.Clientes);
    }
    
    let projetoId = Number(formData.get("projeto.id")?.toString());
    if (!projetoId){
      const nome = formData.get("projeto.nome")?.toString() || "";
      const projeto = await sequelize.Projeto.create({ nome, cliente_id: clienteId });
      projetoId = projeto.id;
      revalidateTag(RevalTagsEnum.Projetos);
    }
    const nome = formData.get("tarefa.nome")?.toString() || "";
    const tarefa = await sequelize.Tarefa.create({ nome, projeto_id: projetoId })
    persistiu = true;
  }
  if (persistiu) {
    revalidateTag(RevalTagsEnum.Tarefas);
    if (redirectUrl) redirect(redirectUrl);
  }
}

export async function excluir(tarefaId: number) {
  await sequelize.Tarefa.destroy({ where: { id: tarefaId }, cascade: true});
  revalidateTag(RevalTagsEnum.Tarefas);
}