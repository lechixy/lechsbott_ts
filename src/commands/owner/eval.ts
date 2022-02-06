import { Command } from "../../structures/Command";
import Discord from 'discord.js'

export default new Command({
    name: 'eval',
    description: '',
    ownerOnly: true,
    category: 'Owner',
    async execute({ client, message, args, cmd }) {
        if (!args[0]) return

        try {
            let command = eval(args.join(" "));
            let willresults = ['string', 'boolean', 'number', 'float']

            if (willresults.includes(typeof command)) {
                message.react('✅')
            } else {
                message.react('✅')
            }

        } catch (err) {
            let errorembed = new Discord.Embed()
                .setAuthor({name: `An error occured`})
                .addField({name: `Entrys`, value: `\`\`\`js\n${args.join(" ")}\n\`\`\``})
                .addField({name: `Output`, value: `\`\`\`js\n${err}\n\`\`\``})
                .setColor(Discord.Util.resolveColor('Red'))
            message.channel.send({ embeds: [errorembed] }).then(m => m.react('‼'))
        }
    }
})