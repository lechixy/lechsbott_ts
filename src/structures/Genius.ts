import axios from 'axios';
import got from 'got';
import cherio from 'cherio';
import { GENIUS } from '../config.json';
import { search, song } from '../typings/Genius';

class lechs_Genius {
    public authType: string = 'Bearer'
    public authKey: string = GENIUS;

    constructor(apiKey?: string) {
        apiKey ? this.authKey = apiKey : this.authKey = this.authKey;
    }

    public authenticate() {
        return {
            Authorization: `${this.authType} ${this.authKey}`
        }
    }

    public async search(query: string) {
        let url = `https://api.genius.com/search?q=${encodeURI(query)}`;

        const { data: info } = await axios.get<search>(url, {
            headers: this.authenticate()
        })

        if (info.meta.status === 200) {
            return info.response.hits
        } else {
            console.warn(`GeniusAPIError | The fetch request return with status code ${info.meta.status}: ${info.meta.message}`)
            return null;
        }
    }

    public async getSong(query: string) {
        let apiSearch = await this.search(query);
        if (!apiSearch) return null;

        return {
            song: apiSearch[0],
            lyrics: await this.getLyrics(apiSearch[0]),
        }
    }

    private async getLyrics(song: song){
        let songUrl = song.result.url;
        let { body } = await got.get(songUrl);

        const $ = cherio.load(body);

        const selectors = [
            () => $(".lyrics").text().trim(),
            () =>
                $("div[class*='Lyrics__Container']")
                    .toArray()
                    .map((x) => {
                        const ele = $(x as any);
                        ele.find("br").replaceWith("\n");
                        return ele.text().trim();
                    })
                    .join("\n\n")
                    .trim(),
        ];

        for (const x of selectors) {
            const lyrics = x();
            if (lyrics?.length) {
                return lyrics;
            }
        }
    }

}

export default lechs_Genius;