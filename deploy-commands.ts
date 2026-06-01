import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import dotenv from "dotenv";
import logger from "./logger";
import { getCommands } from "./utils/command-utils";

/**
 * This script reloads all of the slash commands that are
 * defined in the app (inside the commands folder). It is
 * not part of the bot logic itself and is meant to be run
 * independently whenever a slash command is added or is
 * changed.
 * The bot token, clientId and guildIds for testing are defined in
 * the environment. All test servers in TEST_GUILD_IDS should be
 * separated with a comma (,)
 * Run using "ts-node deploy-commands.ts"
 */
dotenv.config();

const clientId = process.env.CLIENT_ID || "";
const jsonCommands = getCommands().map(command => command.definition.toJSON());

if (process.env.TOKEN) {
    const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
    (async () => {
        try {
            if (jsonCommands.length > 0) {
                logger.info(`Started refreshing global (/) commands (${jsonCommands.length}).`);
                await rest.put(
                    Routes.applicationCommands(clientId),
                    {body: jsonCommands}
                );
                logger.info(`Successfully reloaded global (/) commands.`);
            }
        } catch (error) {
            logger.error(error);
        }
    })();
}
