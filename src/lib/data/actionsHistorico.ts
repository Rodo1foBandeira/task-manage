"use server";

import { IHistoricoInstance, IHistoricoProps } from "@/models/historico";
import { cacheList, cacheObj } from "./utils";
import sequelize from "@/models";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import { ModelAttributes } from "sequelize";

export async function porTarefa(tarefaId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IHistoricoProps>(
    () =>
      sequelize.models.Historico.findAll({
        where: {
          tarefa_id: tarefaId,
          usuario_id: session.id,
        },
      }),
    ["actionsHistorico.porTarefa", tarefaId.toString()],
    { tags: [RevalTagsEnum.Historicos] }
  );
  return result;
}

export async function get(id: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }
  const result = await cacheObj<IHistoricoProps>(
    () => sequelize.models.Historico.findOne({ where: { id, usuario_id: session.id } }),
    ["actionsHistorico.get", id.toString()],
    { tags: [RevalTagsEnum.Historicos]}
  );
  return result;
}

export async function criarEditar({ observacao, id, tarefa_id }: { observacao: string; id?: number; tarefa_id?: number }) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  if (id) {
    await sequelize.models.Historico.update({ observacao }, { where: { id, usuario_id: session.id, } });
  } else {
    await sequelize.models.Historico.create({ usuario_id: session.id, observacao, tarefa_id: tarefa_id as number });
  }
  revalidateTag(RevalTagsEnum.Historicos);
}