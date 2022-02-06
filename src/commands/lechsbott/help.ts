import { roleColor, converToCode } from "../../util/lechsFunctions";
import Discord from 'discord.js'
import {APIEmbedField} from 'discord-api-types';
import { PREFIX } from '../../config.json'
import { Command } from "../../structures/Command";

export default new Command({
    name: "help",
    cooldown: 5,
    description: "How is working?",
    category: 'lechsbott',
    arguments: `<command | aliase | none>`,
    async execute({ client, message, args, cmd }) {

        if (!args[0]) {

            let allcmds = [];

            let disallowed = ['Owner']

            client.commands.forEach(cmd => {
                if (disallowed.includes(cmd.category)) {
                    return
                } else {

                    if (allcmds.find(x => x.name === cmd.category)) {
                        const cat = allcmds.findIndex(x => x.name === cmd.category)

                        return allcmds[cat].cmds.push(`\`${cmd.name}\``)
                    }

                    let data = {
                        name: cmd.category,
                        cmds: [`\`${cmd.name}\``],
                    }

                    allcmds.push(data)
                }
            })

            let fields: APIEmbedField[] = []

            allcmds.forEach(category => {
                let data = {
                    name: `${category.name} [${category.cmds.length}]`,
                    value: `${category.cmds.join(' ')}`
                }

                fields.push(data)
            })

            fields.sort((a, b) => {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            })

            const embed = new Discord.Embed()
                .setAuthor({name: `Command List`, iconURL: message.author.displayAvatarURL()})
                .setDescription(`A list of commands for help about complicated commands!\nNeed more information about command? Use \`${PREFIX}${cmd} <command>\``)
                .addFields(...fields)
                .setTimestamp()
                .setColor(Discord.Util.resolveColor(roleColor(message)))
            return message.channel.send({ embeds: [embed] });
        } else {

            const cmd = client.commands.get(`${args[0].toLowerCase()}`) || client.commands.find(a => a.aliases && a.aliases.includes(args[0]));

            if (!cmd) {
                const embed = new Discord.Embed()
                    .setTitle(`${args[0]} is not found`)
                    .setDescription(`You can try find with name of the command or a valid aliase for command!`)
                    .addField({name: `Usage`, value: `${PREFIX}help <command | aliase>`, inline: true})
                    .setColor(Discord.Util.resolveColor(roleColor(message)))
                return message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.Embed()
                    .setAuthor({name: `Command Information`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`${cmd.name}`)
                    .setColor(Discord.Util.resolveColor(roleColor(message)))
                    .setDescription(`${cmd.description || 'No description is available for command'}`)
                    .setTimestamp()

                if (cmd.aliases) {
                    embed.addField({name: `Aliases`, value: `${converToCode(cmd.aliases.join(', '))}`})
                }

                if (cmd.arguments) {
                    embed.addField({name: `Arguments`, value: `${converToCode(cmd.arguments)}`})
                }

                if(cmd.syntax){
                    embed.addField({name: `Usage`, value: `${converToCode(cmd.syntax)}`})
                }
                return message.channel.send({ embeds: [embed] });
            }

        }

    }
})