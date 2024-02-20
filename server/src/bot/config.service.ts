import { config } from "dotenv";

import { IConfigService } from "./config.interface";

// Defining the ConfigService class that implements the IConfigService interface
export class ConfigService implements IConfigService {
  // Declaring a private config variable of type Record
  private config: Record<string, string | undefined>;

  // Constructor for the ConfigService class
  constructor() {
    // Using destructuring to get the parsed config object from the dotenv config function
    const { parsed } = config();
    // Assigning the parsed config object or the process.env object to the config variable
    this.config = parsed || process.env;
  }

  // Method to get a value from the config variable using a key
  get(key: string): string {
    // Getting the value associated with the key from the config variable
    const res = this.config[key];
    // If the value does not exist, throw an error
    if (!res) {
      throw new Error(`Key ${key} not exists`);
    }
    return res;
  }
}
