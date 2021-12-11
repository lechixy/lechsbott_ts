import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name: 'removerole',
    aliases: ['remove-role', 'role-remove'],
    description: 'Removes a role from member',
    category: 'Guild',
    arguments: `<@User | UserID> <@Role | RoleID>`,
    userPermissions: ['MANAGE_ROLES'],
    clientPermissions: ['MANAGE_ROLES'],
    async execute({ client, message, args, cmd }) {


        let user
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = await message.guild.members.cache.get(args[0])
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

        if (!user.roles.cache.find(role => role.name === roleto.name)) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('This user has not that role')
                .setDescription(`You cannot remove a role that does not exist`)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.managed === true) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Can\'t remove this role')
                .setDescription(`This role is a managed role that means, it cannot be manually removed from members`)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }

        if (message.author.id !== message.guild.ownerId && roleto.position >= message.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`Your role is lower from that member`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`You cannot remove the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }
        if (roleto.position >= message.guild.me.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`${client.user.username} role is lower than that role`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`We cannot remove the ${roleto} role to ${user}`)
            return message.channel.send({ embeds: [embed] });
        }

        try {
            user.roles.remove(roleto)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`Removed the ${roleto} role from ${user}`)
            return message.channel.send({ embeds: [embed] });
        } catch (err) {

            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`There was an error removing the role`)
                .setDescription(`Sorry we cannot do that, please try later!`)
            return message.channel.send({ embeds: [embed] });
        }

    }
})

