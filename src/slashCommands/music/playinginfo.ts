import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'playinginfo',
    description:'Disable or enable playing embed from lechsbott!',
    async execute({client, interaction, args}) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        if (!server_queue) {
            return interaction.followUp({ embeds: [embeds.noQueue(interaction)] });
        }

        if(server_queue.playingInfo === true){
            server_queue.playingInfo = false
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**Playing info is now disabled**\nTracks playing info won't be send until you enable that`)
            return interaction.followUp({ embeds: [embed] });
        } else {
            server_queue.playingInfo = true
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**Playing info is now enabled**\nTracks playing info will be send`)
            return interaction.followUp({ embeds: [embed] });
        }

    }
})