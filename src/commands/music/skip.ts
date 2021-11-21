import Discord from 'discord.js'
import { Command } from '../../structures/Command';
import { roleColor } from '../../util/lechsFunctions';

export default new Command({
    name: 'skip',
    description: 'Skips tracks and play next one if available!',
    cooldown: 3,
    category: ['Music'],
    arguments: `<none>`,
    async execute({client, message, args, cmd}) {

        const queue = client.queue
        const server_queue = queue.get(message.guild.id)

        const voice_channel = message.member.voice.channel

        if (!voice_channel) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**You need to be in a voice channel to execute this command**`)
            return message.channel.send({ embeds: [embed] });
        }
        if (!server_queue) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**There is nothing playing on this server**`)
            return message.channel.send({ embeds: [embed] });
        } else {
            if (voice_channel.id !== server_queue.voiceChannel.id) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor(message))
                    .setTitle(`You need to be in same voice channel with lechsbott`)
                    .setDescription(`Sorry but you can't use skip, please make sure you're on the same channel as lechsbott`)
                return message.channel.send({ embeds: [embed] });
            }
        }

        if (!server_queue.songs[1]) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**There is no song to skip after this song in the queue**`)
            return message.channel.send({ embeds: [embed] });
        }

        try {
            server_queue.audioPlayer.stop(true);

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**Skipped to** \`${server_queue.songs[0].title}\``)
            return message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setDescription(`**There was an error on skipping try later!**`)
            return message.channel.send({ embeds: [embed] });
        }
    }
})