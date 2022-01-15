import { Command } from "../../structures/Command";
import { roleColor } from "../../util/lechsFunctions";
import Discord, { Role } from 'discord.js'
import { PREFIX } from '../../config.json'
import moment from 'moment'


export default new Command({
    name: "role",
    aliases: ['roleis'],
    description: 'What is that role?',
    category: 'Guild',
    arguments: `<@Role | RoleID | none>`,
    async execute({ client, message, args, cmd }) {

        let role: Role
        if (message.mentions.roles.first()) {
            role = message.mentions.roles.first()
        } else if(message.guild.roles.cache.find(x => x.name === args[0])) {
            role = message.guild.roles.cache.find(x => x.name === args[0])
        } else {
            role = message.guild.roles.cache.get(args[0])
        }

        if (!role) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Wrong arguments are given`)
                .addField(`Usage`, `${PREFIX}${cmd} **<@Role | RoleID>**`, true)
                .setColor('RED')
            return message.channel.send({ embeds: [embed] });
        }

        let created = moment(role.createdAt).fromNow()
        let swrolesize = message.guild.roles.cache.size

        const embed = new Discord.MessageEmbed()
            .setDescription(`${role}`)
            .setTitle(`${role.name}`)
            .setColor(role.hexColor)
            //fields
            .addField(`ID`, `${role.id}`, true)
            .addField(`Color`, `${role.hexColor}`, true)
            .addField(`Created on Discord`, `${created}`, true)
            .addField(`Position (from top)`, `${swrolesize-role.position}/${swrolesize}`, true)
            .addField(`Has role`, `${role.members.size.toLocaleString()} of ${message.guild.members.cache.size.toLocaleString()}`, true)
            .addField(`Mentionable`, `${role.mentionable ? 'Yes' : 'No'}`, true)
            .addField(`Hoisted`, `${role.hoist ? 'Yes' : 'No'}`, true)
            .addField(`Managed`, `${role.managed ? 'Yes' : 'No'}`, true)
            .addField(`Booster`, `${role.tags?.premiumSubscriberRole ? 'Yes' : 'No'}`, true)
        message.channel.send({ embeds: [embed] });


    }
})