import { Command } from "../../structures/Command";
import Discord from 'discord.js'

export default new Command({
    name: 'eval',
    aliases: ['evaldel'],
    description: '',
    ownerOnly: true,
    category: ['Owner'],
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
            let errorembed = new Discord.MessageEmbed()
                .setAuthor(`An error occured`)
                .addField(`Entrys`, `\`\`\`js\n${args.join(" ")}\n\`\`\``)
                .addField(`Output`, `\`\`\`js\n${err}\n\`\`\``)
                .setColor('RED')
                .setTimestamp()
            message.channel.send({ embeds: [errorembed] })
            message.react('‼')
        }


    }
})