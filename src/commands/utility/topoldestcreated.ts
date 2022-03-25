import moment from 'moment'
import Discord from 'discord.js'
import { roleColor } from "../../util/lechsFunctions";
import { Command } from '../../structures/Command';

export default new Command({
    name: `topoldest`,
    aliases: [`oldests`],
    description: 'Gets top 10 oldest members of server!',
    category: 'Utility',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        let countofmembers = 10

        let mem = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => {
            const anumber = new Date(a.user.createdAt).getTime()
            const bnumber = new Date(b.user.createdAt).getTime()
            
            return anumber-bnumber
        }).first(countofmembers)

        const embed = new Discord.Embed()
            .setAuthor({name: `Oldest ${countofmembers} joiners in ${message.guild.name}`, iconURL: message.guild.iconURL()})
            .setColor(Discord.Util.resolveColor(roleColor(message)))

        mem.map((value, index) => {
            embed.addField({name: `${index + 1} | ${value.user.tag}`, value: `${moment(value.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')} (${moment(value.user.createdAt).fromNow()})`})
        })

        message.channel.send({ embeds: [embed] })


    }
})
