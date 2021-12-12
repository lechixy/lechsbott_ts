import profileModel from './models/profileSchema'
import { Message } from 'discord.js'

export default async function userCheck(message: Message) {
    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id })
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                bank: 0,
                accepted: false,
            })
            profile.save();
        }
    } catch (err) {
        console.log(err);
    }
}