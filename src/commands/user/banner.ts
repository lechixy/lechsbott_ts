import { PREFIX, LECHSBOTTKEY } from '../../config.json'
import fetch from 'node-fetch'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'banner',
    description: 'Sends an embed with banner of member!',
    category: 'User',
    arguments: `<@User | UserID | none>`,
    async execute({ client, message, args, cmd }) {

        let user
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = await message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Oops, we can't found this user in server`)
                .setColor(roleColor(message))
                .setDescription(`Please mention a member or give an user id for check banner!`)
                .addField(`Usage`, `${PREFIX}${cmd} **<@User | Id>**`)
            return message.channel.send({ embeds: [embed] });
        }


        const res = await fetch(`https://discord.com/api/v9/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${LECHSBOTTKEY}`
            },
        })

        const data: any = await res.json()
        const { banner, banner_color } = data;

        if (banner) {
            const extension = banner.startsWith('a_') ? ".gif" : ".png"
            const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
                .setImage(url)
            return message.channel.send({ embeds: [embed] });
        } else {
            if (banner_color) {

                let url = `https://singlecolorimage.com/get/${banner_color.slice(1, banner_color.length)}/400x100`

                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`This user is not have a banner but got a banner color`)
                    .setImage(url)
                return message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`This user is not have a banner and banner color`)

                return message.channel.send({ embeds: [embed] });
            }
        }

    }
})