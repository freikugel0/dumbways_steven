import type { Request, Response } from "express";
import { db } from "../connection/db.ts";
import { sql } from "kysely";

export const renderHome = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;

  const query = search
    ? db
        .selectFrom("posts")
        .innerJoin("users", "users.id", "posts.user_id")
        .where("title", "ilike", `%${search}%`)
    : db.selectFrom("posts").innerJoin("users", "users.id", "posts.user_id");

  const rawPosts = await query
    .select([
      "posts.id",
      "posts.user_id",
      "posts.title",
      "posts.content",
      "posts.created_at",
      "posts.updated_at",
      "posts.attachment",
      "users.username",
    ])
    .orderBy("posts.created_at", "desc")
    .execute();

  const votes = await db
    .selectFrom("post_votes")
    .select([
      "post_id",
      sql<number>`sum(case when vote = 1 then 1 else 0 end)`.as("upvotes"),
      sql<number>`sum(case when vote = -1 then 1 else 0 end)`.as("downvotes"),
    ])
    .groupBy("post_id")
    .execute();

  const posts = rawPosts.map((post) => {
    const vote = votes.find((v) => v.post_id === post.id);
    return {
      ...post,
      upvotes: vote?.upvotes || 0,
      downvotes: vote?.downvotes || 0,
    };
  });

  res.render("home", {
    title: "Home - Microblog",
    posts,
    search: { keyword: search, count: posts.length },
  });
};

export const searchPosts = async (req: Request, res: Response) => {};
