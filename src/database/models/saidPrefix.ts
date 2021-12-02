import mongoose from 'mongoose'

let schema = new mongoose.Schema({
    userID: String,
    userTag: String,
    lastSaid: String,
    timeSaid: String,
})

export default mongoose.model("saidPrefix", schema)