import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
	name: "slowmode",
	aliases: ["setslow", "cooldown", "setcooldown"],
	description: 'Set slow mode for a text channel',
	category: 'Moderation',
	arguments: `<number between 0 and 21600>`,
	userPermissions: ['ManageChannels'],
	clientPermissions: ['ManageChannels'],
	async execute({ client, message, args, cmd }) {

		let number = parseInt(args[0])
		const channel = message.channel;

		if (channel.type !== 0) return

		if (!args[0] || args[0] === "0") {

			if (channel.rateLimitPerUser === 0) {
				let settedembed = new Discord.Embed()
					.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
					.setTitle(`Slow mode is already disabled for #${channel.name}`)
					.setColor(Discord.Util.resolveColor('Red'))
				return message.channel.send({ embeds: [settedembed] })
			}

			if (!args[0]) number = 0

			channel.setRateLimitPerUser(number, `Moderated by ${message.author.tag}`);

			let settedembed = new Discord.Embed()
				.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
				.setTitle(`Slow mode is disabled for #${channel.name}`)
				.setDescription(`Members can send message without cooldown!`)
				.setColor(Discord.Util.resolveColor('Green'))
			return message.channel.send({ embeds: [settedembed] })

		}

		if (isNaN(number)) {
			const embed = new Discord.Embed()
				.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
				.setDescription(`Cooldown amount needs to be number!`)
				.setColor(Discord.Util.resolveColor('Red'))
			return message.channel.send({ embeds: [embed] });
		}

		if (number > 21600 || number < 0) {

			const embed = new Discord.Embed()
				.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
				.setDescription(`Cooldown amount needs to between 0 and 21600!`)
				.addField({ name: "Usage", value: `${cmd} **<0-21600>**` })
				.setColor(Discord.Util.resolveColor('Red'))
			return message.channel.send({ embeds: [embed] });
		}

		channel.setRateLimitPerUser(number, `Moderated by ${message.author.tag}`);

		let settedembed = new Discord.Embed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
			.setTitle(`Slow mode is enabled for #${channel.name}`)
			.setDescription(`Members can send one message every ${args[0]} seconds!`)
			.setColor(Discord.Util.resolveColor('Green'))
		return message.channel.send({ embeds: [settedembed] })

	}
})