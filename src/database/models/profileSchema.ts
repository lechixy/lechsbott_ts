import mongoose from 'mongoose'


const profileSchema = new mongoose.Schema({
    userID: {  type: String, required: true, unique: true },
    serverID: { type: String, required: true },
    coins: { type: Number, default: 1000 },
    bank: { type: Number },
    accepted: { type: Boolean, default: false }
})

export default mongoose.model("ProfileModels", profileSchema)