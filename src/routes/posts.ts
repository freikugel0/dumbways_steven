import { db } from "../connection/db.ts";
import type { Request, Response } from "express";

type PostPayload = {
  title: string;
  content: string;
};

export const handleCreatePost = async (req: Request, res: Response) => {
  const { title, content } = req.body as PostPayload;
  const attachment = req.file?.filename;

  if (title.length === 0 || content.length === 0) {
    req.flash("error", "Title or content can't be empty");
    return res.redirect("/");
  }

  await db
    .insertInto("posts")
    .values({
      title,
      content,
      user_id: (req as any).currentUser.id,
      attachment: attachment,
    })
    .execute();

  res.redirect("/");
};

export const handleVotePost = async (req: Request, res: Response) => {
  const vote = Number((req.body as any).vote);
  const userId = Number((req as any).currentUser.id);
  const postId = Number(req.params.id);

  if (isNaN(vote) || isNaN(userId) || isNaN(postId)) {
    return res.redirect("/");
  }

  const existingVote = await db
    .selectFrom("post_votes")
    .selectAll()
    .where("user_id", "=", userId)
    .where("post_id", "=", postId)
    .executeTakeFirst();

  if (!existingVote) {
    // init votes
    await db
      .insertInto("post_votes")
      .values({
        user_id: userId,
        post_id: postId,
        vote,
      })
      .execute();
  } else if (existingVote.vote === vote) {
    // cancel vote
    await db
      .deleteFrom("post_votes")
      .where("user_id", "=", userId)
      .where("post_id", "=", postId)
      .execute();
  } else {
    // if click the opposite vote
    await db
      .updateTable("post_votes")
      .set({ vote })
      .where("user_id", "=", userId)
      .where("post_id", "=", postId)
      .execute();
  }

  res.redirect("/");
};

export const handlePostDelete = async (req: Request, res: Response) => {
  const userId = Number((req as any).currentUser.id);
  const postId = Number(req.params.id);

  if (isNaN(userId) || isNaN(postId)) {
    return res.redirect("/");
  }

  if (isNaN(postId)) {
    return res.redirect("/");
  }

  const existingPost = await db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", postId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existingPost) {
    await db.deleteFrom("posts").where("id", "=", postId).execute();
  } else {
    return res.redirect("/");
  }

  res.status(200).json({ success: true });
};

export const renderEditPost = async (req: Request, res: Response) => {
  const userId = Number((req as any).currentUser.id);
  const postId = Number(req.params.id);

  if (isNaN(userId) || isNaN(postId)) {
    return res.redirect("/");
  }

  const existingPost = await db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", postId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existingPost) {
    res.render("editPost", {
      title: `Edit Post ${postId} - Microblog`,
      existingPost,
    });
  } else {
    res.redirect("/");
  }
};

export const handleEditPost = async (req: Request, res: Response) => {
  const userId = Number((req as any).currentUser.id);
  const postId = Number(req.params.id);
  const { title, content } = req.body as PostPayload;
  const attachment = req.file?.filename;

  if (isNaN(userId) || isNaN(postId)) {
    return res.redirect("/");
  }

  const existingPost = await db
    .selectFrom("posts")
    .selectAll()
    .where("id", "=", postId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!existingPost) return res.redirect("/");

  await db
    .updateTable("posts")
    .set({ title, content, attachment })
    .where("id", "=", postId)
    .execute();

  res.status(200).json({ success: true });
};
