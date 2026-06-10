import { CommandInteraction, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, Message, MessageFlags, MessageFlagsBitField } from "discord.js";
import logger from "./logger";
import { Card, ComponentColors, MessageData } from "./models/types";

export const messages = {
    "INVALID_ARGS": "Received invalid arguments for command",
    "UNRECOGNIZED_COMMAND": "Did not recognize command.",
    "DM_NOT_ALLOWED": "This command cannot be used in a DM."
};

export async function sendReply(
    data: MessageData,
    message: Message | CommandInteraction,
    followUp = false
) {
    const options = getOptions(data);

    if (followUp && message instanceof CommandInteraction) {
        await message.followUp(options);
    } else {
        await message.reply(options);
    }
}

export async function sendSuccess(
    content: string, 
    message: Message | CommandInteraction
) {
    sendReply(
        { container: successContainer(content)},
        message
    );
}

export async function sendError(
    content: string, 
    message: Message | CommandInteraction
) {
    sendReply(
        { container: errorContainer(content)},
        message
    );
}

export async function sendGallery(
    cards: Card[],
    message: Message | CommandInteraction
) {
    sendReply(
        { container: galleryContainer(cards) },
        message
    );
}

function getOptions(data: MessageData) {
    const container = data.container || [[errorContainer("Could not complete command.")]];
    const flagsField = new MessageFlagsBitField();
    flagsField.add(MessageFlags.IsComponentsV2);
    if (data.ephemeral) {
        flagsField.add(MessageFlags.Ephemeral);
    }

    return {
        flags: flagsField.bitfield,
        components: [container]
    };
}

function successContainer(successMessage: string): ContainerBuilder {
    return messageContainer(
        `✅ ${successMessage}`,
        ComponentColors.Success
    );
}

function errorContainer(errorMessage?: string): ContainerBuilder {
    const description = errorMessage || "An unknown error occurred 😢";

    logger.error(description);

    return messageContainer(
        `❌ ${description}`,
        ComponentColors.Error
    );
}

function messageContainer(content: string, color?: ComponentColors): ContainerBuilder {
    let container = new ContainerBuilder();

    if (color) {
        container = container.setAccentColor(color);
    }

    container.addTextDisplayComponents((textDisplay) => textDisplay.setContent(content));
    
    return container;
}

function galleryContainer(cards: Card[]): ContainerBuilder {
    if (cards.length === 0) {
        return errorContainer('Empty card list.');
    }

    let container = new ContainerBuilder()
        .setAccentColor(ComponentColors.Normal);

    const items: MediaGalleryItemBuilder[] = [];
    for (const card of cards) {
        if (card.card_faces) {
            for (const face of card.card_faces) {
                items.push(new MediaGalleryItemBuilder()
                .setDescription(face.name)
                .setURL(face.image_uris?.large || ''));
            }
        } else {
            items.push(new MediaGalleryItemBuilder()
                .setDescription(card.name)
                .setURL(card.image_uris?.large || ''));
        }
    }
    
    container.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(items));

    return container;
}
