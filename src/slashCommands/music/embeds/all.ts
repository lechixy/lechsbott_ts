import Discord from 'discord.js'
import { ExtendedInteraction } from '../../../typings/SlashCommand';
import { roleColor } from '../../../util/lechsFunctions'

export function sameChannel(message: ExtendedInteraction){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setTitle(`You need to be in same voice channel with lechsbott`)
    .setDescription(`Sorry but you can't use, please make sure you're on the same channel as lechsbott`)

    return embed
}

export function noQueue(message: ExtendedInteraction){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setTitle(`There is nothing playing on this server`)

    return embed
}

export function noVoiceChannel(message: ExtendedInteraction){
    const embed = new Discord.MessageEmbed()
    .setColor(roleColor(message))
    .setDescription(`**You need to be in a voice channel to execute this command**`)

    return embed
}
