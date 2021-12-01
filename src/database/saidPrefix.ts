import said from './models/saidPrefix';

export default async function saidPrefix(message) {

    try {

        said.findOne({ userID: message.author.id }, async (err, data) => {
            if (err) throw err;

            if (data) {
                return await said.findOneAndUpdate({ userID: message.author.id }, { $inc: { timeSaid: 1 }, $set: { userTag: message.author.tag, lastSaid: Date.now(), } })
            } else {
                return said.create({
                    userID: message.author.id,
                    userTag: message.author.tag,
                    lastSaid: Date.now(),
                    timeSaid: 1
                })
            }

        })

    } catch (err) {
        return console.log(err)
    }
}