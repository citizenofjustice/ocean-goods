import { config } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
  private config: Record<string, string | undefined>;

  constructor() {
    const { parsed } = config();
    this.config = parsed || process.env;
  }

  get(key: string): string {
    const res = this.config[key];
    if (!res) {
      throw new Error(`Key ${key} not exists`);
    }
    return res;
  }
}
