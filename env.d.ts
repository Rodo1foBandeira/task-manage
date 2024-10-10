declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_TASK_MANAGE: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        AUTH_SECRET: string;
        NEXTAUTH_URL: string;
        POSTGRES_URL: string;
      }
    }
  }

  export {};