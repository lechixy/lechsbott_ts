import moment from 'moment'
import progressbar from 'string-progressbar'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { SlashCommand } from "../../structures/SlashCommand";
import { formatTime, timeConverter } from '../../structures/Music/functions/all';
import * as embeds from './embeds/all'

export default new SlashCommand({
    name: 'nowplaying',
    description:'Get informations of playing song!',
    async execute({client, interaction, args}) {

        const queue = client.queue
        const server_queue = queue.get(interaction.guild.id)

        if (!server_queue) {
            return interaction.followUp({ embeds: [embeds.noQueue(interaction)] });
        }

        const songduration = server_queue.resource.playbackDuration
        const totaltime = server_queue.songs[0].duration.toString()

        let elapsedtime

        if (totaltime.length >= 7) {
            elapsedtime = `${formatTime(moment.duration(songduration).hours())}:${formatTime(moment.duration(songduration).minutes())}:${formatTime(moment.duration(songduration).seconds())}`
        } else {
            elapsedtime = `${moment.duration(songduration).minutes()}:${formatTime(moment.duration(songduration).seconds())}`
        }

        const bar = progressbar.splitBar(timeConverter(totaltime), timeConverter(elapsedtime), 25, '▬', ':blue_circle:').toString()


        function splitbar(bar) {
            const split = bar.split(',');

            let [part] = split;

            return part
        }

        let nowplayingembed = new Discord.MessageEmbed()
            .setColor(roleColor(interaction))
            .setTitle(`${server_queue.songs[0].title}`)
            .setURL(server_queue.songs[0].customurl)
            .setDescription(`<@${server_queue.songs[0].addedid}> added from **${server_queue.songs[0].type}**\n
            ${elapsedtime}<:transparent:890623794421592104>${splitbar(bar)}<:transparent:890623794421592104>${totaltime}`)
            interaction.followUp({ embeds: [nowplayingembed] })


    }
})