import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { PREFIX } from '../../config.json'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'avatar',
    aliases: ["pp", "av"],
    description: 'Sends an embed with avatar of member!',
    category: 'User',
    arguments: `<@User | UserID | none>`,
    async execute({ client, message, args, cmd }) {

        let user
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setTitle(`Oops, we can't found this user in server`)
                .setDescription(`Please mention a member or give an user id for check avatar!`)
                .addField(`Usage`, `${PREFIX}${cmd} **<@User | Id>**`)
            return message.channel.send({ embeds: [embed] });
        }

        let avatar = user.displayAvatarURL({ dynamic: true, size: 1024 })

        let avatarEmbed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setAuthor(`${user.user.tag}`, user.displayAvatarURL({ dynamic: true }))
            .setImage(avatar)
        message.channel.send({ embeds: [avatarEmbed] })
    }
})