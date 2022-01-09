import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'pause',
    description: 'Pauses the audio player and musics stop!',
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

        const lechplayer = server_queue.audioPlayer

        try {
            if(lechplayer.state.status === 'playing'){
                lechplayer.pause()
    
                const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**⏸️ Paused**`)
                return interaction.followUp({ embeds: [embed] });
            } else if(lechplayer.state.status === 'paused') {
                const embed = new Discord.MessageEmbed()
                .setColor(roleColor(interaction))
                .setDescription(`**⏸️ Already paused**`)
                return interaction.followUp({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err)

            const embed = new Discord.MessageEmbed()
            .setColor(roleColor(interaction))
            .setDescription(`There is an error trying to pause player, try later!`)
            return interaction.followUp({ embeds: [embed] });
        }


    }
})