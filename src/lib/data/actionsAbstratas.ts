"use server";

import authOptions from "@/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { Model, ModelStatic } from "sequelize";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import sequelize from "@/models";

export async function excluir(model: ModelStatic<Model>, id: number, revalTags: RevalTagsEnum[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  await model.destroy({ where: { id, usuario_id: session.id }, cascade: true });

  revalTags.forEach(tag => revalidateTag(tag));
}

export async function excluir4Btn(entidade: "Cliente" | "Projeto" | "Tarefa" | "Historico", id: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  interface IEntidade {
    model: ModelStatic<Model>;
    revalTags: RevalTagsEnum[];
  }

  const entidades: Record<string, IEntidade> = {
    Cliente: {
      model: sequelize.models.Cliente,
      revalTags: [RevalTagsEnum.Clientes],
    },
    Projeto: {
      model: sequelize.models.Projeto,
      revalTags: [RevalTagsEnum.Projetos],
    },
    Tarefa: {
      model: sequelize.models.Tarefa,
      revalTags: [RevalTagsEnum.Tarefas],
    },
    Historico: {
      model: sequelize.models.Historico,
      revalTags: [RevalTagsEnum.Historicos],
    },
  };

  await entidades[entidade].model.destroy({ where: { id, usuario_id: session.id }, cascade: true });

  entidades[entidade].revalTags.forEach(tag => revalidateTag(tag));
  revalidatePath("/tarefas")
}