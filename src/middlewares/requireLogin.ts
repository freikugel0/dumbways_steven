import type { Request, Response, NextFunction } from "express";

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next?.();
};

export default requireLogin;
