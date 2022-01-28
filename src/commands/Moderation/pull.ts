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
    userPermissions: ['MOVE_MEMBERS'],
    clientPermissions: ['MOVE_MEMBERS'],
    async execute({ client, message, args, cmd }) {
        const user = message.member;

        let member: GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        }


        if (!message.member.voice.channel) {
            const memberembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(`You need to be in a voice channel!`, user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Cause how can we pull the member an unknown channel?`)
            return message.channel.send({ embeds: [memberembed] })
        }
        if (!member) {
            const memberembed = new Discord.MessageEmbed()
                .setAuthor(`Please mention a member to pull!`, user.displayAvatarURL({ dynamic: true }))
                .addField(`Usage`, `${PREFIX}${cmd} **<@User | Id>**`)
                .setColor(roleColor(message))
                .setDescription(`We need an user to pull member to your channel`)
            return message.channel.send({ embeds: [memberembed] })
        }
        if (!member.voice.channel) {
            const memberembed = new Discord.MessageEmbed()
                .setAuthor(`This user is not in a voice channel!`, member.displayAvatarURL({ dynamic: true }))
                .setDescription(`You cannot pull a member is not in a voice channel!`)
                .setColor(roleColor(message))
            return message.channel.send({ embeds: [memberembed] })
        }


        try {
            member.voice.setChannel(message.member.voice.channel)

            let successembed = new Discord.MessageEmbed()
                .setDescription(`<@${member.id}> **is pulled to** <#${message.member.voice.channel.id}>`)
                .setColor(roleColor(message))
            return message.channel.send({ embeds: [successembed] })

        } catch (err) {
            console.log(err);
            let embed = new Discord.MessageEmbed()
                .setDescription(`**There is an error while pulling member**`)
                .setColor(roleColor(message))
            return message.channel.send({ embeds: [embed] })
        }
    }
})