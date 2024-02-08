const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true, minlength: 1, maxlength: 50 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

const postSchema = mongoose.Schema({
    userId: { type: String, required: true, minlength: 1, maxlength: 50 },
    title: { type: String, required: true, maxlength: 100 },
    category: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String, required: true },
    like: { type: [String], default: [] },
    comments: { type: [commentSchema], default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const PostModel = mongoose.model("post", postSchema)

module.exports = {
    PostModel
}

// const productSchema = mongoose.Schema({
//     name: { type: String, required: true, minlength: 1, maxlength: 50 },
//     picture: { type: String, required: true },
//     description: { type: String, required: true },
//     gender: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     created_at: { type: Date, default: Date.now },
//     updated_at: { type: Date, default: Date.now }
// })