import { Command } from '../../structures/Command'
import moment from 'moment'
import Discord from 'discord.js'

export default new Command({
    name: "whois",
    aliases: ['who'],
    description: 'Who is this?',
    category: ['User'],
    arguments: `<@User | UserID | none>`,
    async execute({client, message, args, cmd}) {

        
        let member
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = await message.guild.members.cache.get(args[0])
        } else {
            member = message.member
        }

        // User variables
        const created = moment(member.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a');
        const joined = moment(member.joinedTimestamp).format('dddd, MMMM Do YYYY, h:mm:ss a');
        let createdt = moment(member.user.createdAt).fromNow()
        let joinedt = moment(member.joinedTimestamp).fromNow()
        let memberavatar = member.user.displayAvatarURL({ dynamic: true })

        const user = `<@${member.id}>`

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.tag}`, memberavatar)
            .setThumbnail(memberavatar)
            .setDescription(user)
            .setColor(member.displayHexColor)
            //fields
            .addField(`User ID`, `${member.id}`)
            .addField(`Created on Discord`, `${created} (${createdt})`)
            .addField(`Joined to ${message.guild.name}`, `${joined} (${joinedt})`)
            .addField(`Highest Role`, `${member.roles.highest}`)
            //colm
            

        message.channel.send({ embeds: [embed] });


    }
})