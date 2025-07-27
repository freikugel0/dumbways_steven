import type { Request, Response } from "express";

export const renderProfile = (req: Request, res: Response) => {
  const user = res.locals.currentUser;
  res.render("profile", {
    user,
  });
};
