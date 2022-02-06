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
    userPermissions: ['ManageChannels'],
    clientPermissions: ['ManageChannels'],
    async execute({client, message, args, cmd}) {

        if(message.channel.type !== 0) return

        let channel: GuildChannel = message.channel

        let check = channel.permissionsFor(message.guild.roles.everyone).has("SendMessages")

        if (check === true) {

            await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false }).catch(err => catchError(err))

            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`${channel.name} is locked!`)
                .setDescription(`Members can't send any messages to channel until lock turned off`)
                .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [embed] });
        } else {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true }).catch(err => catchError(err))

            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`${channel.name} is unlocked!`)
                .setDescription(`Members can send any messages to channel`)
                .setColor(Discord.Util.resolveColor('Green'))
            return message.channel.send({ embeds: [embed] });
        }
    }
})

function catchError(error) {
    console.log('LOCK CHANNEL | ', error)
    return
}