import { Command } from "../../structures/Command";

module.exports = new Command({
    name: "say",
    aliases: ["echo"],
    ownerOnly: true,
    category: 'Owner',
    async execute({ client, message, args, cmd }) {
        if (!args[0]) {
            return message.channel.send({ content: `Hmm need to somethings to send.` })
        }
        message.delete()

        let msg = args.join(" ");
        message.channel.send(msg)

    }
})