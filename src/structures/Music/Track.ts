import { createAudioResource, StreamType } from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import dl from 'play-dl'
import ytdl from 'ytdl-core'
import { toTimestamp } from './functions/all';
import { getPreview, getTracks } from 'spotify-url-info'
import ytSearch, { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from 'yt-search'
import { fromType } from '../../typings/fromSelections'
import prism from 'prism-media';

export type songFace = {
    url: string,
    title: string,
    type: string,
    streamType: string,
    customurl: string,
    addedby: any,
    addedid: string | number,
    duration: string,
}

export class Track implements songFace {
    public readonly url: string;
    public readonly title: string;
    public readonly type: string;
    public readonly app: string;
    public readonly customurl: string;
    public readonly addedby: GuildMember;
    public readonly addedid: any;
    public readonly duration: string;

    public constructor({ url, title, type, streamType, customurl, addedby, addedid, duration }: songFace) {
        this.url = url;
        this.title = title;
        this.type = type;
        this.streamType = streamType;
        this.customurl = customurl;
        this.addedby = addedby;
        this.addedid = addedid;
        this.duration = duration;
    }
    streamType: string;

    public async createAudioResource() {
        if (this.streamType === 'YouTube') {
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

            const info = await dl.video_info(this.url)

            if (!info) {
                //Turns null for player's error checking
                return null
            }

            const highestAudio = info.format[info.format.length - 1].url

            const audio = new prism.FFmpeg({
                args: [...FFMPEG_OPUS_ARGUMENTS, "-ss", "5", highestAudio],
            });

            return createAudioResource(audio, { inputType: StreamType.Opus })
        }
    }

    public static async videoFinder(query: string[] | string): Promise<VideoSearchResult | LiveSearchResult | PlaylistSearchResult | ChannelSearchResult> {
        let video_result: any;

        if (typeof query === "string") {
            video_result = await ytSearch(query);
        } else {
            video_result = await ytSearch(query.join(' '));
        }

        return video_result.all.length > 1 ? video_result.all[0] : null;
    }

    public static async from(url: string[], type: fromType | string, streamType: string, user: GuildMember): Promise<Track> {
        if (type === 'YouTube Link') {
            let info: any;

            try {
                info = await ytdl.getInfo(url[0])
            } catch (err) {
                console.log(err)
                return undefined
            }



            return new Track({
                title: info.videoDetails.title,
                url: url[0],
                type,
                streamType,
                customurl: url[0],
                addedby: user,
                addedid: user.id,
                duration: toTimestamp(info.videoDetails.lengthSeconds),
            });
        } else if (type === 'YouTube Search') {
            let info: any;

            try {
                info = await this.videoFinder(url);
            } catch (err) {
                console.log(err)
                return undefined
            }

            if (!info) {
                return
            }

            return new Track({
                title: info.title,
                url: info.url,
                type,
                streamType,
                customurl: info.url,
                addedby: user,
                addedid: user.id,
                duration: info.timestamp,
            });
        } else if (type === 'Spotify Link') {
            let getinfo: any;
            let info: any;

            try {
                getinfo = await getPreview(url[0])
                info = await this.videoFinder(getinfo.title);
            } catch (err) {
                console.log(err)
                return undefined
            }

            return new Track({
                title: info.title,
                url: info.url,
                type,
                streamType,
                customurl: url[0],
                addedby: user,
                addedid: user.id,
                duration: info.duration.timestamp,
            });
        }
    }
}