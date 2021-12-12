import {Util} from 'discord.js'
import { Command } from '../../structures/Command';
import { roleColor } from '../../util/lechsFunctions';
import Discord from 'discord.js'

export default new Command({
    name: 'uploademoji',
    aliases: ['get-emoji', 'getemoji', 'create-emoji', 'upload-emoji'],
    description:'Creates emoji from your message and uploads to server!',
    category: 'Guild',
    userPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
    clientPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
    arguments: `<Emoji>`,
    async execute({client, message, args, cmd}) {
        const user = message.author;

        if(!message.member.permissions.has("ADMINISTRATOR")){
            const permembed = new Discord.MessageEmbed()
            .setAuthor(`You doesn't have permission to Administrator`, user.displayAvatarURL({dynamic: true}))
            .setColor('RED')
            return message.channel.send({ embeds: [permembed] })
        }

        if(!args.length){
            const argsembed = new Discord.MessageEmbed()
            .setAuthor(`Please specify some emojis!`, user.displayAvatarURL({dynamic: true}))
            .setColor('RED')
            return message.channel.send({ embeds: [argsembed] })
        }

        let descemoji = [];

        for(const rawEmoji of args){
            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if(parsedEmoji.id) {

                const extension = parsedEmoji.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id +
                    extension}`;
                message.guild.emojis.create(url, parsedEmoji.name)
            }

            descemoji.push(rawEmoji)
        }
        let successembed = new Discord.MessageEmbed()
        .setAuthor(`Successfully added to ${message.guild.name}`, user.displayAvatarURL({dynamic: true}))
        .setDescription(`${descemoji.join(" ")}`)
        .setColor(roleColor(message))
        message.channel.send({ embeds: [successembed] })
    }
})
    