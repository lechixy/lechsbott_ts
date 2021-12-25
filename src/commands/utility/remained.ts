import { Command } from "../../structures/Command";
import Discord from 'discord.js'
import { roleColor } from "../../util/lechsFunctions";
import { PREFIX } from '../../config.json'

export default new Command({
    name: 'timefor',
    aliases: ['timeto', 'lefted', 'date', 'remained'],
    description: 'See how much lefted to date!',
    category: 'Utility',
    arguments: `<Date Formats | Date>`,
    async execute({client, message, args, cmd}) {

        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Wrong arguments are given`)
            .setColor(roleColor(message))
            .addField(`Usage`, `${PREFIX}${cmd} **<date>**`, true)
        return message.channel.send({ embeds: [embed] });
        }

        const definedyear = args.join(' ')

        countdown()

        function countdown() {

            const newYearsDate = new Date(definedyear).getTime()
            const currentDate = new Date().getTime()

            const totalSeconds = (newYearsDate - currentDate) / 1000

            const days = (Math.floor(totalSeconds / 3600 / 24)).toString()
            const hours = (Math.floor(totalSeconds / 3600) % 24).toString()
            const mins = (Math.floor(totalSeconds / 60) % 60).toString()
            const seconds = (Math.floor(totalSeconds) % 60).toString()

            if (seconds.startsWith('-')) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Pasted from ${definedyear}`)
                    .setColor(roleColor(message))
                    .setDescription(`**${fixNumber(days)}** days **${fixNumber(hours)}** hours **${fixNumber(mins)}** minutes **${fixNumber(seconds)}** seconds`)
                message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Lefted to ${definedyear}`)
                    .setColor(roleColor(message))
                    .setDescription(`**${formatTime(days)}** days **${formatTime(hours)}** hours **${formatTime(mins)}** minutes **${formatTime(seconds)}** seconds`)
                message.channel.send({ embeds: [embed] });
            }
        }

        function formatTime(time) {
            return time < 10 ? `0${time}` : time;
        }

        function fixNumber(time) {
            return time.slice(1, time.length)
        }


    }
})