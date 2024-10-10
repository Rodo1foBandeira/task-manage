"use server";

import { IHistoricoProps } from "@/models/historico";
import { cacheList, cacheObj } from "./utils";
import sequelize from "@/models";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";

export async function porTarefa(tarefaId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IHistoricoProps>(
    () =>
      sequelize.Historico.findAll({
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
  const result = await cacheObj<IHistoricoProps>(() => sequelize.Historico.findOne({ where: { id, usuario_id: session.id } }), ["actionsHistorico.get", id.toString()], {
    tags: [RevalTagsEnum.Historicos],
  });
  return result;
}

export async function criarEditar({ observacao, id, tarefa_id }: { observacao: string; id?: number; tarefa_id?: number }) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  if (id) {
    await sequelize.Historico.update({ observacao }, { where: { id } });
  } else {
    await sequelize.Historico.create({ usuario_id: session.id, observacao, tarefa_id });
  }
  revalidateTag(RevalTagsEnum.Historicos);
}

export async function excluir(id: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  await sequelize.Historico.destroy({ where: { id, usuario_id: session.id } });
  revalidateTag(RevalTagsEnum.Historicos);
}
