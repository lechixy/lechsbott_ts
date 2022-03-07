import fetch, { Response } from 'node-fetch';
import { client } from '..'
const lyricsHeader = '</div></div></div></div><div class="hwc"><div class="BNeawe tAd8D AP7Wnd"><div><div class="BNeawe tAd8D AP7Wnd">';
const lyricsFooter = '</div></div></div></div></div><div><span class="hwc"><div class="BNeawe uEec3 AP7Wnd">';
const nameHeader = '<span><span class="BNeawe tAd8D AP7Wnd">'
const nameFooter = '</span></span><span class="BNeawe s3v9rd AP7Wnd">'
const authorHeader = '</span><span><span class="BNeawe s3v9rd AP7Wnd">'
const authorFooter = '</span></span></div><div class="Q0HXG"></div>'

async function getSong(query: string) {

    const url = "https://www.google.com/search?q=";
    let endpoints = [`+lyrics`, '+song+lyrics', '+song'];
    let encodedURL = `${url}${encodeURIComponent(query)}`
    let rawHTML: string
    let rawName: string


    for (let i = 0; i < endpoints.length; i++) {
        let endpoint = endpoints[i]
        let willFetch = `${encodedURL + endpoint}`
        let info: Response = await fetch(willFetch)
        rawHTML = await info.textConverted()

        //Author and name of song
        rawName = rawHTML.split(nameHeader)[1];

        //if page has song title then break the sequence
        if (rawName) break;
    }

    //No song found with query return null
    if (!rawName) return null

    rawName = rawName.split(nameFooter)[0];

    let rawAuthor: string
    rawAuthor = rawHTML.split(authorHeader)[1];
    rawAuthor = rawAuthor.split(authorFooter)[0];

    //Lyrics of song
    let rawlyrics: string
    rawlyrics = rawHTML.split(lyricsHeader)[1];
    rawlyrics = rawlyrics.split(lyricsFooter)[0];
    const split = rawlyrics.split('\n');

    let lyrics: string = '';
    for (var i = 0; i < split.length; i++) {
        lyrics = `${lyrics}${split[i]}\n`;
    }

    //gets thumbnail from genius api
    const geniusSearch = await client.utils.genius.songs.search(`${rawName}`)
    let Thumbnail: string = null

    for(let i = 0; i < geniusSearch.length; i++) {
        if(geniusSearch[i].artist.name.toLowerCase() === rawAuthor.toLowerCase()) {
            if(rawName.toLowerCase() === geniusSearch[i].title.toLowerCase() || geniusSearch[i].featuredTitle.toLowerCase() || geniusSearch[i].fullTitle.toLowerCase()){
                Thumbnail = geniusSearch[i].thumbnail
                break;
            } else return
        } else return
    }

    class Song {
        public Name: string = rawName;
        public Author: string = rawAuthor;
        public Lyrics: string = rawlyrics;
        public Thumbnail: string = Thumbnail;
    }

    return new Song()
}

getSong(`save your tears`).then(x => {
    if (!x) {
        console.log('no song')
    } else console.log(x)
})