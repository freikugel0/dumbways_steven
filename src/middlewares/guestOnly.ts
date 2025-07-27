import type { Request, Response, NextFunction } from "express";

const redirectIfAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId) {
    return res.redirect("/");
  }

  next();
};

export default redirectIfAuthenticated;
