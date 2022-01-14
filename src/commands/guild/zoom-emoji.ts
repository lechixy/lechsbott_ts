import {Util} from 'discord.js'
import { Command } from '../../structures/Command'
import { roleColor } from '../../util/lechsFunctions'
import Discord from 'discord.js'

export default new Command({
    name:'zoom',
    aliases:['zoom-emoji'],
    description:'Sends an embed for emoji!',
    category: 'Guild',
    arguments: `<emoji>`,
    async execute({client, message, args, cmd}) {
        
        if(!args.length){
            const argsembed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setAuthor(`Please specify a emoji you want to zoom in!`, message.author.displayAvatarURL({dynamic: true}))
            return message.channel.send({ embeds: [argsembed] })
        }

        let rawEmoji = args[0]

        const parsedEmoji = Util.parseEmoji(rawEmoji)

        if(parsedEmoji.id) {

            const extension = parsedEmoji.animated ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id +
                extension}`;
            const embed = new Discord.MessageEmbed()
            .setTitle(`:${parsedEmoji.name}:`)
            .setImage(url)
            .setColor(roleColor(message))
            .setFooter(`Emoji ID | ${parsedEmoji.id}`)
            message.channel.send({ embeds: [embed] });
        } else {

            const embed = new Discord.MessageEmbed()
            .setAuthor(`That emoji type is invalid`, message.author.displayAvatarURL({dynamic: true}))
            .setColor(roleColor(message))
            .setDescription(`Probably **${args[0]}** is not an emoji, please specify an emoji!`)
            message.channel.send({ embeds: [embed] });
        }
        
        
  }
})