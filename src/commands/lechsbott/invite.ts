import { roleColor } from "../../util/lechsFunctions"
import Discord from 'discord.js'
import { Command } from "../../structures/Command"

export default new Command({
    name:'invite',
    aliases:['lechsbott'],
    description:'Get an invite link for lechsbott!',
    category: 'lechsbott',
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        let invitelink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
        
        const row = new Discord.ActionRow()
            .addComponents(
                new Discord.ButtonComponent()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel('Click to invite')
                .setURL(`${invitelink}`)
            )

        const embed = new Discord.Embed()
        .setAuthor({name: `${client.user.username}`, iconURL: client.user.displayAvatarURL()})
        .setTitle(`Here is a invite link for you ${message.author.username}`)
        .setURL(invitelink)
        .setColor(Discord.Util.resolveColor(roleColor(message)))
        .setDescription(`Just click button to add ${client.user.username} your server :blush:`)
        message.channel.send({ embeds: [embed], components: [row] });
        
        
  }
})