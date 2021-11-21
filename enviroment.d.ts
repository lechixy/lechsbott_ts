declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            prefix: string;
            enviroment: "dev" | "prod" | "debug";
        }
    }
}

export {};
