import genius from 'genius-lyrics'
import ytdl from 'ytdl-core'
import Discord from 'discord.js'
import * as embeds from './embeds/all'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    name: 'lyrics',
    description: 'Get the lyrics of the playing song!',
    options: [
        {
            name: "query",
            type: Discord.ApplicationCommandOptionType.String,
            description: "Which song you want get lyrics?",
            required: false
        }
    ],
    async execute({ client, interaction, args }) {

        let emote = client.emojis.cache.get('899299715412291616')

        if (!args.getString('query')) {
            const queue = client.queue
            const server_queue = queue.get(interaction.guild.id)

            if (!server_queue) {
                return interaction.followUp({ embeds: [embeds.noQueue(interaction)] })
            }

            let loading = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(`${emote} **Searching for lyrics...**`)
            interaction.followUp({ embeds: [loading] });

            const media = await ytdl.getInfo(server_queue.songs[0].url)

            let ismedia = media.videoDetails.media?.song

            if (!ismedia) {
                const embed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                    .setTitle(`This video does not contain any songs`)
                    .setDescription(`You can search lyrics manually within passing few arguments`)
                    .addField({name: `Usage`, value: `/lyrics <query: song name/lyrics from song>`})
                return interaction.editReply({ embeds: [embed] });
            }

            let title = `${media.videoDetails.media?.song} - ${media.videoDetails.media?.artist} `

            let apisearch = await client.utils.genius.songs.search(title)

            let song = apisearch[0]
            let lyrics = await song.lyrics()

            if (!lyrics) {
                let errorembed = new Discord.Embed()
                    .setDescription(`**Lyrics is not found with** \`${title}\``)
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                interaction.editReply({ embeds: [errorembed] })
            } else {
                let lyricsEmbed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                    .setThumbnail(song.thumbnail)
                    .setAuthor({ name: `${title}` })
                    .setDescription(`${lyrics.length >= 2048 ? lyrics.substring(0, 2045) + '...' : lyrics}`)
                    .setTimestamp()
                return interaction.editReply({ embeds: [lyricsEmbed] })
            }

        } else {
            const title = args.getString('query')

            let loading = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(`${emote} **Searching for lyrics of ${title}**...`)
            interaction.followUp({ embeds: [loading] });

            let apisearch = await client.utils.genius.songs.search(title)

            let song = apisearch[0]
            let lyrics = await song.lyrics()

            if (!lyrics) {
                let errorembed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                    .setDescription(`**Lyrics is not found!**`)
                interaction.editReply({ embeds: [errorembed] })
            } else {
                let lyricsEmbed = new Discord.Embed()
                    .setAuthor({ name: `${title}` })
                    .setThumbnail(song.thumbnail)
                    .setDescription(`${lyrics.length >= 2048 ? lyrics.substring(0, 2045) + '...' : lyrics}`)
                    .setTimestamp()
                    .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                return interaction.editReply({ embeds: [lyricsEmbed] })
            }
        }


    }
})