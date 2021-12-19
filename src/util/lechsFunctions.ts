import { Message } from "discord.js";
import { ExtendedInteraction } from '../typings/SlashCommand'
import { ExtendedMessage } from '../typings/Command'

export function roleColor(message: ExtendedMessage | ExtendedInteraction): `#${string}` {
    return message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
}

export function converToCode(string: string, type = '\n'): string {
    let stringsyntax = '\`\`\`'
    if(type){
        return `${stringsyntax}${type}\n${string}${stringsyntax}`
    } else {
        return `${stringsyntax}${string}${stringsyntax}`
    }
    
}

export function firstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toDiscordTimestamp(time?: string | number, style?: 'f'): string{

    if(!time){
        return `<t:${parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0))}:${style}>`
    } else {
        return `<t:${parseInt((new Date(time).getTime() / 1000).toFixed(0))}:${style}>`
    }
}