import finder from 'lyrics-parse'
import ytdl from 'ytdl-core'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";

export default new Command({
    name: 'lyrics',
    description:'Get the lyrics of playing music!',
    category: 'Music',
    arguments: `<Song name | Part from song | none>`,
    async execute({client, message, args, cmd}) {

        let emote = client.emojis.cache.get('899299715412291616')

        if (!args[0]) {
            const queue = client.queue
            const server_queue = queue.get(message.guild.id)

            if (!server_queue) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`**There is nothing playing on this server**`)
                return message.channel.send({ embeds: [embed] });
            }

            let loading = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`${emote} **Searching for lyrics...**`)
            const m = await message.channel.send({ embeds: [loading] });

            const media = await ytdl.getInfo(server_queue.songs[0].url)

            let ismedia = media.videoDetails.media?.song

            if (!ismedia) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setTitle(`**This video does not contain any songs**`)
                    .setDescription(`You can search lyrics manually within passing few arguments`)
                    .addField(`Usage`, `l!${cmd} <song name/lyrics from song>`)
                return m.edit({ embeds: [embed] });
            }

            let title = `${media.videoDetails.media?.song} - ${media.videoDetails.media?.artist} `

            let lyrics = await finder(title, "");

            if (!lyrics) {
                let errorembed = new Discord.MessageEmbed()
                    .setDescription(`**Lyrics is not found with** \`${title}\``)
                    .setColor(roleColor(message))
                m.edit({ embeds: [errorembed] })
            } else {
                let lyricsEmbed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(`${title}`)
                    .setDescription(lyrics)
                    .setTimestamp()

                if (lyricsEmbed.description.length >= 2048)
                    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
                return m.edit({ embeds: [lyricsEmbed] })
            }

        } else {
            const title = args.join(" ")

            let loading = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`${emote} **Searching for lyrics of ${title}**...`)
            const m = await message.channel.send({ embeds: [loading] });

            const lyrics = await finder(title, "");

            if (!lyrics) {
                let errorembed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`**Lyrics is not found!**`)
                m.edit({ embeds: [errorembed] })
            } else {
                let lyricsEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${title}`)
                    .setDescription(lyrics)
                    .setTimestamp()
                    .setColor(roleColor(message))

                if (lyricsEmbed.description.length >= 2048)
                    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
                return m.edit({ embeds: [lyricsEmbed] })
            }
        }


    }
})