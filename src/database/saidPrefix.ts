import { ExtendedInteraction } from '../typings/SlashCommand';
import said from './models/saidPrefix';

export default async function saidPrefix(message){

    try {

        said.findOne({ userID: message.member.id }, async (err, data) => {
            if (err) throw err;

            if (data) {
                return await said.findOneAndUpdate({ userID: message.user.id }, { $inc: { timeSaid: 1 }, $set: { userTag: message.member.user.tag, lastSaid: Date.now(), } })
            } else {
                return said.create({
                    userID: message.user.id,
                    userTag: message.user.tag,
                    lastSaid: Date.now(),
                    timeSaid: 1
                })
            }

        })

    } catch (err) {
        return console.log(err)
    }
}