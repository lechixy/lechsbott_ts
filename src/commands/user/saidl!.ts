import { Command } from '../../structures/Command'
import moment from 'moment'
import db from '../../database/models/saidPrefix'
import Discord from 'discord.js'

export default new Command({
    name: 'saidtimes',
    aliases: ['timessaid', 'said', 'saidprefix'],
    description: 'Do you want to see how many times you used lechsbot?',
    category: 'User',
    arguments: `<@User | UserID | none>`,
    async execute({ client, message, args, cmd }) {

        let user: Discord.GuildMember
        if (message.mentions.members.first()) {
            user = message.mentions.members.first()
        } else if (args[0]) {
            user = await message.guild.members.cache.get(args[0])
        } else {
            user = message.member
        }

        if (!user) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Please mention a member or give an user id for check said!`)
                .addField({ name: `Usage`, value: `${cmd} **<@User | Id>**` })
            return message.channel.send({ embeds: [embed] });
        }

        try {
            db.findOne({ userID: user.user.id }, async (err, data) => {
                if (!data) {
                    const embed = new Discord.Embed()
                        .setColor(Discord.Util.resolveColor('Red'))
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`${user} hasn't used lechsbott!`)
                    return message.channel.send({ embeds: [embed] });
                }

                const embed = new Discord.Embed()
                    .setColor(Discord.Util.resolveColor('Red'))
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .setDescription(`**${data.userTag}** used lechsbott for **${data.timeSaid.toLocaleString()}** times!`)
                    .addField({name: `Last used`, value: `${moment(parseInt(data.lastSaid)).fromNow()}`})
                    return message.channel.send({ embeds: [embed] });
            })
        } catch (err) {
            console.log(err)
        }
    }
})