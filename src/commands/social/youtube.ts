import { PREFIX } from '../../config.json'
import ytSearch from 'yt-search'
import Discord from 'discord.js'
import { Command } from '../../structures/Command'

export default new Command({
    name: 'youtube',
    description: 'Searches videos on YouTube!',
    category: 'Utility',
    arguments: `<keywords to search | video title>`,
    async execute({ client, message, args, cmd }) {

        const ytemoji = client.emojis.cache.get('846030610526634005');

        if (!args[0]) {
            const embed = new Discord.Embed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Wrong arguments are given, need query for youtube!`)
                .setColor(Discord.Util.resolveColor('#FF0000'))
                .addField({ name: `Usage`, value: `${PREFIX}${cmd} **<query: required>**`, inline: true })
            return message.channel.send({ embeds: [embed] });
        }

        const m = await message.channel.send(`${ytemoji} **Searching for** \`${args.join(' ')}\``)

        const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return video_result.videos.length > 1 ? video_result.videos[0] : null;
        };

        const video = await video_finder(args.join(' '));
        if (video) {
            m.edit(video.url)
        } else {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('#FF0000'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`**No videos found within** \`${args.join(' ')}\` **on YouTube!**`);
            return message.channel.send({ embeds: [embed] });
        }


    }
})