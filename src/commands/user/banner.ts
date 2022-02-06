import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'banner',
    description: 'Sends an embed with banner of member!',
    category: 'User',
    arguments: `<@User | UserID | none>`,
    async execute({ client, message, args, cmd }) {

        let user: Discord.GuildMember
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Please mention a member or give an user id for check banner!`)
                .addField({name: `Usage`, value: `${cmd} **<@User | Id>**`})
            return message.channel.send({ embeds: [embed] });
        }

        const actualUser = user.user

        if (actualUser.banner) {

            const image = actualUser.bannerURL({size: 1024})

            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
                .setAuthor({name: actualUser.tag, iconURL: actualUser.displayAvatarURL()})
                .setImage(image)
            return message.channel.send({ embeds: [embed] });
        } else {
            if (actualUser.accentColor) {

                let url = `https://singlecolorimage.com/get/${actualUser.hexAccentColor.slice(1, actualUser.hexAccentColor.length)}/400x100`

                const embed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(message)))
                    .setAuthor({name: actualUser.tag, iconURL: actualUser.displayAvatarURL()})
                    .setDescription(`This user is not have a banner but got a banner color`)
                    .setImage(url)
                return message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor(roleColor(message)))
                    .setAuthor({name: actualUser.tag, iconURL: actualUser.displayAvatarURL()})
                    .setDescription(`This user is not have a banner and banner color`)
                return message.channel.send({ embeds: [embed] });
            }
        }

    }
})