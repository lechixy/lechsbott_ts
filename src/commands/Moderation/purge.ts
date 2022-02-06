import Discord from 'discord.js'
import { Command } from '../../structures/Command'
import { PREFIX } from '../../config.json'
import { roleColor } from '../../util/lechsFunctions';

export default new Command({
    name: 'clear',
    aliases: ['purge'],
    cooldown: 5,
    description: 'Clear lot of messages at once from channel!',
    category: 'Moderation',
    arguments: `<@User | Amount between 1 and 100>`,
    userPermissions: ['ManageMessages'],
    clientPermissions: ['ManageMessages'],
    async execute({ client, message, args, cmd }) {

        const member = message.mentions.members.first();
        const messages = message.channel.messages.fetch({ limit: 100 });

        if (member) {
            const userMessages = (await messages).filter(
                (m) => m.author.id === member.id
            );

            let embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Deleted ${member} messages on ${message.channel}`)
                .setColor(Discord.Util.resolveColor(roleColor(message)))
            message.channel.send({ embeds: [embed] }).then(m => {
                setTimeout(function () {
                    m.delete().catch(error => {})
                }, 1000*10)
            }
            )

            if (message.channel.type === 0) {
                await message.channel.bulkDelete(userMessages, true)
            }


        } else {
            if (message.channel.type !== 0) return

            if (!args[0]) {
                const embed = new Discord.Embed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setDescription(`Wrong arguments are given`)
                    .setColor(Discord.Util.resolveColor('Red'))
                    .addField({name: `Usage`, value: `${PREFIX}${cmd} **<amount: required>**`, inline: true})
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }

            let number = parseInt(args[0])

            if (isNaN(number)) {
                const embed = new Discord.Embed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setDescription(`Please type amount with number`)
                    .setColor(Discord.Util.resolveColor('Red'))
                    .addField({name: `Usage`, value: `${PREFIX}${cmd} **<amount: number>**`, inline: true})
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }

            if (number > 100) {
                const embed = new Discord.Embed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setDescription(`Only delete maximum 100 messages at once`)
                    .setColor(Discord.Util.resolveColor('Red'))
                    .addField({name: `Usage`, value: `${PREFIX}${cmd} **<amount: 1-100>**`, inline: true})
                return message.channel.send({ embeds: [embed] })
            }
            if (number <= 1) {
                const embed = new Discord.Embed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setDescription(`Only delete more than 1 messages`)
                    .setColor(Discord.Util.resolveColor('Red'))
                    .addField({name: `Usage`, value: `${PREFIX}${cmd} **<amount: 1-100>**`, inline: true})
                return message.channel.send({ embeds: [embed] })
            }

            message.delete().catch(error => { })

            let argsembed4 = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription(`Deleted ${args[0]} messages on ${message.channel}`)
                .setColor(Discord.Util.resolveColor(roleColor(message)))

            //For delete messages
            await message.channel.messages.fetch({ limit: number }).then(messages => {

                if (message.channel.type !== 0) return

                message.channel.bulkDelete(messages, true)
                return message.channel.send({ embeds: [argsembed4] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 1000*10)
                }
                )
            })

        }
    }
})