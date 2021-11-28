import ytSearch from 'yt-search'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";
import * as Voice from '@discordjs/voice'
import { Track } from '../../structures/Music/Track'
import { fromType } from '../../typings/fromSelections'
import { lechs_Subscription } from '../../structures/Music/Subscription';

export default new Command({
    name: 'search',
    aliases: ['srch'],
    cooldown: 10,
    description: 'Search somethings on YouTube and get select embed!',
    category: 'Music',
    arguments: `<none>`,
    async execute({ client, message, args, cmd }) {

        const voice_channel = message.member.voice.channel

        if (!voice_channel) {
            let voiceembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(
                    `You need to be in a voice channel for play a music!`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
            return message.channel.send({ embeds: [voiceembed] });
        }

        if (!args[0]) {
            let argsembed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(
                    `l!${cmd} [query]`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .addField(`youtube`, `search videos`, true)
            return message.channel.send({ embeds: [argsembed] });
        }

        let subscription = client.queue.get(message.guildId);

        if (!subscription) {

            subscription = new lechs_Subscription(
                Voice.joinVoiceChannel({
                    channelId: voice_channel.id,
                    guildId: voice_channel.guild.id,
                    adapterCreator: voice_channel.guild.voiceAdapterCreator,
                    selfDeaf: true
                }), message);
            client.queue.set(message.guildId, subscription);

        } else {

            //resfresh text channel
            subscription.textChannel = message.channel
            subscription.lastRespond = message;

            if (voice_channel.id !== subscription.voiceChannel.id) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(`There is currently playing a song on another voice channel`, message.author.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [embed] });
            }
        }

        const m = await message.channel.send({ content: `<:youtube:846030610526634005> **Searching for** \`${args.join(' ')}\`` });

        const video = await ytSearch(args.join(' '));
        const videos = video.videos.slice(0, 10)
        let index = 0;

        let string1 = "";
        let findedsongs = []

        for (const eachvideo of videos) {

            let songdeclare = {
                title: eachvideo.title,
                url: eachvideo.url,
                type: 'normal',
                app: 'YouTube Search',
                customurl: eachvideo.url,
                addedby: message.author.username,
                addedid: message.author.id,
                duration: eachvideo.duration.timestamp,
            }

            findedsongs.push(songdeclare)
        }

        string1 += `${videos.map(x => `**${++index}-** [${x.title}](${x.url})`).join("\n")}`;

        let searchresult = new Discord.MessageEmbed()
            .setTitle(`Search results for ${args.join(' ')}`)
            .setColor(roleColor(message))
            .setDescription(string1)
            .addField('Choose one of them', 'Just type the number one of results you wanted to play in 30s,\n Also for cancel you can type \`cancel\`')
        m.edit({ embeds: [searchresult] });


        const filter = (m) => {
            return ['1', 'first', 'second', 'third', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'cancel'].includes(m.content) && m.author.id === message.author.id
        }
        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async responde => {

                const collected = responde.first()
                if (['cancel', 'quit'].includes(collected.content)) {
                    let embed = new Discord.MessageEmbed()
                        .setColor(roleColor(message))
                        .setAuthor(
                            `Cancelled from search`,
                            message.author.displayAvatarURL({ dynamic: true })
                        )
                        .setDescription(`You quitted from youtube search`)
                    return message.channel.send({ embeds: [embed] });
                }

                let numbers = {
                    '1': 0,
                    'first': 0,
                    '2': 1,
                    'second': 2,
                    '3': 2,
                    'third': 3,
                    '4': 3,
                    '5': 4,
                    '6': 5,
                    '7': 6,
                    '8': 7,
                    '9': 8,
                    '10': 9,
                }

                let song = findedsongs[numbers[collected.content]]

                subscription.enqueue(new Track({
                    title: song.title,
                    url: song.url,
                    type: fromType.ytsearch,
                    streamType: 'YouTube',
                    customurl: song.url,
                    addedby: message.member,
                    addedid: message.author.id,
                    duration: song.duration,
                }))

            })
            .catch(async err => {
                console.log(err)
                let embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(
                        `Cancelled from search`,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(`You did not selected a result in 30s`)
                return m.edit({ embeds: [embed] }).catch(err => { })
            })



    }
})