import Discord from 'discord.js'
import { ExtendedMessage } from '../../../typings/Command'
import { roleColor } from '../../../util/lechsFunctions'

export function sameChannel(message: ExtendedMessage){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setTitle(`You need to be in same voice channel with lechsbott`)
    .setDescription(`Sorry but you can't use, please make sure you're on the same channel as lechsbott`)

    return embed
}

export function noQueue(message: ExtendedMessage){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setTitle(`There is nothing playing on this server`)

    return embed
}

export function noVoiceChannel(message: ExtendedMessage){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setDescription(`**You need to be in a voice channel to execute this command**`)

    return embed
}
