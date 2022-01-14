import Discord from 'discord.js'
import { SlashCommand } from "../../structures/SlashCommand";
import { roleColor } from '../../util/lechsFunctions';
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'skip',
    description: 'Skips tracks and play next one if available!',
    async execute({client, interaction, args}) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        const voice_channel = interaction.member.voice.channel

        if (!voice_channel) {
            return interaction.followUp({ embeds: [embeds.noVoiceChannel(interaction)] });
        }
        if (!server_queue) {
                return interaction.followUp({ embeds: [embeds.noQueue(interaction)] });
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                return interaction.followUp({ embeds: [embeds.sameChannel(interaction)] });
            }
        }

        if (!server_queue.songs[1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**There is no song to skip after this song in the queue**`)
            return interaction.followUp({ embeds: [embed] });
        }

        try {
            server_queue.audioPlayer.stop(true);

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**Skipped to** \`${server_queue.songs[0].title}\``)
            return interaction.followUp({ embeds: [embed] });
        } catch (err) {
            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**There was an error on skipping try later!**`)
            return interaction.followUp({ embeds: [embed] });
        }
    }
})