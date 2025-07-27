import type { Request, Response, NextFunction } from "express";
import { db } from "../connection/db.ts";

const loadCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.userId;
  if (!userId) return next();

  const user = await db
    .selectFrom("users")
    .select(["id", "username"])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (user) {
    (req as any).currentUser = user;
    res.locals.currentUser = user;
  }

  next();
};

export default loadCurrentUser;
