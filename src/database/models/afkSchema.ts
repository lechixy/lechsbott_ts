import mongoose from 'mongoose'

let Schema = new mongoose.Schema({
    Guild: String,
    Member: String,
    Content: String,
    TimeAgo: String
})

export default mongoose.model('afk', Schema)
