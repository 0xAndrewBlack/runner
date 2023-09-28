import type { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import { validationResult } from "express-validator";

const homeControllers = {
  home: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    return res.json({ message: "👋" });
  },
};

export default homeControllers;
