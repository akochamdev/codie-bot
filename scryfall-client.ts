import logger from "./logger";
import { Card } from "./models/types";

const BASE_URI = "https://api.scryfall.com"
const headers = {
    'User-Agent': 'CodieBotApp/1.0',
    'Accept': 'application/json'
}
const LIMIT_PER_SECOND = 2;
const TOO_MANY_REQUESTS = 429;

export async function getCards(names: string[]): Promise<Card[]> {
    const cards: Card[] = [];
    let timeout = 0;
    if (names.length > LIMIT_PER_SECOND) {
        timeout = 1000 / LIMIT_PER_SECOND;
    }

    for (const name of names) {
        const url = encodeURI(`${BASE_URI}/cards/named?fuzzy=${name}`);

        try {
            const response = await fetch(url, { headers });

            console.log(response);

            if (response.status === TOO_MANY_REQUESTS) {
                // If this ends up being a problem, create a 
                // proper request queue.
                logger.error(`Too many requests`);
                throw new Error(`Too many requests.`);
            } else if (!response.ok) {
                logger.error(`Failed to fetch card.`);
                throw new Error(`Failed to fetch card`);
            }

            const card = (await response.json()) as Card;
            cards.push(card);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    
    return cards;
}
