import Discord from 'discord.js'
import { Command } from '../../structures/Command'
import { PREFIX } from '../../config.json'
import { roleColor } from '../../util/lechsFunctions';

export default new Command({
    name: 'clear',
    aliases: ['purge'],
    cooldown: 5,
    description: 'Clear a lot of messages at once from channel',
    category: 'Moderation',
    arguments: `<@User | Amount between 1 and 100>`,
    userPermissions: ['MANAGE_MESSAGES'],
    clientPermissions: ['MANAGE_MESSAGES'],
    async execute({ client, message, args, cmd }) {

        const member = message.mentions.members.first();
        const messages = message.channel.messages.fetch({ limit: 100 });

        if (member) {
            const userMessages = (await messages).filter(
                (m) => m.author.id === member.id
            );

            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Deleted ${member} messages on ${message.channel}`)
                .setColor(roleColor(message))
            message.channel.send({ embeds: [embed] }).then(m => {
                setTimeout(function () {
                    m.delete().catch(error => {})
                }, 1000*10)
            }
            )

            if (message.channel.type === 'GUILD_TEXT') {
                await message.channel.bulkDelete(userMessages, true)
            }


        } else {
            if (message.channel.type !== "GUILD_TEXT") return

            if (!args[0]) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Wrong arguments are given`)
                    .setColor('RED')
                    .addField(`Usage`, `${PREFIX}${cmd} **<amount: required>**`, true)
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }

            let number = parseInt(args[0])

            if (isNaN(number)) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Amount needs to be a number`)
                    .setColor('RED')
                    .addField(`Usage`, `${PREFIX}${cmd} **<amount: number>**`, true)
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }

            if (number > 100) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Only delete maximum 100 messages at once`)
                    .setColor('RED')
                    .addField(`Usage`, `${PREFIX}${cmd} **<amount: 1-100>**`, true)
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }
            if (number <= 1) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Only delete more than 1 messages`)
                    .setColor('RED')
                    .addField(`Usage`, `${PREFIX}${cmd} **<amount: 1-100>**`, true)
                return message.channel.send({ embeds: [embed] }).then(m => {
                    setTimeout(() =>
                        m.delete().catch(error => { })
                        , 1000*10)
                }
                )
            }

            message.delete().catch(error => { })

            let argsembed4 = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Deleted ${args[0]} messages on ${message.channel}`)
                .setColor(roleColor(message))

            //For delete messages
            await message.channel.messages.fetch({ limit: number }).then(messages => {

                if (message.channel.type !== "GUILD_TEXT") return

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