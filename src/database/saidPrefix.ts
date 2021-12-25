import { ExtendedInteraction } from '../typings/SlashCommand';
import said from './models/saidPrefix';
import { ExtendedMessage } from '../typings/Command';

export default async function saidPrefix(message: any){

    try {

        said.findOne({ userID: message.member.id }, async (err, data) => {
            if (err) throw err;

            if (data) {
                return await said.findOneAndUpdate({ userID: message.member.id }, { $inc: { timeSaid: 1 }, $set: { userTag: message.member.user.tag, lastSaid: Date.now(), } })
            } else {
                return said.create({
                    userID: message.member.id,
                    userTag: message.member.user.tag,
                    lastSaid: Date.now(),
                    timeSaid: 1
                })
            }

        })

    } catch (err) {
        return console.log(err)
    }
}