import ytSearch from 'yt-search'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import * as Voice from '@discordjs/voice'
import { Track } from '../../structures/Music/Track'
import { fromType } from '../../typings/fromSelections'
import { lechs_Subscription } from '../../structures/Music/Subscription';
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'search',
    description: 'Search somethings on YouTube and get results!',
    options: [
        {
            name: "query",
            type: "STRING",
            required: true,
            description: "What you want to search on YouTube?",
        }
    ],
    async execute({ client, interaction, args }) {

        const voice_channel = interaction.member.voice.channel

        if (!voice_channel) {
            return interaction.followUp({ embeds: [embeds.noVoiceChannel(interaction)] });
        }

        let subscription = client.queue.get(interaction.guildId);

        if (!subscription) {

            subscription = new lechs_Subscription(
                Voice.joinVoiceChannel({
                    channelId: voice_channel.id,
                    guildId: voice_channel.guild.id,
                    adapterCreator: voice_channel.guild.voiceAdapterCreator,
                    selfDeaf: true
                }), interaction);
            client.queue.set(interaction.guildId, subscription);

        } else {

            //resfresh text channel
            subscription.textChannel = interaction.channel
            subscription.lastRespond = interaction;

            if (voice_channel.id !== subscription.voiceChannel.id) {
                return interaction.followUp({ embeds: [embeds.sameChannel(interaction)] });
            }
        }

        interaction.followUp({ content: `<:youtube:846030610526634005> **Searching for** \`${args.getString('query')}\`` });

        const video = await ytSearch(args.getString('query'));
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
                addedby: interaction.member.user.username,
                addedid: interaction.member.id,
                duration: eachvideo.duration.timestamp,
            }

            findedsongs.push(songdeclare)
        }

        string1 += `${videos.map(x => `**${++index}-** [${x.title}](${x.url})`).join("\n")}`;

        let searchresult = new Discord.MessageEmbed()
            .setTitle(`Search results for ${args.getString('query')}`)
            .setColor(roleColor(interaction))
            .setDescription(string1)
            .addField('Choose one of them', 'Just type the number one of results you wanted to play in 30s,\n Also for cancel you can type \`cancel\`')
        interaction.editReply({ embeds: [searchresult] });


        const filter = (m) => {
            return ['1', 'first', 'second', 'third', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'cancel'].includes(m.content) && m.member.id === interaction.member.id
        }
        interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async responde => {

                const collected = responde.first()
                if (['cancel', 'quit'].includes(collected.content)) {
                    let embed = new Discord.MessageEmbed()
                        .setColor(roleColor(interaction))
                        .setAuthor(
                            `Cancelled from search`,
                            interaction.member.displayAvatarURL({ dynamic: true })
                        )
                        .setDescription(`You quitted from youtube search`)
                    return interaction.editReply({ embeds: [embed] });
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
                    addedby: interaction.member,
                    addedid: interaction.member.id,
                    duration: song.duration,
                }))

            })
            .catch(async err => {
                console.log(err)
                let embed = new Discord.MessageEmbed()
                    .setColor(roleColor(interaction))
                    .setAuthor(
                        `Cancelled from search`,
                        interaction.member.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(`You did not selected a result in 30s`)
                return interaction.editReply({ embeds: [embed] }).catch(err => { })
            })



    }
})