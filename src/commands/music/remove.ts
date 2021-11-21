import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";
import { PREFIX } from '../../config.json'

export default new Command({
    name: 'dequeue',
    aliases: ['rmv', 'remove'],
    description: 'Dequeues the song from the queue!',
    category: ['Music'],
    arguments: `<queue number for removing song>`,
    async execute({ client, message, args, cmd }) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        if (!server_queue) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`There is nothing playing on this server`)
            return message.channel.send({ embeds: [embed] });
        }

        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`Need to a query to remove song!`)
                .addField(`Usage`, `${PREFIX}${cmd} **<a number: 3 | numbers from queue: 3 5 7>**`)
            return message.channel.send({ embeds: [embed] });
        }
        

        let number = parseInt(args[0])

        if (isNaN(number)) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`The "${args[0]}"" is not a number`)
                .setDescription(`Please type a number to remove song from queue!`)
            return message.channel.send({ embeds: [embed] });
        }

        if (number <= 0) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`The "${args[0]}"" is need to be positive`)
                .setDescription(`Please type a number is positive!`)
            return message.channel.send({ embeds: [embed] });
        }

        if (!server_queue.songs[number - 1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`The queue only have ${server_queue.songs.length} songs!`)
                .setDescription(`Please type a number is in the queue!`)
            return message.channel.send({ embeds: [embed] });
        }

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setDescription(`\`${server_queue.songs[number - 1]}\` dequeued from queue!`)
        message.channel.send({ embeds: [embed] })

        return delete server_queue.songs[number - 1]

    }
})