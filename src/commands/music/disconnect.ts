import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";
import { getVoiceConnection } from '@discordjs/voice';
import { removeAndClear } from '../../structures/Music/functions/all';
import * as embeds from './embeds/all'

export default new Command({
    name: 'disconnect',
    aliases: ['dc', 'leave'],
    description: 'Disconnects from voice channel!',
    category: 'Music',
    arguments: `<none>`,
    async execute({ client, message, args, cmd }) {

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
            try {
                const log = getVoiceConnection(message.guild.id);

                if (!log) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor(message))
                        .setDescription(`${client.user} is not in a voice channel, you can't use this!`)
                    return message.channel.send({ embeds: [embed] });
                } else {
                    log.disconnect()
                    log.destroy(true);

                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor(message))
                        .setDescription(`**Succesfully disconnected from** \`${message.member.voice.channel.name}\``)
                    return message.channel.send({ embeds: [embed] });
                }

            } catch (err) {
                console.log(err)
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`**There was an error on disconnecting, please try later!**`)
                return message.channel.send({ embeds: [embed] });
            }
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                return message.channel.send({ embeds: [embeds.sameChannel(message)] });
            }

            removeAndClear(message.guild.id, true)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**Succesfully disconnected from** \`${message.member.voice.channel.name}\``)
            return message.channel.send({ embeds: [embed] });
        }
    }
})