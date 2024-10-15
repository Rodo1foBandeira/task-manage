import { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import * as actionsUsuario from "@/lib/data/actionsUsuario";
import { IUsuarioProps } from "./models/usuario";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session } : { session: Session}) {
      // Adiciona informações extras à sessão se necessário
      if(session.user?.email && session.user?.name){
        const usuario =  await actionsUsuario.encontrarOuCriar(session.user?.email, session.user?.name, false) as IUsuarioProps;
        session.id = usuario?.id;
      }        
      return session;
    },
    async signIn({ user } : { user: User}) {
      try {
        if(user.email && user.name)
          await actionsUsuario.encontrarOuCriar(user.email, user.name, true) as IUsuarioProps;
        return true;
      } catch (error) {
        console.error("Erro ao verificar/criar o usuário:", error);
        return false; // Bloqueia login em caso de erro
      }
    },
  },
};

declare module "next-auth" {
  interface Session {
    id?: number
  }
}

export default authOptions;