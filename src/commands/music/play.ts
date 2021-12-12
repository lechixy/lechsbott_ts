//Importing needs
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions';
import { Command } from "../../structures/Command";
import { lechs_Subscription } from '../../structures/Music/Subscription';
import { joinVoiceChannel, entersState, VoiceConnectionStatus } from '@discordjs/voice';
import { songFinder } from '../../structures/Music/functions/songFinder';
import { PREFIX } from '../../config.json'

export default new Command({
	name: 'play',
	cooldown: 5,
	aliases: ['p'],
	description: 'Play songs in voice channel!',
	syntax: `${PREFIX}play kiss me more\n${PREFIX}play https://www.youtube.com/watch?v=0EVVKs6DQLo`,
	category: 'Music',
	arguments: `<youtube search/link/playlist\nspotify link/playlist\n soundcloud link/playlist>`,
	async execute({ client, message, args, cmd }) {
		let subscription = client.queue.get(message.guildId);
		const channel = message.member.voice.channel;

		if (!channel) {
			let voiceembed = new Discord.MessageEmbed()
				.setColor(roleColor(message))
				.setAuthor(
					`You need to be in a voice channel for play a music!`,
					message.author.displayAvatarURL({ dynamic: true })
				)
			return await message.channel.send({ embeds: [voiceembed] });
		}

		if (!args[0]) {
			let argsembed = new Discord.MessageEmbed()
				.setColor(roleColor(message))
				.setAuthor(
					`l!${cmd} [query]`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.addField(`youtube`, `search/link/playlist`, true)
				.addField(`spotify`, `link/playlist`, true)
				.addField('soundcloud', 'link/playlist', true);
			return await message.channel.send({ embeds: [argsembed] });
		}

		if (!subscription) {
			subscription = new lechs_Subscription(
				joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
					selfDeaf: true
				}), message);
			client.queue.set(message.guildId, subscription);

			subscription.textChannel = message.channel
			subscription.lastRespond = message;
		} else {
			if (channel.id !== subscription.voiceChannel.id) {
				const embed = new Discord.MessageEmbed()
					.setColor(roleColor(message))
					.setAuthor(`There is currently playing a song on another voice channel`, message.author.displayAvatarURL({ dynamic: true }))
				return await message.channel.send({ embeds: [embed] });
			}

			//resfresh text channel
			subscription.textChannel = message.channel
			subscription.lastRespond = message;
		}

		try {
			await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
		} catch (error) {

			client.queue.delete(message.guildId)
			console.log(error)
			const embed = new Discord.MessageEmbed()
				.setColor(roleColor(message)).setDescription(
					`**Failed to join voice channel within 20 seconds, please try again later!**`
				);
			await message.channel.send({ embeds: [embed] });
			return;
		}

		songFinder(message, args)
	},
})