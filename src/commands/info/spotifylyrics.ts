import lyricsfinder from 'lyrics-parse'
import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name: "spotifylyrics",
    description: "Are you listening?",
    aliases: ["listeninglyrics", "slyrics"],
    cooldown: 3,
    category: 'Information',
    arguments: `<@User | UserID | none>`,
    async execute({client, message, args, cmd}) {

        let user
        if (message?.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user.presence?.activities) {
            let tui = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(`${user.user.username} is not online!`, `${user.user.displayAvatarURL()}`)
                .setDescription(`We can't show you an offline member activities`)
            return message.channel.send({ embeds: [tui] })
        }

        let status;
        if (user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];

        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            if (message.author.id === user.id) {
                let tui = new Discord.MessageEmbed()
                    .setColor('#03fc62')
                    .setAuthor(`You are not listening Spotify!`, `${user.user.displayAvatarURL()}`)
                    .setDescription(`Can you check you has an activity?`)
                return message.channel.send({ embeds: [tui] })
            } else {
                let tui = new Discord.MessageEmbed()
                    .setColor('#03fc62')
                    .setAuthor(`${user.user.username} is not listening Spotify!`, `${user.user.displayAvatarURL()}`)
                    .setDescription(`Can you check this user has an activity?`)
                return message.channel.send({ embeds: [tui] })
            }
        }

        if (status !== null && status.type === "LISTENING" && status.name === "Spotify" && status.assets !== null) {
            let image = `https://i.scdn.co/image/${status.assets?.largeImage.slice(8)}`,
                url = `https://open.spotify.com/track/${status.syncId}`,
                name = status.details,
                artist = status.state

            let loading = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`<a:loading:846030612254687253> **Searching for lyrics...**`)
            const m = await message.channel.send({ embeds: [loading] });

            let title = `${artist} - ${name}`

            let lyrics = await lyricsfinder(title, "");

            if (!lyrics) {
                let errorembed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`**Lyrics is not found!**`)
                m.edit({ embeds: [errorembed] })
            } else {
                let lyricsEmbed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setTitle(`Lyrics of ${title}`)
                    .setThumbnail(image)
                    .setDescription(lyrics)
                    .setTimestamp()

                if (lyricsEmbed.description.length >= 2048)
                    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
                return m.edit({ embeds: [lyricsEmbed] }).catch(err => console.error(err));
            }
        }
    }
})