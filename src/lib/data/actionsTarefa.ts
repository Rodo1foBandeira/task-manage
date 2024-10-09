"use server";

import sequelize from "@/models";
import { ITarefaProps } from "@/models/tarefa";
import { cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";

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
    ["actionsTarefa.comProjetoComCliente", tarefaId.toString()],
    { tags: [RevalTagsEnum.Tarefas, RevalTagsEnum.Projetos, RevalTagsEnum.Clientes] }
  );
  return result;
}

export async function criar(formData: FormData, redirectUrl?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

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
      const cliente = await sequelize.Cliente.create({ nome, usuario_id: session.id });
      clienteId = cliente.id;
      revalidateTag(RevalTagsEnum.Clientes);
    }
    
    let projetoId = Number(formData.get("projeto.id")?.toString());
    if (!projetoId){
      const nome = formData.get("projeto.nome")?.toString() || "";
      const projeto = await sequelize.Projeto.create({ nome, cliente_id: clienteId, usuario_id: session.id });
      projetoId = projeto.id;
      revalidateTag(RevalTagsEnum.Projetos);
    }
    const nome = formData.get("tarefa.nome")?.toString() || "";
    const tarefa = await sequelize.Tarefa.create({ nome, projeto_id: projetoId, usuario_id: session.id })
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