import { roleColor, converToCode } from "../../util/lechsFunctions";
import Discord from 'discord.js'
import { PREFIX } from '../../config.json'
import { SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    name: "help",
    description: "Get help embed for commands of lechsbott!",
    async execute({ client, interaction, args }) {

        let allcmds: string[] = [];

        client.slashCommands.forEach(cmd => {

            let data = `\`${cmd.name}\``

            allcmds.push(data)

        })

        let fields = []

        let data = {
            name: `Slash Commands [${allcmds.length}]`,
            value: `${allcmds.join(' ')}`
        }

        fields.push(data)

        const embed = new Discord.MessageEmbed()
            .setAuthor({name: `Command List`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`})
            .setDescription(`A list of commands for help about complicated commands!`)
            .addFields(fields)
            .setTimestamp()
            .setColor(roleColor(interaction))
        return interaction.followUp({ embeds: [embed] });
    }
})