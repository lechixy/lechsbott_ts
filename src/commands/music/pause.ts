import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";
import * as embeds from './embeds/all'

export default new Command({
    name: 'pause',
    description: 'Pauses the audio player!',
    category: 'Music',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        const voice_channel = message.member.voice.channel

        if (!voice_channel) {
            return message.channel.send({ embeds: [embeds.noVoiceChannel(message)] });
        }
        if (!server_queue) {
            return message.channel.send({ embeds: [embeds.noQueue(message)] });
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                return message.channel.send({ embeds: [embeds.sameChannel(message)] });
            }
        }

        const lechplayer = server_queue.audioPlayer

        try {
            if(lechplayer.state.status === 'playing'){
                lechplayer.pause()
    
                const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**⏸️ Paused**`)
                return message.channel.send({ embeds: [embed] });
            } else if(lechplayer.state.status === 'paused') {
                const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**⏸️ Already paused**`)
                return message.channel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err)

            const embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setDescription(`There is an error trying to pause player, try later!`)
            return message.channel.send({ embeds: [embed] });
        }


    }
})