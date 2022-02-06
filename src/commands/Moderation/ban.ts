import { roleColor, toDiscordTimestamp } from "../../util/lechsFunctions"
import { PREFIX } from '../../config.json'
import { Command } from "../../structures/Command"
import Discord, { GuildMember } from 'discord.js'
import { ExtendedMessage } from "../../typings/Command"

export default new Command({
    name: 'ban',
    description: 'Bans user from the server',
    category: 'Moderation',
    arguments: `<@User | User ID>`,
    userPermissions: ['BanMembers'],
    clientPermissions: ['BanMembers'],
    async execute({ client, message, args, cmd }) {
        const user = message.author;
        let member
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = await message.guild.members.cache.get(args[0])
        }

        if (!member) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Wrong arguments are given, need a person to ban!`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person: required>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        if (member.id === message.author.id) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You can't ban yourself`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        if (member.id === message.guild.me.id) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`I can't ban myself`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        if (member.id === message.guild.ownerId) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You can't ban server owner`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        if (message.author.id !== message.guild.ownerId && message.member.roles.highest.position <= member.roles.highest.position) {

            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You can't ban because either have the same role or your role is lower from ${member}`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        if (message.guild.me.roles.highest.position <= member.roles.highest.position) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`I can't ban this member because have the same role or my role is lower from ${member}`)
                .setColor(Discord.Util.resolveColor('Red'))
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<person>** [reason]`, inline: true})
            return message.channel.send({ embeds: [embed] })
        }

        return banUser(message, member, args)
    }
})

function banUser(message: ExtendedMessage, member: GuildMember, args: string[]) {

    const reason = args.slice(1).join(" ") || `No reason specified`

    try {

        member.ban({ reason })


        let succesembed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription(`**${member.user.tag}** has been banned from **${message.guild.name}**`)
            .setImage(`https://c.tenor.com/ixtZFk44cMcAAAAC/discord-banhammer.gif`)
        message.channel.send({ embeds: [succesembed] })

        member.createDM().then(dm => {

            const embed = new Discord.Embed()
                .setTitle(`You have been banned from ${message.guild.name}`)
                .addField({name: `Reason`, value: `${reason}`})
                .addField({name: 'Moderator', value: `${message.author.tag}`})
                .addField({name: `At`, value: `${toDiscordTimestamp()}`})
                .setColor(Discord.Util.resolveColor('Red'))
            dm.send({ embeds: [embed] }).catch(err => { })
        })

    } catch (e) {

        console.log(e)

        const embed = new Discord.Embed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription(`There was an error while banning the member, please try later!`)
            .setColor(Discord.Util.resolveColor('Red'))
        return message.channel.send({ embeds: [embed] })
    }
}
