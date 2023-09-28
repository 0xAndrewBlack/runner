import config from "./config.js";

import axios from "axios";
import { axiosLogInterceptor, logger } from "./helpers/logger.js";

import API from "./api/server.js";

import { DiscordBot } from "./bot.js";
import { Shard, ShardingManager } from "discord.js";

export default class Runner {
	public static bot: DiscordBot;
	public static api: Express.Application;
	public static manager: ShardingManager;

	public static shardUptimeMap: Map<Shard, number> = new Map();

	public static async start(): Promise<void> {
		axios.interceptors.response.use(axiosLogInterceptor);

		this.api = new API()

		this.manager = new ShardingManager('./build/bot.js', {
			token: config.env.DC_BOT_TOKEN,
			totalShards: "auto",
			respawn: true,
			shardArgs: ['--ansi', '--color'],
		});

		this.manager.on("shardCreate", (shard: Shard) => {
			logger.info(`SHARD > Launched shard #${shard.id}`);

			Runner.addShardListeners([shard]);
		});
	  
		await this.manager.spawn();
	}

	public static getShardUptime(shard: Shard): number {
        if (!Runner.shardUptimeMap.has(shard)) {
            return -1;
        }

        const startTime = Runner.shardUptimeMap.get(shard);

		// Time difference in seconds
        return Math.round(Date.now() - startTime!) / 1000;
    }

    private static addShardListeners(shards: Shard[]): void {
        for (const shard of shards) {
            shard.on("spawn", () => {
                Runner.shardUptimeMap.set(shard, Date.now());
            });

            shard.on("death", () => {
                Runner.shardUptimeMap.delete(shard);
            });
        }
    }
}

await Runner.start();