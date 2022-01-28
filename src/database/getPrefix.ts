import db from './models/Guild';
import { Message } from 'discord.js';
import { PREFIX } from "../config.json"

export default async function getPrefix(message: Message): Promise<any> {

    const info = await db.findOne({ userID: message.guildId }).clone()

    if (info) {
        return info.prefix
    } else {
        console.log(`There is no schema for ${message.guild.name} so created a new schema for it!`)
        db.create({
            guildId: message.guildId,
        })

        console.log('Global prefix used for once')
        return PREFIX
    }

}