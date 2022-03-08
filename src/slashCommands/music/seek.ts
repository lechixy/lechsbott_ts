import Discord, { ApplicationCommandOptionType } from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'seek',
    description: 'Seeks the song in player!',
    options: [
        {
            name: 'time',
            description: 'Which time you want to seek?',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async execute({ client, interaction, args }) {

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
        if (server_queue.isPlaying === false) {
            return interaction.followUp({ embeds: [embeds.noQueue(interaction)] });
        }

        try {

            let syntax = args.getString('time')

            server_queue.status = "seeking"
            const request = server_queue.songs[0].setSeekTime(syntax)
            if (request === true) {
                server_queue.stop()

                const embed = new Discord.Embed()
                    .setDescription(`**Seeked to** \`${syntax}\` **at track** \`${server_queue.songs[0].title}\``)
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                return interaction.followUp({ embeds: [embed] })
            } else {
                const embed = new Discord.Embed()
                    .setAuthor({ name: interaction.author.tag, iconURL: interaction.author.displayAvatarURL() })
                    .setDescription(`Time syntax is can't be like this: ${syntax}`)
                    .setColor(Discord.Util.resolveColor('Red'))
                    .addField({ name: `Usage`, value: `**<person>** [reason]`, inline: true })
                return interaction.followUp({ embeds: [embed] })
            }

        } catch (err) {
            console.log(err)
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setDescription(`**There was an error on seeking try later!**`)
            return interaction.followUp({ embeds: [embed] });
        }


    }
})