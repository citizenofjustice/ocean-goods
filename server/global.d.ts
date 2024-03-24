namespace NodeJS {
  interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    TELEGRAM_BOT_API_KEY: string;
    TELEGRAM_CHAT_ID: string;
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
