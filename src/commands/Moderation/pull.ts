import { Command } from "../../structures/Command";
import { roleColor } from "../../util/lechsFunctions";
import Discord, { GuildMember } from 'discord.js'
import { PREFIX } from '../../config.json'

export default new Command({
    name: 'pull',
    aliases: ["pullmember", 'pullvoice'],
    description: 'Pulls member from other channel to your channel',
    category: 'Moderation',
    arguments: `<@User | UserID>`,
    userPermissions: ['MoveMembers'],
    clientPermissions: ['MoveMembers'],
    async execute({ client, message, args, cmd }) {
        let member: GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        }

        if (!message.member.voice.channel) {
            const memberembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor("Red"))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`You need to be in a voice channel for pull!`)
            return message.channel.send({ embeds: [memberembed] })
        }
        if (!member) {
            const memberembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Wrong arguments are given, mention a member to pull!`)
                .addField({ name: `Usage`, value: `${PREFIX}${cmd} **<@User | Id>**` })
            return message.channel.send({ embeds: [memberembed] })
        }
        if (!member.voice.channel) {
            const memberembed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${member} is not in a voice channel!`)
            return message.channel.send({ embeds: [memberembed] })
        }


        try {
            member.voice.setChannel(message.member.voice.channel)

            let successembed = new Discord.Embed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`<@${member.id}> **is pulled to** <#${message.member.voice.channel.id}>`)
                .setColor(Discord.Util.resolveColor(roleColor(message)))
            return message.channel.send({ embeds: [successembed] })

        } catch (err) {
            console.log(err);
            let embed = new Discord.Embed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`**There is an error while pulling member, please try later!**`)
                .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [embed] })
        }
    }
})