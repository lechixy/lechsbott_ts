import { Command } from '../../structures/Command'
import moment from 'moment'
import Discord from 'discord.js'

export default new Command({
    name: "whois",
    aliases: ['who'],
    description: 'Who is this?',
    category: 'Guild',
    arguments: `<@User | UserID | none>`,
    async execute({client, message, args, cmd}) {

        
        let member: Discord.GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        } else {
            member = message.member
        }

        // User variables
        const created = moment(member.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a');
        const joined = moment(member.joinedTimestamp).format('dddd, MMMM Do YYYY, h:mm:ss a');
        let createdt = moment(member.user.createdAt).fromNow()
        let joinedt = moment(member.joinedTimestamp).fromNow()
        let memberavatar = member.user.displayAvatarURL()

        const user = `<@${member.id}>`

        const embed = new Discord.Embed()
            .setAuthor({name: `${member.user.tag}`, iconURL: memberavatar})
            .setThumbnail(memberavatar)
            .setDescription(user)
            .setColor(Discord.Util.resolveColor(member.displayHexColor))
            //fields
            .addField({name: `User ID`, value: `${member.id}`})
            .addField({name: `Created on Discord`, value: `${created} (${createdt})`})
            .addField({name: `Joined to ${message.guild.name}`, value: `${joined} (${joinedt})`})
            .addField({name: `Highest Role`, value: `${member.roles.highest}`})
        message.channel.send({ embeds: [embed] });


    }
})