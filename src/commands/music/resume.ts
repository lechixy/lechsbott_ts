import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";

export default new Command({
    name: 'resume',
    description: 'Resumes the audio player',
    category: ['Music'],
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        const voice_channel = message.member.voice.channel

        if (!voice_channel) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**You need to be in a voice channel to execute this command**`)
            return message.channel.send({ embeds: [embed] });
        }
        if (!server_queue) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**There is nothing playing on this server**`)
            return message.channel.send({ embeds: [embed] });
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setTitle(`You need to be in same voice channel with lechsbott`)
                    .setDescription(`Sorry but you can't use pause, please make sure you're on the same channel as lechsbott`)
                return message.channel.send({ embeds: [embed] });
            }
        }

        const lechplayer = server_queue.audioPlayer

        try {
            if(lechplayer.state.status === 'paused'){
                lechplayer.unpause()
    
                const embed = new Discord.MessageEmbed()
                .setDescription(`**▶️ Resuming**`)
                .setColor(roleColor(message))
                return message.channel.send({ embeds: [embed] });
            } else if(lechplayer.state.status === 'playing') {
                const embed = new Discord.MessageEmbed()
                .setDescription(`**▶️ Already playing**`)
                .setColor(roleColor(message))
                return message.channel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err)

            const embed = new Discord.MessageEmbed()
            .setDescription(`There is an error trying to resume player, try later!`)
            .setColor(roleColor(message))
            return message.channel.send({ embeds: [embed] });
        }


    }
})