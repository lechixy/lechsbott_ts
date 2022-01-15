import { PREFIX } from '../../config.json'
import Discord from 'discord.js'
import { Command } from '../../structures/Command';
import axios from 'axios'
import { roleColor } from '../../util/lechsFunctions';

export default new Command({
    name: 'urban',
    aliases: ['dictionary'],
    description: 'Online dictionary for search words in Urban!',
    category: 'Utility',
    arguments: `<word | query>`,
    async execute({client, message, args, cmd}) {
        let query = args.join(' ');
        if (!query) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Wrong arguments are given`)
                .setColor(roleColor(message))
                .addField(`Usage`, `${PREFIX}${cmd} **<word | query>**`, true)
            return message.channel.send({ embeds: [embed] });
        }

        query = encodeURIComponent(query);

        const {
            data: { list },
        } = await axios.get(
            `https://api.urbandictionary.com/v0/define?term=${query}`
        );

        const [answer] = list;

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .setColor(roleColor(message))
            .addField(`Definition`, trim(answer.definition))
            .addField(`Example`, trim(answer.example))
            .setFooter(`👍 ${answer.thumbs_up}  |  ${answer.thumbs_down} 👎`)
        message.channel.send({ embeds: [embed] });
    }
})

function trim(input) {
    return input.length > 1024 ? `${input.slice(0, 1020)} ...` : input;
}