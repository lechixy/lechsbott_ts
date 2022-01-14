import moment from 'moment'
import Discord from 'discord.js'
import { roleColor } from "../../util/lechsFunctions";
import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command';

export default new Command({
    name: `topoldest`,
    aliases: [`oldests`],
    description: 'Gets top 10 oldest members of server!',
    category: 'Utility',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {



        let mem = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => {
            const anumber = new Date(a.user.createdAt).getTime()
            const bnumber = new Date(b.user.createdAt).getTime()
            
            return anumber-bnumber
        }).first(10)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Oldest 10 members in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(roleColor(message))

        mem.map((value, index) => {
            embed.addField(`${index + 1} | ${value.user.tag}`, `${moment(value.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')} (${moment(value.user.createdAt).fromNow()})`)
        })

        message.channel.send({ embeds: [embed] })


    }
})
