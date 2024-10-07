"use server";

import sequelize from "@/models";
import { IProjetoProps } from "@/models/projeto";
import { cacheList, cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";

export async function todos() {
  return await cacheList<IProjetoProps>(() => sequelize.Projeto.findAll(), ["actionsProjeto.todos"], { tags: [RevalTagsEnum.Projetos] });
}

export async function porCliente(clienteId: number) {
  const result = await cacheList<IProjetoProps>(
    () =>
      sequelize.Projeto.findAll({
        where: {
          cliente_id: clienteId,
        },
      }),
    ["actionsProjeto.porCliente", clienteId.toString()],
    { tags: [RevalTagsEnum.Projetos] }
  );
  return result;
}

export async function comCliente(projetoId: number) {
  const result = cacheObj<IProjetoProps>(
    () =>
      sequelize.Projeto.findByPk(projetoId, {
        include: [
          {
            model: sequelize.Cliente,
            as: "Cliente",
          },
        ],
      }),
    ["actionsProjeto.comCliente", projetoId.toString()],
    { tags: [RevalTagsEnum.Projetos, RevalTagsEnum.Clientes] }
  );
  return result;
}

export async function editar(id: number, nome:string) {
  await sequelize.Projeto.update({ nome }, { where: { id } });
  revalidateTag(RevalTagsEnum.Projetos);
}