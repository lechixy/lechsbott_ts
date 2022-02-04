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
    async execute({ client, message, args, cmd }) {

        let user: Discord.GuildMember
        if (message?.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user.presence?.activities) {
            let tui = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setAuthor({ name: `${user.user.username} is not online!`, iconURL: `${user.user.displayAvatarURL()}` })
                .setDescription(`We can't show you an offline member activities`)
            return message.channel.send({ embeds: [tui] })
        }

        let status: Discord.Activity
        if (user.presence.activities.find(x => x.id === 'spotify:1' && x.name === 'Spotify')) status = user.presence.activities.find(x => x.id === 'spotify:1' && x.name === 'Spotify')

        if (message.author.id === user.id) {
            let tui = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('#03fc62'))
                .setAuthor({ name: `You are not listening Spotify!`, iconURL: `${user.user.displayAvatarURL()}` })
                .setDescription(`Are you has an activity?`)
            return message.channel.send({ embeds: [tui] })
        }

        if(message.author.id !== user.id) {
            let tui = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('#03fc62'))
                .setAuthor({ name: `${user.user.username} is not listening Spotify!`, iconURL: `${user.user.displayAvatarURL()}` })
                .setDescription(`Can you check this user has an activity?`)
            return message.channel.send({ embeds: [tui] })
        }

        let image = `https://i.scdn.co/image/${status.assets?.largeImage.slice(8)}`,
            url = `https://open.spotify.com/track/${status.syncId}`,
            name = status.details,
            artist = status.state

        let loading = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setDescription(`<a:loading:846030612254687253> **Searching for lyrics...**`)
        const m = await message.channel.send({ embeds: [loading] });

        let title = `${artist} ${name}`

        let api = client.utils.genius
        let lyrics = await api.songs.search(title).then(x => x[0].lyrics(true))

        if (!lyrics) {
            let errorembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .setDescription(`**Lyrics is not found!**`)
            m.edit({ embeds: [errorembed] }).catch(err => console.error(err));
        } else {
            let lyricsEmbed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .setTitle(`Lyrics of ${artist} - ${name}`)
                .setThumbnail(image)
                .setDescription(`${lyrics.length >= 2048 ? `${lyrics.substring(0, 2045)}...` : `${lyrics}`}`)
                .setTimestamp()

            return m.edit({ embeds: [lyricsEmbed] }).catch(err => console.error(err));
        }

    }
})