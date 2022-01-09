import { Command } from '../../structures/Command'
import { converToCode } from '../../util/lechsFunctions'

export default new Command({
    name: 'memory',
    aliases: ['checkmemory', 'mem'],
    ownerOnly: true,
    category: 'Owner',
    async execute({client, message, args, cmd}) {

        let mem = `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB/${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS`

        console.log(`${mem}`)
        message.channel.send({ content: `${converToCode(mem)}` })

    }
})