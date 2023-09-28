import type { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import { validationResult } from "express-validator";

import ExampleService from "../../services/ExampleService.js";

import Runner from "../../index.js";

const exampleControllers = {
  example: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const example = {
      shards: Runner.shardUptimeMap.size,
      uptime: Runner.getShardUptime(Runner.manager.shards.first()!),
    };

    return res.status(StatusCodes.OK).json({ message: example });
  },
};

export default exampleControllers;
