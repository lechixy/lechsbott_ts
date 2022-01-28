import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { getVoiceConnection } from '@discordjs/voice';
import { removeAndClear } from '../../structures/Music/functions/all';
import * as embeds from './embeds/all'
import {SlashCommand} from '../../structures/SlashCommand'


export default new SlashCommand({
    name: 'disconnect',
    description: 'Disconnects from voice channel!',
    async execute({ client, interaction, args}) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        const voice_channel = interaction.member.voice.channel

        if (!voice_channel) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**You need to be in a voice channel to execute this command**`)
            return interaction.followUp({ embeds: [embed] });
        }
        if (!server_queue) {
            try {
                const log = getVoiceConnection(interaction.guild.id);

                if (!log) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor(interaction))
                        .setDescription(`${client.user} is not in a voice channel, you can't use this!`)
                    return interaction.followUp({ embeds: [embed] });
                } else {
                    log.disconnect()
                    log.destroy(true);

                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor(interaction))
                        .setDescription(`**Succesfully disconnected from** \`${interaction.member.voice.channel.name}\``)
                    return interaction.followUp({ embeds: [embed] });
                }

            } catch (err) {
                console.log(err)
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(interaction))
                    .setDescription(`**There was an error on disconnecting, please try later!**`)
                return interaction.followUp({ embeds: [embed] });
            }
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                return interaction.followUp({ embeds: [embeds.sameChannel(interaction)] });
            }

            removeAndClear(interaction.guild.id, true)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**Succesfully disconnected from** \`${interaction.member.voice.channel.name}\``)
            return interaction.followUp({ embeds: [embed] });
        }
    }
})