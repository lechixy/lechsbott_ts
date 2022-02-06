// import { PREFIX } from '../../config.json'
// import { Command } from '../../structures/Command'
// import Discord, { TextChannel } from 'discord.js'
// import { roleColor } from '../../util/lechsFunctions'

// export default new Command({
//     name: 'nuke',
//     description: 'Destroys current channel and creates new one!',
//     category: 'Moderation',
//     arguments: `<none>`,
//     userPermissions: ['ManageChannels'],
//     clientPermissions: ['ManageChannels'],
//     async execute({client, message, args, cmd}) {

//         if(message.channel.type !== 0) return

//         let oldperms = message.channel.permissionOverwrites.cache
//         let oldtopic = message.channel.topic

//         message.channel.clone().then(async (ch: TextChannel) => {
//             if(message.channel.type !== 0) return

//             ch.setParent(message.channel.parent.id)
//             ch.setPosition(message.channel.position)
//             ch.permissionOverwrites.set(oldperms)
//             ch.setTopic(oldtopic)
//             message.channel.delete()

//             const embed = new Discord.Embed()
//                 .setAuthor({name: message.author.tag, iconURL: message.member.displayAvatarURL()})
//                 .setColor(Discord.Util.resolveColor(roleColor(message)))
//                 .setTitle(`This channel has been nuked by ${message.author.username}`)
//                 .setDescription(`All permissions and the topic are synced from old channel!`)
//                 .setTimestamp()
//             return ch.send({ embeds: [embed] }).catch(err => {})
//         })

//     }
// })