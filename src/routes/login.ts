import { db } from "../connection/db.ts";
import type { ExpressCallbackFnParams } from "../typings/express.ts";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

type LoginPayload = {
  username: string;
  password: string;
};

export const renderLogin = (req: Request, res: Response) => {
  res.render("login", {
    layout: "auth",
    title: "Login - Microblog",
  });
};

export const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginPayload;

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
  if (!user) {
    req.flash("error", "Username or password is incorrect");
    return res.redirect("/login");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!user || !isPasswordMatch) {
    req.flash("error", "Username or password is incorrect");
    return res.redirect("/login");
  }

  req.session.userId = user.id;
  res.redirect("/");
};
