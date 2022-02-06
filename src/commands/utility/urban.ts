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
    async execute({ client, message, args, cmd }) {
        let query = args.join(' ');
        if (!query) {
            const embed = new Discord.Embed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Wrong arguments are given, need a query to Urban it!`)
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .addField({name: `Usage`, value: `${cmd} **<word | query>**`, inline: true})
            return message.channel.send({ embeds: [embed] });
        }

        query = encodeURIComponent(query);

        const {
            data: { list },
        } = await axios.get(
            `https://api.urbandictionary.com/v0/define?term=${query}`
        );

        const [answer] = list;

        const embed = new Discord.Embed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .addField({name: `Definition`, value: trim(answer.definition)})
            .addField({name: `Example`, value: trim(answer.example)})
            .setFooter({text: `👍 ${answer.thumbs_up}  |  ${answer.thumbs_down} 👎`})
        message.channel.send({ embeds: [embed] });
    }
})

function trim(input) {
    return input.length > 1024 ? `${input.slice(0, 1020)} ...` : input;
}