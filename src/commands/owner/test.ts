import Discord from "discord.js";
import { Command } from "../../structures/Command";
import dl from 'play-dl'
import prism from 'prism-media'
import { createAudioResource, StreamType, generateDependencyReport } from '@discordjs/voice'
import { Stream } from 'stream'

export default new Command({
    name: 'test',
    ownerOnly: true,
    async execute({ client, message, args, cmd }) {
        const FFMPEG_OPUS_ARGUMENTS = [
            '-loglevel',
            '0',
            '-acodec',
            'libopus',
            '-f',
            'opus',
            '-ar',
            '48000',
            '-ac',
            '2',
        ];

        const info = await dl.video_info('https://www.youtube.com/watch?v=8qlXfT50xto')

        const highestAudio = info.format[info.format.length - 1].url

        const audio = new prism.FFmpeg({
            args: [...FFMPEG_OPUS_ARGUMENTS, "-ss", "5", "-i", highestAudio],
        })
        console.log(audio, '-------------------------')

        const download = await dl.stream('https://www.youtube.com/watch?v=8qlXfT50xto')
            .then((x) => console.log(x.stream))
            .catch((err) => console.log(err))
        
    }
})