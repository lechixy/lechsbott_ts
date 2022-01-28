import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../index";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/SlashCommand";
import saidPrefix from "../database/saidPrefix";

export default new Event("interactionCreate", async (interaction) => {

    if (!interaction.inCachedGuild()) return;

    if (interaction.member.isCommunicationDisabled()) return

    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.slashCommands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("You have used a non existent command");

        saidPrefix(interaction)
        command.execute({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
        console.log(`${interaction.user.tag} has used /${interaction.commandName} in ${interaction.guild.name}`)
    }
});
