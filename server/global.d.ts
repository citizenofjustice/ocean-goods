namespace NodeJS {
  interface ProcessEnv {
    BLOB_READ_WRITE_TOKEN: string;
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
    JWT_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}

namespace Express {
  interface Request {
    user: string | JwtPayload;
  }
}
