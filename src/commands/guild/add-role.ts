import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name: 'addrole',
    aliases: ['add-role', 'role-add'],
    description: 'Adds a role to member',
    category: 'Guild',
    arguments: `<@User | UserID> <@Role | RoleID>`,
    userPermissions: ['ManageRoles'],
    clientPermissions: ['ManageRoles'],
    async execute({ client, message, args, cmd }) {

        let user
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        }

        if (!user) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Wrong arguments are given`)
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<@User | UserID>** <@Role | RoleID>`, inline: true})
                .setColor(Discord.Util.resolveColor('RED'))
            return message.channel.send({ embeds: [embed] });
        }

        let roleto
        if (message.mentions.roles.first()) {
            roleto = message.mentions.roles.first()
        } else if (args[0]) {
            roleto = message.guild.roles.cache.get(args[0])
        }

        if (!roleto) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Wrong arguments are given`)
                .addField({name: `Usage`, value: `${PREFIX}${cmd} <@User | UserID> **<@Role | RoleID>**`, inline: true})
                .setColor(Discord.Util.resolveColor('RED'))
            return message.channel.send({ embeds: [embed] });
        }

        if (user.roles.cache.some(role => role.name === roleto.name)) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setTitle('This user already has that role')
                .setDescription(`You cannot add already an existing role`)
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.managed === true) {
            const embed = new Discord.Embed()
                .setTitle('We can\'t add this role')
                .setDescription(`This role is a managed role that means, it cannot be manually assigned to members`)
                .setColor(Discord.Util.resolveColor('RED'))
            return message.channel.send({ embeds: [embed] });
        }

        if (message.author.id !== message.guild.ownerId && roleto.position >= message.member.roles.highest.position) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setAuthor({name: `Your role is lower from that member`, iconURL: message.author.displayAvatarURL()})
                .setDescription(`You cannot add the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.position >= message.guild.me.roles.highest.position) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setAuthor({name: `${client.user.username} role is lower than that role`, iconURL: message.author.displayAvatarURL()})
                .setDescription(`We cannot add the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }

        try {
            user.roles.add(roleto)
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .setDescription(`Added the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        } catch (err) {

            console.log(err)
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('RED'))
                .setTitle(`There was an error adding the role`)
                .setDescription(`Sorry we cannot do that, please try later!`)
            return message.channel.send({ embeds: [embed] });
        }

    }
})