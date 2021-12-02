import mongoose from 'mongoose'

const serverSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true },
    prefix: { type: String, required: true },
})

export default mongoose.model("servers", serverSchema)