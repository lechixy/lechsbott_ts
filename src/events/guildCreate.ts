import { Event } from "../structures/Event";
import Guild from '../database/models/Guild'
import { client } from "..";

export default new Event("guildCreate", async (guild) => {
    try {
        const newGuild = await Guild.create({
            guildId: guild.id,
        })
        console.log(`${client.user.tag} joined to ${guild.name} database model created!`)

    } catch (err) {
        console.log(`${guild.name} database model can't created: ${err}`)
    }
})