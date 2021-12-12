import { Command } from "../../structures/Command";
import Discord from 'discord.js'
import * as embeds from './embeds/all'
import { roleColor } from "../../util/lechsFunctions";

export default new Command({
    name: "loop",
    aliases: ["loopmode", "mode", "playbackmode"],
    category: 'Music',
    description: "Changes the playback mode of the queue",
    cooldown: 3,
    execute({client, message, args, cmd}){
        let voice_channel = message.member.voice.channel
        let queue = client.queue.get(message.guildId)

        if(!voice_channel){
            return message.channel.send({embeds: [embeds.noVoiceChannel(message)]})
        }

        if(!queue){
            return message.channel.send({embeds: [embeds.noQueue(message)]})
        } else {
            if (voice_channel.id !== queue.voiceChannel.id) {
                return message.channel.send({embeds: [embeds.sameChannel(message)]})
            }
        }

        let status = {
            default: "looptrack",
            looptrack: "default",
            // loopqueue: "",
        }

        if(queue.mode === "default"){
            queue.mode = status.default

            let embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setTitle(`Looping the queue`)
            .setDescription(`Playback mode is now **looping track** and the first track will looping`)
            return message.channel.send({embeds: [embed]})
        } else if(queue.mode === "looptrack"){
            queue.mode = status.looptrack

            let embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setTitle(`Default playing`)
            .setDescription(`Playback mode is now **default playing** and the tracks are will playing with queue`)
            return message.channel.send({embeds: [embed]})
        }

    }
})