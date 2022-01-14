import { Command } from "../../structures/Command"
import child from 'child_process'
import Discord from 'discord.js'
import { converToCode } from "../../util/lechsFunctions"

export default new Command({
    name: 'terminal',
    ownerOnly: true,
    category: 'Owner',
    async execute({client, message, args, cmd}) {
        const command = args.join(' ')

        if (!command) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`**You need to type a terminal command for execute!**`)
            return message.channel.send({ embeds: [embed] });
        }

        child.exec(command, (err, res) => {
            if (err){
                console.log(err)

                return message.channel.send({ content: `${converToCode(`${err}`, 'js')}`})
            }

            message.channel.send({ content: `${converToCode(res.slice(0, 2000), 'js')}`})
        })
    }
})