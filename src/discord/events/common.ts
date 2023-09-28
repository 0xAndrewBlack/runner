import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { logger } from "../../helpers/logger.js";

@Discord()
export class Example {
  @On()
  messageDelete([message]: ArgsOf<"messageDelete">, client: Client): void {
    logger.verbose("Message Deleted", client.user?.username, message.content);
  }
}
