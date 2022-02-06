import {Util} from 'discord.js'
import { Command } from '../../structures/Command';
import { roleColor } from '../../util/lechsFunctions';
import Discord from 'discord.js'

export default new Command({
    name: 'uploademoji',
    aliases: ['get-emoji', 'getemoji', 'create-emoji', 'upload-emoji'],
    description:'Creates emoji from your message and uploads to server!',
    category: 'Guild',
    userPermissions: ['ManageEmojisAndStickers'],
    clientPermissions: ['ManageEmojisAndStickers'],
    arguments: `<Emoji>`,
    async execute({client, message, args, cmd}) {
        const user = message.author;

        if(!args.length){
            const argsembed = new Discord.Embed()
            .setAuthor({name: `Please specify some emojis!`, iconURL: user.displayAvatarURL()})
            .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [argsembed] })
        }

        let descemoji = [];

        for(const rawEmoji of args){
            const parsedEmoji = Util.parseEmoji(rawEmoji);
            let newEmoji: Discord.GuildEmoji

            if(parsedEmoji.id) {

                const extension = parsedEmoji.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id +
                    extension}`;
                newEmoji = await message.guild.emojis.create(url, parsedEmoji.name)
            }

            let willPush = `<${newEmoji.animated ? 'a:' : ':'}${newEmoji.name}:${newEmoji.id}>`
            descemoji.push(willPush)
        }
        let successembed = new Discord.Embed()
        .setAuthor({name: `Successfully added to ${message.guild.name}`, iconURL: user.displayAvatarURL()})
        .setDescription(`${descemoji.join(" | ")}`)
        .setColor(Discord.Util.resolveColor(roleColor(message)))
        message.channel.send({ embeds: [successembed] })
    }
})
    