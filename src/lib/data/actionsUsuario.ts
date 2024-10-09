"use server";

import { IUsuarioProps } from "@/models/usuario";
import { cacheObj } from "./utils";
import sequelize from "@/models";
import RevalTagsEnum from "../enums/RevalTagsEnum";
import { revalidateTag } from "next/cache";

const criarComTransacao = async ( email: string, nome: string) => {
  const transaction = await sequelize.transaction();
  try {
    const usuario = await sequelize.Usuario.create({ nome, email });
    await transaction.commit();
    revalidateTag(RevalTagsEnum.Usuarios);
    return usuario;
  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao criar usuário com transação:", error);
    throw error; // Repassa o erro para tratamento externo
  }
}

export async function encontrarOuCriar(email: string, nome?: string, criar?: boolean) {
  const result = await cacheObj<IUsuarioProps>(
    () =>
      sequelize.Usuario.findOne({
        where: { email },
      }),
    ["actionsUsuario.encontrarOuCriar", email],
    { tags: [RevalTagsEnum.Usuarios] }
  );
  if (result) {
    return result;
  } else if (criar && nome) {
    // const usuario = await cacheObj<IUsuarioProps>(
    //   () => criarComTransacao(email, nome),
    //   ["actionsUsuario.criarComTransacao", email],
    //   {}
    // );
    const usuario = await criarComTransacao(email, nome);
    return usuario;
  }
}
