import { ChannelType, Client, Collection, Events } from "discord.js";
import { messages, sendError, sendReply } from "./message-handler";
import { Command } from "./models/types";
import { getCommands } from "./utils/command-utils";

export default function useCommandHandler(client: Client) {
    const commands = new Collection<string, Command>();
    getCommands().forEach(command => commands.set(command.name, command));

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand() || !interaction.isChatInputCommand()) {
            return;
        }

        const { commandName, options } = interaction;
        const command = commands.get(commandName);
        if (!command) {
            await sendError(messages.UNRECOGNIZED_COMMAND, interaction);
            return;
        }

        if (interaction.channel?.type === ChannelType.DM) {
            await sendError(messages.DM_NOT_ALLOWED, interaction);
            return;
        }

        const args = options.data.map(option => {
            return String(option.value);
        });

        await interaction.deferReply();

        const reply = await command?.execute({
            interaction: interaction,
            args
        });

        if (reply) {
            await sendReply(reply, interaction, true);
        }
    });
};
