import dotenv from "dotenv";

import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

dotenv.config();
 
const config = {
    env: createEnv({
      server: {
        NODE_ENV: z.enum(["development", "production", "staging", "test"]).default("development"),
        DC_BOT_TOKEN: z.string().nonempty().min(72).max(100),
        API_PORT: z.string().nonempty().default("3000"),
        API_VERSION: z.string().nonempty().default("/v1"),
      },
      runtimeEnv: process.env,
    }),
}

export default config;