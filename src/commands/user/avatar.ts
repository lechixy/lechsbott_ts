import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'avatar',
    aliases: ["pp", "av"],
    description: 'Sends an embed with avatar of member!',
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
                .setDescription(`Please mention a member or give an user id for check avatar!`)
                .addField({name: `Usage`, value: `${cmd} **<@User | Id>**`})
            return message.channel.send({ embeds: [embed] });
        }

        let avatar = user.displayAvatarURL({ size: 1024 })

        let avatarEmbed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setAuthor({name: user.user.tag, iconURL: user.displayAvatarURL()})
            .setImage(avatar)
        message.channel.send({ embeds: [avatarEmbed] })
    }
})