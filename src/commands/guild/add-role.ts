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
    userPermissions: ['MANAGE_ROLES'],
    clientPermissions: ['MANAGE_ROLES'],
    async execute({ client, message, args, cmd }) {

        let user
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        }

        if (!user) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Wrong arguments are given`)
                .addField(`Usage`, `${PREFIX}${cmd} **<@User | UserID>** <@Role | RoleID>`, true)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }

        let roleto
        if (message.mentions.roles.first()) {
            roleto = message.mentions.roles.first()
        } else if (args[0]) {
            user = await message.guild.roles.cache.get(args[0])
        }

        if (!roleto) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Wrong arguments are given`)
                .addField(`Usage`, `${PREFIX}${cmd} <@User | UserID> **<@Role | RoleID>**`, true)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }

        if (user.roles.cache.some(role => role.name === roleto.name)) {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('This user already has that role')
                .setDescription(`You cannot add already an existing role`)
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.managed === true) {
            const embed = new Discord.MessageEmbed()
                .setTitle('We can\'t add this role')
                .setDescription(`This role is a managed role that means, it cannot be manually assigned to members`)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }

        if (message.author.id !== message.guild.ownerId && roleto.position >= message.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`Your role is lower from that member`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`You cannot add the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.position >= message.guild.me.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`${client.user.username} role is lower than that role`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`We cannot add the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }

        try {
            user.roles.add(roleto)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`Added the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        } catch (err) {

            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`There was an error adding the role`)
                .setDescription(`Sorry we cannot do that, please try later!`)
            return message.channel.send({ embeds: [embed] });
        }

    }
})