import Discord from "discord.js";
import { Command } from "../../structures/Command";
import dl from 'play-dl'
import prism from 'prism-media'
import { createAudioResource, StreamType } from '@discordjs/voice'
import { Stream } from 'stream'

export default new Command({
    name: 'test',
    ownerOnly: true,
    async execute({ client, message, args, cmd }) {
        
    }
})