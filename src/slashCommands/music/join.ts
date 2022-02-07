import { joinVoiceChannel, entersState, VoiceConnectionStatus } from '@discordjs/voice'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'join',
    description: 'Make lechsbott join to your channel!',
    async execute({ client, interaction, args }) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        const voiceChannel = interaction.member.voice.channel

        if (!voiceChannel) {
            return interaction.followUp({ embeds: [embeds.noVoiceChannel(interaction)] });
        } else {

            if (server_queue) {

                if (voiceChannel.id !== server_queue.voiceChannel.id) {
                    return interaction.followUp({ embeds: [embeds.sameChannel(interaction)] });
                }
            }

            let joiner = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            try {
                await entersState(
                    joiner,
                    VoiceConnectionStatus.Ready,
                    20000
                );
            } catch {
                const embed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                    .setDescription(`**Failed to join voice channel within 20 seconds, please try again later!**`);
                interaction.followUp({ embeds: [embed] });
                return;
            }

            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(`**lechsbott** successfully joined to <#${voiceChannel.id}>`)
            interaction.followUp({ embeds: [embed] });
        }
    }
})

