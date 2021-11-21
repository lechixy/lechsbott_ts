import { PREFIX } from '../../config.json'
import * as Voice from '@discordjs/voice'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";

export default new Command({
    name: 'join',
    aliases: ['jointo'],
    description: 'Make lechsbott join to your channel!',
    category: ['Music'],
    arguments: `<Channel Name | none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        if (cmd === 'join') {

            const voiceChannel = message.member.voice.channel

            if (!voiceChannel) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(`You need to be on a voice channel for lechsbott to join!`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Want **lechsbott** to join a specified voice channel?`)
                    .addField('Just use', `${PREFIX}jointo <channel name>`)
                return message.channel.send({ embeds: [embed] });
            } else {

                if (server_queue) {

                    if (voiceChannel.id !== server_queue.voiceChannel.id) {
                        const embed = new Discord.MessageEmbed()
                            .setColor(roleColor(message))
                            .setAuthor(`There is currently playing a song on another voice channel`, message.author.displayAvatarURL({ dynamic: true }))
                        return message.channel.send({ embeds: [embed] });
                    }
                }

                let joiner = Voice.joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                try {
                    await Voice.entersState(
                        joiner,
                        Voice.VoiceConnectionStatus.Ready,
                        20000
                    );
                } catch {
                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor(message)).setDescription(
                            `**Failed to join voice channel within 20 seconds, please try again later!**`
                        );
                    message.channel.send({ embeds: [embed] });
                    return;
                }

                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`**lechsbott** successfully joined to <#${voiceChannel.id}>`)
                message.channel.send({ embeds: [embed] });
            }
        } else if (cmd === 'jointo') {

            if (server_queue) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(`There is currently playing a song on voice channel`, message.author.displayAvatarURL({ dynamic: true }))
                return message.channel.send({ embeds: [embed] });
            }

            if (!args[0]) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setAuthor(`What are you looking for?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('Please type voice channel name for lechsbott join to it!\nRemember! iT iS cAsE sEnSeTiVe')
                    .addField('Usage', `${PREFIX}${cmd} **<voice channel name>**`)
                return message.channel.send({ embeds: [embed] });
            }

            const c = message.guild.channels.cache.find(ch => ch.name.includes(args.join(' ')) && ch.type.includes('GUILD_VOICE'))

            if (!c) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setDescription(`I couldn't find **a voice channel** within **${args.join(' ')}** name,\nplease pay attention to channel name and uppercase, lowercase letters!`)
                return message.channel.send({ embeds: [embed] });
            }

            let joiner = Voice.joinVoiceChannel({
                channelId: c.id,
                guildId: c.guild.id,
                adapterCreator: c.guild.voiceAdapterCreator,
            });

            try {
                await Voice.entersState(
                    joiner,
                    Voice.VoiceConnectionStatus.Ready,
                    20000
                );
            } catch {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message)).setDescription(
                        `**Failed to join voice channel within 20 seconds, please try again later!**`
                    );
                message.channel.send({ embeds: [embed] });
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**lechsbott** successfully joined to <#${c.id}>`)
            message.channel.send({ embeds: [embed] });

        }
    }
})

