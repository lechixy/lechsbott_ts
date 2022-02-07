import ytSearch from 'yt-search'
import ytdl, { validateURL } from 'ytdl-core'
import { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } from '../../../config.json'
import YouTube from 'simple-youtube-api'
const youtube = new YouTube(YOUTUBE_API_KEY)
import moment from 'moment'
import { Track } from '../../Music/Track';
import { roleColor } from "../../../util/lechsFunctions";
import Discord from 'discord.js'
import { client } from "../../../index";
import { fromType } from '../../../typings/fromSelections'
import { ExtendedInteraction } from '../../../typings/SlashCommand'

export async function songFinder(interaction: ExtendedInteraction, args: string[]) {
    const ytemoji = client.emojis.cache.get("846030610526634005");
    const spotifyemoji = client.emojis.cache.get("846030610929418310");
    const scemoji = client.emojis.cache.get("865548940694519819");
    const playlisturl = 'https://www.youtube.com/playlist?list=';
    const spotifyurl = 'https://open.spotify.com/track/';
    const spotifyplaylisturl = "https://open.spotify.com/playlist/";
    const scurl = 'https://soundcloud.com/'
    const yturl = 'https://www.youtube.com/'

    const subscription = client.queue.get(interaction.guild.id)

    let track: Track

    if (args[0].includes(spotifyurl)) {
        interaction.followUp(`${spotifyemoji} **Searching** \`${args[0]}\``);

        track = await Track.from(args, fromType.splink, 'YouTube', interaction.member);

        if (track === undefined) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await interaction.channel.send({ embeds: [embed] });
        }

        subscription.enqueue(track);

    }
    else if (validateURL(args[0])) {
        interaction.followUp(`${ytemoji} **Searching** \`${args[0]}\``);

        track = await Track.from(args, fromType.ytlink, 'YouTube', interaction.member);

        if (track === undefined) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await interaction.channel.send({ embeds: [embed] });
        }

        subscription.enqueue(track);
    } else {
        interaction.followUp(`${ytemoji} **Searching for** \`${args.join(' ')}\``);

        track = await Track.from(args, fromType.ytsearch, 'YouTube', interaction.member);

        if (!track) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(interaction)))
                .setDescription(
                    `**There was an error getting the track, we can't do that!**`
                );

            return await interaction.channel.send({ embeds: [embed] });
        }
        subscription.enqueue(track);

    }
}