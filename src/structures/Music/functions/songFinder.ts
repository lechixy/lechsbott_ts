import ytSearch from 'yt-search'
import ytdl, { validateURL } from 'ytdl-core'
import { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } from '../../../config.json'
import YouTube from 'simple-youtube-api'
const youtube = new YouTube(YOUTUBE_API_KEY)
import moment from 'moment'
import { Track } from '../../Music/Track';
import { roleColor } from "../../../util/lechsFunctions";
import Discord, { CommandInteraction, Message, MessageEmbed, StageInstance, VoiceChannel } from 'discord.js'
import { client } from "../../../index";
import { findTypeAndSend, defineAuthor, isMentioned, formatTime } from "./all";
import { fromType } from '../../../typings/fromSelections'

export async function songFinder(message: any, args: string[]) {
    const ytemoji = client.emojis.cache.get("846030610526634005");
    const spotifyemoji = client.emojis.cache.get("846030610929418310");
    const scemoji = client.emojis.cache.get("865548940694519819");
    const playlisturl = 'https://www.youtube.com/playlist?list=';
    const spotifyurl = 'https://open.spotify.com/track/';
    const spotifyplaylisturl = "https://open.spotify.com/playlist/";
    const scurl = 'https://soundcloud.com/'
    const yturl = 'https://www.youtube.com/'

    const subscription = client.queue.get(message.guild.id)

    let track: any

    if(args[0].includes(spotifyurl)){
        findTypeAndSend(`${spotifyemoji} **Searching** \`${args[0]}\``, message);

        track = await Track.from(args, fromType.splink, 'YouTube', message.member);

        if (track === undefined) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await findTypeAndSend({ embeds: [embed] }, message);
        }

        subscription.enqueue(track);

    }
    else if (validateURL(args[0])) {
        findTypeAndSend(`${ytemoji} **Searching** \`${args[0]}\``, message);

        track = await Track.from(args, fromType.ytlink, 'YouTube', message.member);

        if (track === undefined) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await findTypeAndSend({ embeds: [embed] }, message);
        }

        subscription.enqueue(track);
    } else {
        findTypeAndSend(`${ytemoji} **Searching for** \`${args.join(' ')}\``, message);

        track = await Track.from(args, fromType.ytsearch, 'YouTube', message.member);

        if (track === undefined) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await findTypeAndSend({ embeds: [embed] }, message);
        }
        subscription.enqueue(track);

    }


    // if (isMentioned(args, scurl) || isMentioned(args[0], scurl)){

    // }
}