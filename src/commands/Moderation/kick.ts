import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command';
import { roleColor, toDiscordTimestamp } from "../../util/lechsFunctions";
import Discord, { GuildMember } from 'discord.js'

export default new Command({
    name: 'kick',
    description: 'Kicks member from server',
    category: 'Moderation',
    arguments: `<@User | UserID>`,
    userPermissions: ['KickMembers'],
    clientPermissions: ['KickMembers'],
    async execute({client, message, args, cmd}) {

        let member: GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        }

        if (!member) {
            let membembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Please tag or type an user id to use kick!`)
                .addField({name: `Usage`, value: `${PREFIX}${cmd} <@User | UserId>`})
            return message.channel.send({ embeds: [membembed] })
        }
        if (member.id === message.author.id) {
            let membembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You cannot kick yourself!`)
            return message.channel.send({ embeds: [membembed] })
        }

        if (member.id === message.guild.me.id) {
            let membembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`I cannot kick myself!`)
            return message.channel.send({ embeds: [membembed] })
        }

        if (message.author.id !== message.guild.ownerId) {
            let erembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`You cannot kick guild owner!`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position === member.roles.highest.position) {

            let erembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You can't do that because you have the same role with ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position < member.roles.highest.position) {

            let erembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You can't do that because you have lower role from ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.guild.me.roles.highest.position === member.roles.highest.position) {
            let erembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`I can't kick ${member} because i have the same role with ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        if (message.guild.me.roles.highest.position < member.roles.highest.position) {
            let erembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`I can't kick ${member} because i have lower role from ${member}`)
            return message.channel.send({ embeds: [erembed] })
        }

        return kickUser(message, member, args, Discord)

    }
})

function kickUser(message, member, args, Discord) {

        const reason = args.slice(1).join(" ") || `No reason specified`

        try {

            member.kick({ reason })

            let succesembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .setDescription(`**${member.user.tag}** has been kicked from **${message.guild.name}**`)
            message.channel.send({ embeds: [succesembed] })

            member.createDM().then(dm => {

                const embed = new Discord.Embed()
                    .setTitle(`You have been kicked from ${message.guild.name}`)
                    .addField(`Reason`, `${reason}`, true)
                    .addField(`By`, `${message.author.tag}`, true)
                    .addField(`At`, `${toDiscordTimestamp()}`)
                    .setColor('Red')
                dm.send({ embeds: [embed] }).catch(err => { })
            })

        } catch (e) {

            console.log(e)

            message.channel.send({ content: `There was an error while kicking the member, please try later!` })

        }
}