import config from './config.js';

import { Client } from 'discordx';
import { dirname, importx } from '@discordx/importer';
import { ActivityType, IntentsBitField, Interaction, Message, Partials } from 'discord.js';

import { NotBot } from '@discordx/utilities';
import { DiscordLogger, logger } from './helpers/logger.js'; 

export class DiscordBot {
	public static bot: Client;

	public static async start(): Promise<void> {
		this.bot = new Client({
			// botId: config.DC_BOT_ID,
			shards: 'auto',
			logger: new DiscordLogger(),
			silent: config.env.NODE_ENV !== 'development',
			botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildMessageReactions,
				IntentsBitField.Flags.GuildVoiceStates,
				IntentsBitField.Flags.MessageContent,
			],
			simpleCommand: {
				prefix: '!',
			},
			partials: [Partials.Channel, Partials.Message, Partials.Reaction],
			guards: [NotBot],
		});

		this.bot.on('ready', async () => {
			logger.info(`RUNNER > [${this.bot.user?.username}] logged in.`);

			await this.bot.guilds.fetch();

			await this.bot.user?.setPresence({
				activities: [{ name: 'your threads.', type: ActivityType.Watching }],
				status: 'online',
			});

			await this.bot.initApplicationCommands();
			await this.bot.initGlobalApplicationCommands();
		});

		this.bot.on('messageCreate', (message: Message) => {
			this.bot.executeCommand(message);
		});

		this.bot.on('interactionCreate', (interaction: Interaction) => {
			// @ts-ignore
			logger.verbose(`SYNCER > [${interaction?.user?.username}] ran a command >>> [${interaction?.commandName}]`);
			this.bot.executeInteraction(interaction);
		});

    await importx(`${dirname(import.meta.url)}/discord/{events,commands,contexts}/**/*.{ts,js}`);

		await this.bot.login(config.env.DC_BOT_TOKEN);
	}
}

// Polyfill for BigInt serialization
(BigInt.prototype as any).toJSON = function (): string {
	return this.toString();
};

await DiscordBot.start();