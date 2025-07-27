import { db } from "../connection/db.ts";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

type RegisterPayload = {
  username: string;
  password: string;
  password_confirm: string;
};

export const renderRegister = (req: Request, res: Response) => {
  res.render("register", {
    layout: "auth",
    title: "Register - Microblog",
  });
};

export const handleRegister = async (req: Request, res: Response) => {
  const { username, password, password_confirm } = req.body as RegisterPayload;
  if (password !== password_confirm) {
    req.flash("error", "Password did not match");
    return res.redirect("/register");
  }

  const registeredUser = await db
    .selectFrom("users")
    .select(["username"])
    .where("username", "=", username)
    .executeTakeFirst();
  if (registeredUser) {
    req.flash("error", "Username is already registered");
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .insertInto("users")
      .values({ username, password_hash: hashedPassword })
      .executeTakeFirst();

    res.redirect("/login");
  } catch (error: any) {
    // TODO: should be rendering html with error message from db
    console.error(error);
  }
};
