import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'dequeue',
    description: 'Dequeues the song from the queue!',
    options: [
        {
            name: "number",
            description: "Type a queue number for remove that song!",
            type: "INTEGER",
            required: true,
        }
    ],
    async execute({ client, interaction, args }) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        if (!server_queue) {
            return interaction.followUp({ embeds: [embeds.noQueue(interaction)] });
        }
        

        let number = args.getNumber('number')

        if (number <= 0) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setTitle(`The "${args[0]}"" is need to be positive`)
                .setDescription(`Please type a number is positive!`)
            return interaction.followUp({ embeds: [embed] });
        }

        if (!server_queue.songs[number - 1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setTitle(`The queue only have ${server_queue.songs.length} songs!`)
                .setDescription(`Please type a number is in the queue!`)
            return interaction.followUp({ embeds: [embed] });
        }

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor(interaction))
            .setDescription(`\`${server_queue.songs[number - 1]}\` dequeued from queue!`)
            interaction.followUp({ embeds: [embed] })

        return delete server_queue.songs[number - 1]

    }
})