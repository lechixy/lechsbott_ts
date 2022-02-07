import { SlashCommand } from "../../structures/SlashCommand";
import Discord from 'discord.js'
import * as embeds from './embeds/all'
import { roleColor } from "../../util/lechsFunctions";

export default new SlashCommand({
    name: "loop",
    description: "Changes the playback mode of the queue!",
    execute({client, interaction, args}){
        let voice_channel = interaction.member.voice.channel
        let queue = client.queue.get(interaction.guildId)

        if(!voice_channel){
            return interaction.followUp({embeds: [embeds.noVoiceChannel(interaction)]})
        }

        if(!queue){
            return interaction.followUp({embeds: [embeds.noQueue(interaction)]})
        } else {
            if (voice_channel.id !== queue.voiceChannel.id) {
                return interaction.followUp({embeds: [embeds.sameChannel(interaction)]})
            }
        }

        let status = {
            default: "looptrack",
            looptrack: "default",
            // loopqueue: "",
        }

        if(queue.mode === "default"){
            queue.mode = status.default

            let embed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(interaction)))
            .setTitle(`Looping the queue`)
            .setDescription(`Playback mode is now **looping track** and the first track will looping`)
            return interaction.followUp({embeds: [embed]})
        } else if(queue.mode === "looptrack"){
            queue.mode = status.looptrack

            let embed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(interaction)))
            .setTitle(`Default playing`)
            .setDescription(`Playback mode is now **default playing** and the tracks are will playing with queue`)
            return interaction.followUp({embeds: [embed]})
        }

    }
})