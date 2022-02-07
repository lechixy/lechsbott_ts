import Discord from "discord.js";
import { Command } from "../../structures/Command";
import dl from 'play-dl'
import prism from 'prism-media'
import voice from '@discordjs/voice'

export default new Command({
    name: 'test',
    ownerOnly: true,
    async execute({ client, message, args, cmd }) {
        return
    }
})