import { createAudioResource, StreamType } from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import dl from 'play-dl'
import ytdl from 'ytdl-core'
import { toTimestamp, timeConverter } from './functions/all';
import { getPreview, getTracks } from 'spotify-url-info'
import ytSearch, { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from 'yt-search'
import { fromType } from '../../typings/fromSelections'
import prism from 'prism-media';
import { Readable } from 'stream';

export type songFace = {
    url: string,
    title: string,
    type: string,
    streamType: string,
    customurl: string,
    addedby: any,
    addedid: string | number,
    duration: string,
    seekTime?: string,
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
    public seekTime: string;
    public stream: Readable;

    public constructor({ url, title, type, streamType, customurl, addedby, addedid, duration, seekTime }: songFace) {
        this.url = url;
        this.title = title;
        this.type = type;
        this.streamType = streamType;
        this.customurl = customurl;
        this.addedby = addedby;
        this.addedid = addedid;
        this.duration = duration;

        if (this.seekTime) {
            this.seekTime = seekTime;
        } else this.seekTime = "0";
    }
    streamType: string;

    public async createAudioResource() {
        if (this.streamType === 'YouTube') {

            //Check seekTime for this if it isn't equal to zero go and get ffmpeg
            if (this.seekTime !== "0") {
                return createAudioResource(await this.getFFmpegForSeek(), { inputType: StreamType.OggOpus })
            }

            const stream = await dl.stream(this.url, { discordPlayerCompatibility: true }).catch(err => {
                console.log(err);
                return null
            })

            if (!stream) {
                //Turns null for player's error checking
                return null
            }
            this.stream = stream.stream;

            return createAudioResource(this.stream)
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

    public async getFFmpegForSeek() {
        if (this.streamType === "YouTube") {
            const FFMPEG_OPUS_ARGUMENTS = [
                "-analyzeduration",
                "0",
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

            const audio = new prism.FFmpeg({
                args: [...FFMPEG_OPUS_ARGUMENTS, "-ss", this.seekTime],
            });

            return this.stream.pipe(audio)
        }
    }

    public setSeekTime(time: string) {

        if (time.includes(':')) {
            const timeIndex = time.split(':')

            //check for hh:mm:ss
            if (timeIndex.length < 4 && timeIndex.length > 1) {
                const times = timeIndex.map((value) => {
                    //hh:mm:ss+s syntax
                    if (value.length > 2) return null;
                    //hh:mm:s <--- need to zero for s
                    if (value.length < 2 && value.length === 1) {
                        return `0${value}`
                    } else return null;
                })
                console.log(times)
            } else null
        }
        if (parseInt(time) >= timeConverter(this.duration)) return null;

        this.seekTime = time;

        return true
    }
}