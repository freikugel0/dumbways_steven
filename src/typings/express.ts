import type { Request, Response, NextFunction } from "express";

export type ExpressCallbackFnParams = {
  req: Request;
  res: Response;
  next?: NextFunction;
};
