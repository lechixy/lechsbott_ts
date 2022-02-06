import { converToCode, roleColor } from '../../util/lechsFunctions'
import moment from 'moment'
import {PREFIX} from '../../config.json'
import prefixSchema from '../../database/models/saidPrefix'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'

export default new Command({
    name: 'stats',
    description: 'Get lechsbott global stats!',
    category: 'lechsbott',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {


        const b = await prefixSchema.find({})

        let totalsaids = 0
        b.forEach(xy => {
            return totalsaids += xy.timeSaid
        })

        const readyOn = moment(client.readyAt).format('dddd, MMMM Do YYYY, h:mm:ss a');

        let totalmembers = 0
        client.guilds.cache.each(guild => totalmembers += guild.memberCount)

        let first = `\n<userID: ${message.author.id}>\n<channelID: ${message.channel.id}>\n<guildID: ${message.guild.id}>`
        let second = `\n<totalSaid: ${totalsaids}>\n<lechsUsers: ${b.length}>`
        let third = `\n<Guilds: ${client.guilds.cache.size}>\n<Channels: ${client.channels.cache.size}>\n<Users: ${totalmembers}>`
        let fourth = `\n<Ping: ${Date.now() - message.createdTimestamp}ms>\n<LastUpdated: ${readyOn}>\n<Uptime: ${client.uptime}>`

        const embed = new Discord.Embed()
            .setAuthor({name: `Global Stats`, iconURL: message.author.displayAvatarURL()})
            .setDescription(`How many numbers are there? Need to help about bot use \`${PREFIX}help\``)
            .addField({name: `This Guild`, value: `${converToCode(first, 'md')}`})
            .addField({name: `Global information`, value: `${converToCode(second, 'md')}`})
            .addField({name: `Bot information`, value: `${converToCode(third, 'md')}${converToCode(fourth, 'md')}`})
            .setTimestamp()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
        message.channel.send({ embeds: [embed] });

    }
})