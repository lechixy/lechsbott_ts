import { Command } from "../../structures/Command";
import { roleColor } from "../../util/lechsFunctions";
import Discord, { Activity, GuildMember } from 'discord.js'
import moment from 'moment'

export default new Command({
    name: "spotify",
    description: "Are you listening anything from Spotify?",
    aliases: ["listening", 'sp'],
    cooldown: 3,
    category: 'Information',
    arguments: `<@User | UserID | none>`,
    async execute({ client, message, args, cmd }) {

        let user: GuildMember
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user.presence?.activities) {
            let tui = new Discord.Embed()
                .setAuthor({name: `${user.user.username} is not online!`, iconURL: `${user.user.displayAvatarURL()}`})
                .setDescription(`We can't show you an offline member activities`)
                .setColor(Discord.Util.resolveColor('RED'))
            return message.channel.send({ embeds: [tui] })
        }

        let status: Discord.Activity
        if (user.presence.activities.find(x => x.id === 'spotify:1' && x.name === 'Spotify')) status = user.presence.activities.find(x => x.id === 'spotify:1' && x.name === 'Spotify')

        if (!status) {
            let tui = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setAuthor({name: `${user.user.tag}`, iconURL: `${user.user.displayAvatarURL()}`})
                .setDescription(`Is not listening Spotify!`)
            return message.channel.send({ embeds: [tui] })
        }

        let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            url = `https://open.spotify.com/track/${status.syncId}`,
            name = status.details,
            artist = status.state,
            timeStart = status.timestamps.start,
            timeEnd = status.timestamps.end,
            timeduration = (parseInt(`${timeStart}`) - parseInt(`${timeEnd}`));

        let timeseconds = moment.duration(timeduration).seconds()
        let timeminutes = moment.duration(timeduration).minutes()

        let spotifyInfo = new Discord.Embed()
            .setColor(Discord.Util.resolveColor('#03fc62'))
            .setAuthor({name: `${user.user.tag}`, iconURL: `${user.user.displayAvatarURL()}`})
            .setThumbnail(image)
            .addFields(
                { name: 'Song', value: name, inline: true },
                { name: 'Artist', value: artist, inline: true },
                { name: 'Duration', value: `${timeminutes}:${timeseconds}`, inline: true },
                { name: 'Listen on Spotify!', value: `[\`${artist} - ${name}\`](${url})`, inline: true })
            .setTimestamp()
        return message.channel.send({ embeds: [spotifyInfo] }).catch(err => console.log(err))
    }
})