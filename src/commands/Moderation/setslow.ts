import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
	name: "slowmode",
	aliases: ["setslow", "cooldown", "setcooldown"],
	description: 'Set slow mode for a text channel',
	category: 'Moderation',
	arguments: `<number between 0 and 21600>`,
	userPermissions: ['MANAGE_CHANNELS'],
	clientPermissions: ['MANAGE_CHANNELS'],
	async execute({ client, message, args, cmd }) {

		let number = parseInt(args[0])

		if (args[0] && isNaN(number)) {
			let argsembed = new Discord.MessageEmbed()
				.setTitle(`Argument needs to be a number`)
				.setDescription(`Looks like you typed another thing from number!`)
				.addField("Usage", `${PREFIX}${cmd} **<for example: 10>**`)
				.setColor(roleColor(message))
			return message.channel.send({ embeds: [argsembed] })
		}

		if (args[0] && number > 21600 || number < 0) {
			let number1embed = new Discord.MessageEmbed()
				.setTitle(`Argument needs to between 0 and 21600`)
				.setDescription(`Looks like you reached the limit of the cooldown!`)
				.addField("Usage", `${PREFIX}${cmd} **<0-21600>**`)
				.setColor(roleColor(message))
			return message.channel.send({ embeds: [number1embed] })
		}

		if (message.channel.type !== "GUILD_TEXT") return

		const channel = message.channel;

		if (!args[0] || args[0] === "0") {

			if (channel.rateLimitPerUser === 0) {
				let settedembed = new Discord.MessageEmbed()
					.setTitle(`Slow mode is already disabled for #${channel.name}`)
					.setDescription(`You cannot do existing thing again`)
					.setColor(roleColor(message))
				return message.channel.send({ embeds: [settedembed] })
			}

			if (!args[0]) number = 0

			channel.setRateLimitPerUser(number, `Moderated by ${message.author.username}`);

			let settedembed = new Discord.MessageEmbed()
				.setTitle(`Slow mode is disabled for #${channel.name}`)
				.setDescription(`Members can send message without cooldown!`)
				.setColor(roleColor(message))
			return message.channel.send({ embeds: [settedembed] })

		} else {

			channel.setRateLimitPerUser(number, `Moderated by ${message.author.username}`);

			let settedembed = new Discord.MessageEmbed()
				.setTitle(`Slow mode is enabled for #${channel.name}`)
				.setDescription(`Members can send one message every ${args[0]} seconds!`)
				.setColor(roleColor(message))
			return message.channel.send({ embeds: [settedembed] })
		}

	}
})