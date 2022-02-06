import { Command } from "../../structures/Command";
import Discord from 'discord.js'
import db from '../../database/models/Guild'

export default new Command({
    name: "prefix",
    aliases: ["setprefix"],
    description: "Sets custom prefix for this guild!",
    category: "lechsbott",
    cooldown: 5,
    userPermissions: ["ManageGuild"],
    async execute({client, message, args, cmd}){
        
        if(!args[0]){
            const embed = new Discord.Embed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription('Wrong arguments are given')
            .setColor(Discord.Util.resolveColor('Red'))
            .addField({name: `Usage`, value: `${cmd} **<new prefix: requiRed>**`, inline: true})
            return message.channel.send({embeds: [embed]})
        }

        let newprefix: string | number = parseInt(args[0])

        if(isNaN(newprefix)){
            const embed = new Discord.Embed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription('New prefix needs to be a text not a number!')
            .setColor(Discord.Util.resolveColor('Red'))
            .addField({name: `Usage`, value: `${cmd} **<new prefix: requiRed>**`, inline: true})
            return message.channel.send({embeds: [embed]})
        }

        newprefix = newprefix.toString()

        await db.findOneAndUpdate({guildId: message.guildId}, { $set: { prefix: newprefix } }).then(() => {
            const embed = new Discord.Embed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription(`Prefix updated to **${newprefix}** for **${message.guild.name}**`)
            .setColor(Discord.Util.resolveColor('Green'))
            return message.channel.send({embeds: [embed]})
        }).catch(err => {
            const embed = new Discord.Embed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setDescription('There is an error while updating the prefix, please try later!')
            .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({embeds: [embed]})
        })

    }

})