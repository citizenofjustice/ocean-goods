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
    TELEGRAM_BOT_API_KEY: string;
    TELEGRAM_CHAT_ID: string;
    IS_DB_LOCAL: string;
    IS_HOSTED_LOCALLY: string;
    POSTGRES_URL_NON_POOLING: string;
    POSTGRES_URL_NO_SSL: string;
    POSTGRES_PRISMA_URL: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_DATABASE: string;
    POSTGRES_URL: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}

namespace Express {
  interface Request {
    user: string | JwtPayload;
    priveleges: string | JwtPayload;
    imageDimensions?: {
      width: number;
      height: number;
    };
  }
}
