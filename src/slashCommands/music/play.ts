// import { SlashCommand } from "../../structures/SlashCommand";
// import Discord from 'discord.js'
// import { songFinder } from "../../structures/Music/functions/songFinder";
// import { roleColor } from "../../util/lechsFunctions";
// import { lechs_Subscription } from '../../structures/Music/Subscription';
// import { joinVoiceChannel, entersState, VoiceConnectionStatus } from '@discordjs/voice';

// export default new SlashCommand({
//     name: "play",
//     description: "Adds track and plays song in voice channels!",
//     options: [
//         {
//             name: "query",
//             description: "Which's gonna we play music today?",
//             type: "STRING",
//             required: true,
//         }
//     ],
//     async execute({ client, interaction, args }) {
//         let subscription = client.queue.get(interaction.guildId);
//         const channel = interaction.member.voice.channel;

//         if (!channel) {
//             let voiceembed = new Discord.MessageEmbed()
//                 .setColor(roleColor(interaction))
//                 .setAuthor(
//                     `You need to be in a voice channel for play a music!`,
//                     interaction.member.displayAvatarURL({ dynamic: true })
//                 )
//             return await interaction.followUp({ embeds: [voiceembed] });
//         }


//         if (!subscription) {
//             subscription = new lechs_Subscription(
//                 joinVoiceChannel({
//                     channelId: channel.id,
//                     guildId: channel.guild.id,
//                     adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
//                     selfDeaf: true
//                 }), interaction);
//             client.queue.set(interaction.guildId, subscription);

//             subscription.textChannel = interaction.channel
//             subscription.lastRespond = interaction;
//         } else {
//             if (channel.id !== subscription.voiceChannel.id) {
//                 const embed = new Discord.MessageEmbed()
//                     .setColor(roleColor(interaction))
//                     .setAuthor(`There is currently playing a song on another voice channel`, interaction.member.displayAvatarURL({ dynamic: true }))
//                 return await interaction.followUp({ embeds: [embed] });
//             }

//             //resfresh text channel
//             subscription.textChannel = interaction.channel
//             subscription.lastRespond = interaction;
//         }

//         try {
//             await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
//         } catch (error) {

//             client.queue.delete(interaction.guildId)
//             console.log(error)
//             const embed = new Discord.MessageEmbed()
//                 .setColor(roleColor(interaction)).setDescription(
//                     `**Failed to join voice channel within 20 seconds, please try again later!**`
//                 );
//             await interaction.followUp({ embeds: [embed] });
//             return;
//         }

//         songFinder(interaction, args.getString('query').split(' '))
//     }
// })