import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command';
import { roleColor } from "../../util/lechsFunctions";
import Discord, { GuildChannel, GuildMember, TextChannel } from 'discord.js'

export default new Command({
    name: 'lock',
    aliases: ['lockdown', 'lockchannel'],
    description: 'Locks channel and @everyone can\'t send any messages',
    category: 'Moderation',
    arguments: `<true/on | false/off>`,
    userPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    async execute({client, message, args, cmd}) {

        if(message.channel.type !== "GUILD_TEXT") return

        let channel: GuildChannel = message.channel

        let check = channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES")

        if (check === true) {

            channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false })

            const embed = new Discord.MessageEmbed()
                .setDescription(`<#${channel.id}> **channel is locked 🔒**\nMembers can't send any messages to channel until lock turned off`)
            return message.channel.send({ embeds: [embed] });
        } else {
            channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: true })

            const embed = new Discord.MessageEmbed()
                .setDescription(`<#${channel.id}> **channel now unlocked 🔓**\nMembers can send any messages to channel`)
            return message.channel.send({ embeds: [embed] });
        }
    }
})