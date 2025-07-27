import { type Generated } from "kysely";

export type Post = {
  id: Generated<number>;
  user_id: number;
  title: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  attachment?: string;
};

export type PostVotes = {
  id: Generated<number>;
  user_id: number;
  post_id: number;
  vote: number;
  created_at: Generated<Date>;
};
