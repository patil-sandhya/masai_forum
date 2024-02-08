const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: { type: String, required: true, minlength: 1, maxlength: 50 },
    avatar: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}