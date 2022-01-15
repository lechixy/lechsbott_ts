import moment from 'moment'
import { roleColor } from '../../util/lechsFunctions'
import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'

export default new Command({
    name: `oldest`,
    description: 'Gets oldest member of server!',
    category: 'Utility',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {


        let mem = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => {

            const anumber = new Date(a.user.createdAt).getTime()
            const bnumber = new Date(b.user.createdAt).getTime()
            
            return anumber-bnumber
        }).first()

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Oldest member in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setTitle(mem.user.tag)
            .setColor(roleColor(message))
            .setThumbnail(mem.user.displayAvatarURL({dynamic: true}))
            .setDescription(`${mem}`)
            .addField(`ID`, `${mem.id}`)
            .addField(`Created At`, `${moment(mem.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`)
            .addField(`From now`, `${moment(mem.user.createdAt).fromNow()}`)
        message.channel.send({ embeds: [embed] })
    }
})