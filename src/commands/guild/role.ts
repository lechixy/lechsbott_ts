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
        } else if(message.guild.roles.cache.find(x => x.name.toLowerCase() === args[0].toLowerCase())) {
            role = message.guild.roles.cache.find(x => x.name.toLowerCase() === args[0].toLowerCase())
        } else {
            role = message.guild.roles.cache.get(args[0])
        }

        if (!role) {
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Wrong arguments are given`)
                .addField({name: `Usage`, value: `${PREFIX}${cmd} **<@Role | RoleID>**`, inline: true})
                .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [embed] });
        }

        let created = moment(role.createdAt).fromNow()
        let swrolesize = message.guild.roles.cache.size

        const embed = new Discord.Embed()
            .setDescription(`${role}`)
            .setTitle(`${role.name}`)
            .setColor(Discord.Util.resolveColor(role.hexColor))
            //fields
            .addField({name: `ID`, value: `${role.id}`, inline: true})
            .addField({name: `Color`, value: `${role.hexColor}`, inline: true})
            .addField({name: `Created on Discord`, value: `${created}`, inline: true})
            .addField({name: `Position (from top)`, value: `${swrolesize-role.position}/${swrolesize}`, inline: true})
            .addField({name: `Has role`, value: `${role.members.size.toLocaleString()} of ${message.guild.members.cache.size.toLocaleString()}`, inline: true})
            .addField({name: `Mentionable`, value: `${role.mentionable ? 'Yes' : 'No'}`, inline: true})
            .addField({name: `Hoisted`, value: `${role.hoist ? 'Yes' : 'No'}`, inline: true})
            .addField({name: `Managed`, value: `${role.managed ? 'Yes' : 'No'}`, inline: true})
            .addField({name: `Booster`, value: `${role.tags?.premiumSubscriberRole ? 'Yes' : 'No'}`, inline: true})
        message.channel.send({ embeds: [embed] });


    }
})