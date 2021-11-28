import { Message } from "discord.js";

export function roleColor(message: Message){
    return message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
}

export function converToCode(string: string, type = '\n'){
    let stringsyntax = '\`\`\`'
    if(type){
        return `${stringsyntax}${type}\n${string}${stringsyntax}`
    } else {
        return `${stringsyntax}${string}${stringsyntax}`
    }
    
}

export function firstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}