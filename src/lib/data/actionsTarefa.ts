"use server";

import sequelize from "@/models";
import { ITarefaProps } from "@/models/tarefa";
import { cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import IFormTarefaCriar from "../forms/interfaces/IFormTarefaCriar";
import { IClienteProps } from "@/models/cliente";

export async function comProjetoComCliente(tarefaId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheObj<ITarefaProps>(
    () =>
      sequelize.models.Tarefa.findOne({
        where: { id: tarefaId, usuario_id: session.id },
        include: [
          {
            model: sequelize.models.Projeto,
            as: "Projeto",
            include: [
              {
                model: sequelize.models.Cliente,
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

export async function criar(form: IFormTarefaCriar, revalPath?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  let revalidateTagClientes = false;
  let revalidateTagProjetos = false;
  let revalidateTagTarefas = false;
  if (form.tarefa.id) {
    // Edita somente tarefa
    sequelize.models.Tarefa.update(
      { nome: form.tarefa.nome },
      { where: { id: form.tarefa.id, usuario_id: session.id } }
    );
    revalidateTagTarefas = true;
  } else {
    // Cria tarefa. Edita ou cria Cliente ou Prj
    // const cliente = {
    //   id: Number(formData.get("cliente.id")?.toString()),
    //   nome: formData.get("cliente.nome")?.toString() || ""
    // };
    
    if (!form.cliente?.id){
      const cliente = await sequelize.models.Cliente.create(
        { nome: form.cliente?.nome as string, usuario_id: session.id }
      );
      form.cliente = cliente;
      revalidateTagClientes = true;      
    }
    if (!form.projeto?.id){
      const projeto = await sequelize.models.Projeto.create(
        { nome: form.projeto?.nome as string, cliente_id: form.cliente.id as number, usuario_id: session.id }
      );
      form.projeto = projeto;
      revalidateTagProjetos = true;
    }
    const tarefa = await sequelize.models.Tarefa.create(
      { nome: form.tarefa.nome, projeto_id: form.projeto.id as number, usuario_id: session.id }
    )
    revalidateTagTarefas = true;
  }
  if (revalidateTagClientes) revalidateTag(RevalTagsEnum.Clientes);
  if (revalidateTagProjetos) revalidateTag(RevalTagsEnum.Projetos);
  if (revalidateTagTarefas) {
    revalidateTag(RevalTagsEnum.Tarefas);
    if (revalPath) revalidatePath(revalPath);
  }
}