import { Message } from "discord.js";

export function roleColor(message: Message){
    return message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
}