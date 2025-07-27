import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { User } from "../typings/user.ts";
import type { Post, PostVotes } from "../typings/post.ts";

type DB = {
  users: User;
  posts: Post;
  post_votes: PostVotes;
};

export const pool = new Pool({
  database: "microblog_db",
  host: "localhost",
  user: "xjeil",
  password: "42685",
  port: 5432,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});
