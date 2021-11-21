import { Command } from "../../structures/Command";
import Discord from 'discord.js'


export default new Command({
    name: 'fix',
    aliases: ['fixqueue', 'fixplayer'],
    description: 'test cmd',
    category: ['Music'],
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        if (!server_queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`**There is nothing playing on this server**`)
            return message.channel.send({ embeds: [embed] });
        } else {

            queue.delete(message.guild.id)

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Hello there`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**I just deleted the queue, if you have a problem it may fixed**\nOld queue did not have songs so all your queue resetted!`)
            return message.channel.send({ embeds: [embed] });

        }


    }
})

