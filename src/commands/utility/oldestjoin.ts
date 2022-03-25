import moment from 'moment'
import { roleColor } from '../../util/lechsFunctions'
import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'

export default new Command({
    name: `oldestcreated`,
    description: 'Gets oldest member of server!',
    category: 'Utility',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {


        let mem = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => {

            const anumber = new Date(a.joinedAt).getTime()
            const bnumber = new Date(b.joinedAt).getTime()
            
            return anumber-bnumber
        }).first()

        const embed = new Discord.Embed()
            .setAuthor({name: `Oldest join in ${message.guild.name}`, iconURL: message.guild.iconURL()})
            .setThumbnail(mem.user.displayAvatarURL())
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setDescription(`${mem}`)
            .addField({name: `Tag`, value: `${mem.user.tag}`})
            .addField({name: `ID`, value: `${mem.id}`})
            .addField({name: `Joined At`, value: `${moment(mem.joinedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`})
            .addField({name: `From now`, value: `${moment(mem.joinedAt).fromNow()}`})
        message.channel.send({ embeds: [embed] })
    }
})