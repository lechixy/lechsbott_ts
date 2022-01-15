import fetch from 'node-fetch'
import { PREFIX, GIPHY_API_KEY } from '../../config.json'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'gif',
    aliases: ['searchgif', 'giphy'],
    description: 'Gets awesome gifs from Giphy!',
    category: 'Utility',
    arguments: `<search keywords>`,
    async execute({ client, message, args, cmd }) {


        const query = args.join(' ')
        if (!query) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Wrong arguments are given`)
                .setColor(roleColor(message))
                .addField(`Usage`, `${PREFIX}${cmd} **<search query>**`, true)
            return message.channel.send({ embeds: [embed] });;
        }

        const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=1`

        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.meta.status === 200) {
                    return message.reply({ content: `${json.data[0].url}` })
                }
                if (json.meta.status === 404) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(roleColor(message))
                        .setDescription(`**Not found any gif \`${query}\` query on Giphy**`)
                    return message.channel.send({ embeds: [embed] });
                }
            })
    }
})