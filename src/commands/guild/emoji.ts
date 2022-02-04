import {Util} from 'discord.js'
import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name:'emoji',
    aliases:['zoom-emoji', 'zoom', 'details-emoji', 'emoji-details'],
    description:'Sends an embed for emoji!',
    category: 'Guild',
    arguments: `<emoji>`,
    async execute({client, message, args, cmd}) {
        
        if(!args.length){
            const argsembed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor('RED'))
            .setAuthor({name: `Please specify a emoji you want to zoom in!`, iconURL: message.author.displayAvatarURL()})
            return message.channel.send({ embeds: [argsembed] })
        }

        let rawEmoji = args[0]

        const parsedEmoji = Util.parseEmoji(rawEmoji)

        if(parsedEmoji.id) {

            const extension = parsedEmoji.animated ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`

            const embed = new Discord.Embed()
            .setTitle(`:${parsedEmoji.name}:`)
            .setImage(url)
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setFooter({text: `Emoji ID | ${parsedEmoji.id}`})
            message.channel.send({ embeds: [embed] });
        } else {

            const embed = new Discord.Embed()
            .setAuthor({name: `Emoji type is invalid!`, iconURL: message.author.displayAvatarURL()})
            .setColor(Discord.Util.resolveColor('RED'))
            .setDescription(`Probably **${args[0]}** is not an emoji, please specify an emoji!`)
            message.channel.send({ embeds: [embed] });
        }
        
        
  }
})