import { Client } from "discord.js";
import ytdl from 'ytdl-core'

export async function subCounter(client: Client) {
    const guild = await client.guilds.fetch('796446524175286272')

    async function search(url: string) {
        await ytdl.getInfo(url).then(async data => {
            try {

                const channel = await guild.channels.fetch('872950212438667334');

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