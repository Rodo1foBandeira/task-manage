"use server";

import sequelize from "@/models";
import { IClienteProps } from "@/models/cliente";
import { cacheList } from "./utils";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import { QueryTypes } from "sequelize";

export async function clientesComProjetosComTarefas() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IClienteProps>(
    () =>
      sequelize.Cliente.findAll({
        where: { usuario_id: session.id},
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
    ["actionsCliente.clientesComProjetosComTarefas", session.user.email],
    { tags: [RevalTagsEnum.Clientes, RevalTagsEnum.Projetos, RevalTagsEnum.Tarefas] }
  );

  return result;
}

export async function todos() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  const result = await cacheList<IClienteProps>(
    () => sequelize.Cliente.findAll({
      where: { usuario_id: session.id}
    }),
    ["actionsCliente.todos", session.user.email],
    { tags: [ RevalTagsEnum.Clientes ] }
  );

  return result;
}

export async function existeComUsuario(id: number, email: string) {
  const query = `
    SELECT 1 
    FROM clientes c
    INNER JOIN usuarios u ON u.email = :email
    WHERE c.id = :id
    LIMIT 1;
  `;

  const [results] = await cacheList<any>(
    () =>
      sequelize.query(query, {
        replacements: { email, id },
        type: QueryTypes.SELECT,
      }),
    ["actionsCliente.existeComUsuario", email, id.toString()],
    { tags: [RevalTagsEnum.Clientes] }
  );

  return !!results;
}

export async function editar(id: number, nome:string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  const ok = await existeComUsuario(id, session.user.email);
  
  if (ok){
    await sequelize.Cliente.update({ nome }, { where: { id } });
    revalidateTag(RevalTagsEnum.Clientes);
  } else {
    throw new Error("Cliente não autenticado");
  }
  
}