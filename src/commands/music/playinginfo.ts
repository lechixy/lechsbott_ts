import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";

export default new Command({
    name: 'playinginfo',
    aliases: ['announcement', 'announcements'],
    description:'Disable or enable playing embed from lechsbott!',
    category: ['Music'],
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        if (!server_queue) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**There is nothing playing on this server**`)
            return message.channel.send({ embeds: [embed] });
        }

        if(server_queue.playingInfo === true){
            server_queue.playingInfo = false
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**Playing info is now disabled**\nTracks playing info won't be send until you enable that`)
            return message.channel.send({ embeds: [embed] });
        } else {
            server_queue.playingInfo = true
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**Playing info is now enabled**\nTracks playing info will be send`)
            return message.channel.send({ embeds: [embed] });
        }

    }
})