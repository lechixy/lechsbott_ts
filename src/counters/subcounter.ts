import { Client } from "discord.js";
import ytdl from 'ytdl-core'

export function subCounter(client: Client) {
    const guild = client.guilds.cache.get('796446524175286272');

    async function search(url: string) {
        await ytdl.getInfo(url).then(data => {
            try {

                const channel = guild.channels.cache.get('872950212438667334');

                let url = `Abone Sayısı • ${data.videoDetails.author.subscriber_count.toLocaleString()}`

                if (channel.name === url){
                    return
                } else {
                    channel.setName(`Abone Sayısı • ${data.videoDetails.author.subscriber_count.toLocaleString()}`);
                }
            } catch (err) {
                console.log(err)
            }
        })


    }

    setInterval(() => {
        void search('https://www.youtube.com/watch?v=FSRDRl_rQpg')
    }, 1000*60*5)
}