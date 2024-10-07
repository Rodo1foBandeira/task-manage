"use server";

import { IHistoricoProps } from "@/models/historico";
import { cacheList, cacheObj } from "./utils";
import sequelize from "@/models";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";

export async function porTarefa(tarefaId: number) {
  const result = await cacheList<IHistoricoProps>(
    () =>
      sequelize.Historico.findAll({
        where: {
          tarefa_id: tarefaId,
        },
      }),
    ["actionsHistorico.porTarefa", tarefaId.toString()],
    { tags: [RevalTagsEnum.Historicos] }
  );
  return result;
}

export async function get(id: number) {
  const result = await cacheObj<IHistoricoProps>(
    () =>
      sequelize.Historico.findByPk(id),
    ["actionsHistorico.get", id.toString()],
    { tags: [RevalTagsEnum.Historicos] }
  );
  return result;
}

export async function criar(formData: FormData) {
  if (formData.get("historico.id")) {
    await sequelize.Historico.update({ observacao: formData.get("historico.observacao") }, { where: { id: formData.get("historico.id") } });
  } else {
    await sequelize.Historico.create({ observacao: formData.get("historico.observacao"), tarefa_id: formData.get("historico.tarefaId") });
  }
  revalidateTag(RevalTagsEnum.Historicos);
}

export async function excluir(historicoId: number) {
  await sequelize.Historico.destroy({ where: { id: historicoId } });
  revalidateTag(RevalTagsEnum.Historicos);
}
