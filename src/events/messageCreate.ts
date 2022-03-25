import { Event } from "../structures/Event";
import Discord from 'discord.js'
import { client } from "../index";
import { roleColor } from "../util/lechsFunctions";
import { OWNERS } from "../util/lechsTypings";
import afkCheck from '../database/afk'
import saidPrefix from "../database/saidPrefix";
import getPrefix from "../database/getPrefix";
import { ExtendedMessage } from "../typings/Command";

const cooldowns: Discord.Collection<string, any> = new Discord.Collection();

export default new Event("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild.me.permissions.has('SendMessages')) return;

    afkCheck(message)
    //console.log(`${message.content} | ${message.guild.name}`);

    let prefix = await getPrefix(message)

    if (!message.content.startsWith(prefix)) return

    if (!message.guild.me.permissions.has('Administrator')) {
        const embed = new Discord.Embed()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTitle('Missing permissions for lechsbott')
            .setDescription(`Need to \`Administrator\` permission to execute commands`)
            .setColor(Discord.Util.resolveColor('Red'))
        return message.channel.send({ embeds: [embed] }).catch(err => { })
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLocaleLowerCase();

    const command = client.commands.get(cmd) ||
        client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (!command) return;

    try {
        if (command) {

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            if (command.cooldown && command.cooldown !== 0) {
                const current_time = Date.now();
                const time_stamps = cooldowns.get(command.name);
                const cooldown_amount = (command.cooldown) * 1000;

                if (time_stamps.has(message.author.id)) {
                    const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

                    if (current_time < expiration_time) {
                        const time_left = (expiration_time - current_time) / 1000;

                        console.log(`${message.author.tag} used ${prefix}${command.name} many times and catched to ${time_left.toFixed(1)}s cooldown`)

                        let embed = new Discord.Embed()
                            .setColor(Discord.Util.resolveColor('Red'))
                            .setDescription(`**Slowly slowly, please wait ${time_left.toFixed(1)}s to type a command**`)
                        return message.channel.send({ embeds: [embed] })
                    }
                }

                //If the author's id is not in time_stamps then add them with the current time.
                time_stamps.set(message.author.id, current_time);
                //Delete the user's id once the cooldown is over.
                setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);
            }

            saidPrefix(message)

            if (command.ownerOnly && command.ownerOnly === true) {

                if (!OWNERS.includes(message.author.id)) {
                    return console.log(`${message.author.tag} tried use an owner command!`)
                } else {
                    console.log(`${message.author.tag} used an owner command ${cmd} in ${message.guild.name}`)

                    return command.execute({ client, message, args, cmd })

                }
            }

            if (command.userPermissions && command.userPermissions.length && message.guild.ownerId !== message.author.id) {
                let rawperms = []

                command.userPermissions.forEach(x => {
                    rawperms.push(x)
                })

                if (!message.member.permissions.has(rawperms)) {
                    const embed = new Discord.Embed()
                        .setColor(Discord.Util.resolveColor('Red'))
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setTitle('Missing permissions for you')
                        .setDescription(`You can't use this command, need to \`${rawperms.join(' ')}\` permission(s) to use it!`)
                    return message.channel.send({ embeds: [embed] });
                }
            }
            if (command.clientPermissions) {
                let rawperms = []

                command.clientPermissions.forEach(x => {
                    rawperms.push(x)
                })

                if (!message.guild.me.permissions.has(rawperms)) {
                    const embed = new Discord.Embed()
                        .setColor(Discord.Util.resolveColor('Red'))
                        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                        .setTitle('Missing permissions for lechsbott')
                        .setDescription(`We can't execute this command, need to \`${rawperms.join(' ')}\` permission(s) to use it!`)
                    return message.channel.send({ embeds: [embed] });
                }
            }

            console.log(`${message.author.tag} has used ${prefix}${cmd} in ${message.guild.name}`)
            command.execute({ client, message, args, cmd }).catch(error => errorFunction(error, message))

        }
    } catch (err) {
        return errorFunction(err, message)
    }

})

function errorFunction(error: string, message: ExtendedMessage) {
    console.log(error)
    let errembed = new Discord.Embed()
        .setColor(Discord.Util.resolveColor('Red'))
        .setTitle('There was an error trying to execute this command!')
    message.channel.send({ embeds: [errembed] })
}