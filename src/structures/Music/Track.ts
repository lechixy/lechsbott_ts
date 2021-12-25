import { createAudioResource } from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import { stream } from 'play-dl'
import ytdl from 'ytdl-core'
import { toTimestamp } from './functions/all';
import { getPreview, getTracks } from 'spotify-url-info'
import ytSearch, { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from 'yt-search'
import { fromType } from '../../typings/fromSelections'

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
        if(this.streamType === 'YouTube'){
            const process = await stream(this.url)

            return createAudioResource(process.stream)
        }
    }

    public static async videoFinder(query: string[] | string): Promise<VideoSearchResult | LiveSearchResult | PlaylistSearchResult | ChannelSearchResult>{
        let video_result: any;

        if(typeof query === "string"){
            video_result = await ytSearch(query);
        } else {
            video_result = await ytSearch(query.join(' '));
        }

        return video_result.all.length > 1 ? video_result.all[0] : null;
    }

    public static async from(url: string[], type: fromType | string, streamType: string, user: GuildMember): Promise<Track> {
        if (type === 'YouTube Link') {
            let info: any;

            try{
                info = await ytdl.getInfo(url[0])
            } catch(err){
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
        } else if(type === 'YouTube Search'){
            let info: any;

            try{
                info = await this.videoFinder(url);
            } catch(err){
                console.log(err)
                return undefined
            }

            if(!info){
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
        } else if(type === 'Spotify Link'){
            let getinfo: any;
            let info: any;

            try{
                getinfo = await getPreview(url[0])
                info = await this.videoFinder(getinfo.title);
            } catch(err){
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