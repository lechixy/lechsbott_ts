import { Command } from "../../structures/Command";
import Discord from 'discord.js'
import { roleColor } from "../../util/lechsFunctions";
import { PREFIX } from '../../config.json'

export default new Command({
    name: "find",
    aliases: ['finduser','usersearch', 'searchuser', 'findperson'],
    description: "Search members with many in guild",
    category: 'Moderation',
    arguments: `<username | tag | id | nickname>`,
    userPermissions: ['ManageMessages'],
    clientPermissions: ['ManageMessages'],
    async execute({ client, message, args, cmd }) {

        const user = args.join(" ")
        if (!user) {
            const embed = new Discord.Embed()
                .setAuthor({name: `Need an query to find users in this server!`, iconURL: message.author.displayAvatarURL()})
                .addField({name: `Usage`, value: `${PREFIX}${cmd}`})
                .setColor(Discord.Util.resolveColor(roleColor(message)))
            return message.channel.send({ embeds: [embed] })
        }

        const array = [];

        let number = 1;

        message.guild.members.cache.forEach((use) => {
            if (use.user.username.toUpperCase() == user.toUpperCase() || use.user.id === user.toUpperCase() || use.user.tag.toUpperCase() == user.toUpperCase() || use.displayName.toUpperCase() == user.toUpperCase() || use.user.discriminator == user.toUpperCase() || `#${use.user.discriminator}` == user.toUpperCase()) {
                
                let data = {
                    user: `${use.user}`,
                    tag: `${use.user.tag}`,
                    id: `${use.user.id}`,
                    nickname: `${use.displayName == use.user.username ? "No Nickname" : use.displayName}`,
                }

                let string = `${number}) ${data.user}\n> ${data.tag}\n> ${data.id}\n> ${data.nickname}`

                array.push(string);
                number++
            }
        });

        const text = `${array.length === 0 ? 'No results found' : array.length === 1 ? '1 result found': `${array.length} results found`}`

        const embed = new Discord.Embed()
            .setAuthor({name: `Search results for ${user} in ${message.guild.name}`})
            .setDescription(array.join("\n") || "No Results Found")
            .setFooter({text})
            .setColor(Discord.Util.resolveColor(roleColor(message)))
        message.channel.send({ embeds: [embed] })
    },
})
