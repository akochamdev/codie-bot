import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import logger, { flushLogs } from "./logger";
import useMessageListener from "./message-listener";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Discord events
client.once(Events.ClientReady, () => {
    logger.info("Codie Bot is ready.");
    client.user?.setPresence({status: "online"});

    setInterval(() => {
        flushLogs();
    }, 5000);

    useMessageListener(client);
    //useCommandHandler(client);
});

client.on(Events.Error, (error) => {
    logger.error(`Received discord client error: `, error);
});

client.login(process.env.TOKEN).then(() => {
    logger.info("Codie Bot is logged in.");
});
