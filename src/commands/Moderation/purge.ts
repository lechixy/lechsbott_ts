import Discord from 'discord.js'
import { Command } from '../../structures/Command'

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

        message.delete()
        const member = message.mentions.members.first();
        const messages = message.channel.messages.fetch();

        if (member) {
            const userMessages = (await messages).filter(
                (m) => m.author.id === member.id
            );

            const embed = new Discord.MessageEmbed()
                .setDescription(`**${member} messages has been deleted!**`)
            message.channel.send({ embeds: [embed] }).then(m => {
                setTimeout(function () {
                    if (m.deleted === true) {
                        m.delete()
                    }
                }, 7500)
            }
            )

            if (message.channel.type === 'GUILD_TEXT') {
                await message.channel.bulkDelete(userMessages, true)
            }


        } else {
            if(message.channel.type !== "GUILD_TEXT") return
            const user = message.author;

            if (!args[0]) {
                let argsembed0 = new Discord.MessageEmbed()
                    .setAuthor(`Please enter the amount of messages you want to clear!`, user.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [argsembed0] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 7500)
                }
                )
            }

            let number = parseInt(args[0])

            if (isNaN(number)) {
                let argsembed1 = new Discord.MessageEmbed()
                    .setAuthor(`Please enter a real number!`, user.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [argsembed1] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 7500)
                }
                )
            }

            if (number > 100) {
                let argsembed2 = new Discord.MessageEmbed()
                    .setAuthor(`You cannot delete more than 100 messages!`, user.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [argsembed2] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 7500)
                }
                )
            }
            if (number < 1) {
                let argsembed3 = new Discord.MessageEmbed()
                    .setAuthor(`You must delete at least one message!`, user.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [argsembed3] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 7500)
                }
                )
            }

            let argsembed4 = new Discord.MessageEmbed()
                .setAuthor(`Deleted ${args[0]} messages on #${message.channel.name}`, user.displayAvatarURL({ dynamic: true }))


            //For delete messages
            await message.channel.messages.fetch({ limit: number }).then(messages => {

                if (message.channel.type !== "GUILD_TEXT") return

                message.channel.bulkDelete(messages, true)
                return message.channel.send({ embeds: [argsembed4] }).then(m => {
                    setTimeout(function () {
                        m.delete().catch(error => { })
                    }, 7500)
                }
                )
            })

        }
    }
})