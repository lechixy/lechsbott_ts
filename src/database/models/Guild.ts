import mongoose from 'mongoose'

const schemaOfGuild = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        required: true,
        default: "l!"
    },
    logChannel: {
        type: String,
        required: false,
    }
})

export default mongoose.model("Guilds", schemaOfGuild)