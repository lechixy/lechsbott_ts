import { PREFIX } from '../../config.json'
import { Command } from '../../structures/Command'

export default new Command({
    name: "reload",
    description: "",
    aliases: ['sreload'],
    ownerOnly: true,
    category: 'Owner',
    async execute({client, message, args, cmd}) {


        if (cmd === 'reload') {
            if (!args[0]) {
                return message.channel.send({ content: `**Please specify a category:** \`${PREFIX}${cmd} <category> <command>\`` });
            }

            if (!args[1]) {
                return message.channel.send({ content: `**Please specify a command:** \`${PREFIX}${cmd} <category> <command>\`` });
            }

            let category = args[0];
            let command = args[1].toLowerCase();
            let endext = command.endsWith('.ts') ? command : command + '.ts'

            try {
                client.commands.delete(command);
                const pull = await import(`../../commands/${category}/${endext}`);
                client.commands.set(command, pull);

                return message.channel.send(`**${endext}** was reloaded succesfully!`);
            } catch (error) {
                return message.channel.send(
                    `There was an error trying to reload **${endext}**:\n\`\`\`${error.message}\`\`\``
                );
            }
        } else if (cmd === 'sreload') {

            if (!args[0]) {
                return message.channel.send({ content: `**Please specify a category:** \`${PREFIX}${cmd} <category> <command>\`` });
            }

            if (!args[1]) {
                return message.channel.send({ content: `**Please specify a command:** \`${PREFIX}${cmd} <category> <command>\`` });
            }

            let category = args[0];
            let command = args[1].toLowerCase();
            let endext = command.endsWith('.ts') ? command : command + '.ts'

            try {

                delete require.cache[
                    require.resolve(`../../slashCommands/${category}/${endext}`)
                ]; //Change the path depending on how are your folders located.
                client.slashCommands.delete(command);
                const pull = require(`../../slashCommands/${category}/${endext}`);
                client.slashCommands.set(command, pull);

                return message.channel.send(`**${endext}** was reloaded succesfully!`);
            } catch (error) {
                return message.channel.send(
                    `There was an error trying to reload **${endext}**:\n\`\`\`${error.message}\`\`\``
                );
            }

        }
    }
})