import { PREFIX } from '../../config.json'
import * as Voice from '@discordjs/voice'
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
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setAuthor(`You need to be on a voice channel for lechsbott to join!`, interaction.member.displayAvatarURL({ dynamic: true }))
                .setDescription(`Want **lechsbott** to join a specified voice channel?`)
                .addField('Just use', `${PREFIX}jointo <channel name>`)
            return interaction.followUp({ embeds: [embed] });
        } else {

            if (server_queue) {

                if (voiceChannel.id !== server_queue.voiceChannel.id) {
                    return interaction.followUp({ embeds: [embeds.sameChannel(interaction)] });
                }
            }

            let joiner = Voice.joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            try {
                await Voice.entersState(
                    joiner,
                    Voice.VoiceConnectionStatus.Ready,
                    20000
                );
            } catch {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(interaction)).setDescription(
                        `**Failed to join voice channel within 20 seconds, please try again later!**`
                    );
                interaction.followUp({ embeds: [embed] });
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**lechsbott** successfully joined to <#${voiceChannel.id}>`)
            interaction.followUp({ embeds: [embed] });
        }
    }
})

