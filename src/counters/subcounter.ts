import { Client } from "discord.js";
import ytdl from 'ytdl-core'

export function subCounter(client: Client) {
    const guild = client.guilds.cache.get('796446524175286272');

    async function search(url: string){
        const video = await ytdl.getInfo(url)

        try {
            setInterval(() =>{
                const channel = guild.channels.cache.get('872950212438667334');
                channel.setName(`Abone Sayısı • ${video.videoDetails.author.subscriber_count.toLocaleString()}`);
            }, 300000)
        } catch (err) {
            console.log(err)
        }
    }
    
    void search('https://www.youtube.com/watch?v=FSRDRl_rQpg')
}