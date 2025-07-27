import { type Generated } from "kysely";

export type User = {
  id: Generated<number>;
  username: string;
  password_hash: string;
};
