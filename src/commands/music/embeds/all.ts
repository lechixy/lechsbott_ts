import Discord from 'discord.js'
import { ExtendedMessage } from '../../../typings/Command'
import { roleColor } from '../../../util/lechsFunctions'

export function sameChannel(message: ExtendedMessage){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setAuthor(`There is currently playing a song on another voice channel`, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`Need to be in same voice channel with lechsbott`)

    return embed
}