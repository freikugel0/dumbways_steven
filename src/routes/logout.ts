import type { Request, Response } from "express";

export const handleLogout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
