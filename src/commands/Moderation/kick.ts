import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command';
import { roleColor } from "../../util/lechsFunctions";
import Discord, { GuildMember } from 'discord.js'

export default new Command({
    name: 'kick',
    description: 'Kicks member from server',
    category: 'Moderation',
    arguments: `<@User | UserID>`,
    userPermissions: ['KICK_MEMBERS'],
    clientPermissions: ['BAN_MEMBERS'],
    async execute({client, message, args, cmd}) {

        let member: GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        }

        if (!member) {
            let membembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(`Please mention a member for ${cmd}!`, message.author.displayAvatarURL({ dynamic: true }))
                .addField(`Usage`, `${PREFIX}${cmd} <@User | UserId>`)
            return message.channel.send({ embeds: [membembed] })
        }
        if (member.id === message.author.id) {
            let membembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`Oops, there is a mistake`)
                .setDescription(`You cannot ${cmd} yourself!`)
            return message.channel.send({ embeds: [membembed] })
        }

        if (member.id === message.guild.me.id) {
            let membembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`Oops, there is a mistake`)
                .setDescription(`I cannot ${cmd} myself!`)
            return message.channel.send({ embeds: [membembed] })
        }

        if (message.author.id !== message.guild.ownerId) {
            let erembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`Oops, there is a mistake`)
                .setTitle(`You cannot ${cmd} guild owner!`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= member.roles.highest.position) {

            let erembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`You can't do that`)
                .setDescription(`Because you either have the same role or your role is lower from ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.guild.me.roles.highest.position <= member.roles.highest.position) {
            let erembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`I cannot ${cmd} this user`)
                .setDescription(`Because i have the same role or your role is lower from ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        return kickUser(message, member, args, Discord)

    }
})

function kickUser(message, member, args, Discord) {

        const reason = args.slice(1).join(" ") || `No reason specified`

        try {

            member.kick({ reason })

            let succesembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**${member.user.tag}** has been kicked from **${message.guild.name}**`)
            message.channel.send({ embeds: [succesembed] })

            member.createDM().then(dm => {

                const embed = new Discord.MessageEmbed()
                    .setTitle(`You have been kicked from ${message.guild.name}`)
                    .addField(`Reason`, `${reason}`, true)
                    .addField(`By`, `${message.author.tag}`, true)
                    .addField(`At`, `<t:${parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0))}>`, true)
                    .setColor('RED')
                dm.send({ embeds: [embed] }).catch(err => { })
            })

        } catch (e) {

            console.log(e)

            message.channel.send({ content: `There was an error while kicking the member, please try later!` })

        }
}