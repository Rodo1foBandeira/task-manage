"use server";

import sequelize from "@/models";
import { IClienteProps } from "@/models/cliente";
import { cacheList } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";

export async function clientesComProjetosComTarefas() {
  const result = await cacheList<IClienteProps>(
    () =>
      sequelize.Cliente.findAll({
        include: [
          {
            model: sequelize.Projeto,
            as: "Projetos",
            include: [
              {
                model: sequelize.Tarefa,
                as: "Tarefas",
              },
            ],
          },
        ],
      }),
    ["actionsCliente.clientesComProjetosComTarefas"],
    { tags: [RevalTagsEnum.Clientes, RevalTagsEnum.Projetos, RevalTagsEnum.Tarefas] }
  );

  return result;
}

export async function todos() {
  const result = await cacheList<IClienteProps>(
    () => sequelize.Cliente.findAll(),
    ["actionsCliente.todos"],
    { tags: [ RevalTagsEnum.Clientes ] }
  );

  return result;
}


export async function editar(id: number, nome:string) {
  await sequelize.Cliente.update({ nome }, { where: { id } });
  revalidateTag(RevalTagsEnum.Clientes);
}