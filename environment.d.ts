declare global {
    namespace NodeJS {
        interface ProcessEnv {
            dbUrl: string;
            bucketUrl: string;
        }
    }
}

export {}