import db from '../../database/models/afkSchema'
import { Command } from '../../structures/Command'

export default new Command({
    name: 'afk',
    description:'Sets your status to afk!',
    category: ['Utility'],
    arguments: `<Status | none>`,
    async execute({client, message, args, cmd}) {

        let afkreason

        if(args[0] && !message.attachments.first()){
            afkreason = args.slice(0).join(' ')
        } else if(!args[0] && message.attachments.first()){
            afkreason = `${args.slice(0).join(' ')}\n${message.attachments.first().url}`
        } else if(!args[0]){
            afkreason = `AFK` 
        }

        db.findOne({ Guild: message.guild.id, Member: message.author.id }, async (err, data) => {
            if (!data) {
                let Data = new db({
                    Guild: message.guild.id,
                    Member: message.author.id,
                    Content: afkreason,
                    TimeAgo: Date.now()
                })
                Data.save()

                message.channel.send({ content: `<@${message.author.id}> is AFK: ${afkreason}` })
            } else {
                return
            }
        })
    }
})