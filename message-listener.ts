import { Client, Events } from "discord.js";
import logger from "./logger";
import { sendError, sendGallery } from "./message-handler";
import { getCards } from "./scryfall-client";

const CARD_NAME_PATTERN = /\[\[([^\[\]]+)\]\]/g; // [[name]]

export default function useMessageListener(client: Client) {
    client.on(Events.MessageCreate, async (message) => {
        if (message.author.bot) {
            return;
        }

        const matches = Array.from(message.content.matchAll(CARD_NAME_PATTERN));
        const names = matches.map(match => match[1]).filter(match => match !== undefined);

        logger.info(`names: `);
        for (const name of names) {
            logger.info(name);
        }
        message.channel;

        if (names.length > 0) {
            await getCards(names)
                .then(cards => sendGallery(cards, message))
                .catch(_error => sendError(`Could not retrieve card(s).`, message));
        }
    });
}
