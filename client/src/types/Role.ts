import { Privelege } from "./Privelege";

export interface Role {
  roleId: number;
  title: string;
  priveleges: Privelege[];
}
