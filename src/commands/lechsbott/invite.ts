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
        
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setStyle("LINK")
                .setLabel('Click to invite')
                .setEmoji("🎁")
                .setURL(`${invitelink}`)
            )

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({dynamic: true}))
        .setTitle(`Here is a invite link for you ${message.author.username}`)
        .setURL(invitelink)
        .setColor(roleColor(message))
        .setDescription(`Just click button to add ${client.user.username} your server :blush:`)
        message.channel.send({ embeds: [embed], components: [row] });
        
        
  }
})