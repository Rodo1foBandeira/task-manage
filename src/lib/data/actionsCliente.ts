"use server";

import sequelize from "@/models";
import { IClienteProps } from "@/models/cliente";
import { cacheList, cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import { QueryTypes } from "sequelize";

export async function clientesComProjetosComTarefas() {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IClienteProps>(
    () =>
      sequelize.Cliente.findAll({
        where: { usuario_id: session.id },
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
    ["actionsCliente.clientesComProjetosComTarefas", session.id.toString()],
    { tags: [RevalTagsEnum.Clientes, RevalTagsEnum.Projetos, RevalTagsEnum.Tarefas] }
  );

  return result;
}

export async function todos() {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IClienteProps>(
    () =>
      sequelize.Cliente.findAll({
        where: { usuario_id: session.id },
      }),
    ["actionsCliente.todos", session.id.toString()],
    { tags: [RevalTagsEnum.Clientes] }
  );

  return result;
}

export async function editar(id: number, nome: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.id) {
    throw new Error("Usuário não autenticado");
  }
  await sequelize.Cliente.update({ nome }, { where: { id, usuario_id: session.id } });
  revalidateTag(RevalTagsEnum.Clientes);
}
