"use server";

import sequelize from "@/models";
import { IProjetoProps } from "@/models/projeto";
import { cacheList, cacheObj } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";

export async function todos() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  return await cacheList<IProjetoProps>(
    () => sequelize.models.Projeto.findAll({ where : { usuario_id: session.id}}),
    ["actionsProjeto.todos", session.id.toString()],
    { tags: [RevalTagsEnum.Projetos] }
  );
}

export async function porCliente(clienteId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IProjetoProps>(
    () => sequelize.models.Projeto.findAll({ where: { cliente_id: clienteId, usuario_id: session.id}, }),
    ["actionsProjeto.porCliente", clienteId.toString()],
    { tags: [RevalTagsEnum.Projetos] }
  );
  return result;
}

export async function comCliente(projetoId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheObj<IProjetoProps>(
    () =>
      sequelize.models.Projeto.findOne({
        where: { id: projetoId, usuario_id: session.id },
        include: [
          {
            model: sequelize.models.Cliente,
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
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  await sequelize.models.Projeto.update({ nome }, { where: { id, usuario_id: session.id } });
  revalidateTag(RevalTagsEnum.Projetos);
}

export async function get(projetoId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.id) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheObj<IProjetoProps>(
    () =>
      sequelize.models.Projeto.findOne({
        where: { id: projetoId, usuario_id: session.id }
      }),
    ["actionsProjeto.get", projetoId.toString()],
    { tags: [RevalTagsEnum.Projetos] }
  );
  return result;
}