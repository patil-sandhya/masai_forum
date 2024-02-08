const express = require("express")
const {PostModel} = require("../Model/PostModel")
const {auth} = require("../Middleware/auth")
const postRouter = express.Router()



///api/posts?category=design
postRouter.get('/api/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const category = req.query.category; 
    const title = req.query.title; 
  
    try {
      let query = {};
      if (category) {
        query = { category: category }; 
      }
  
      if (title) {
        query = { title: title};
      }
      const posts = await PostModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
        const totalPost = await PostModel.find()
        const len = totalPost.length
        console.log(len)
        res.status(200).send({total: len, Posts: posts})
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });






// /api/posts?title=”Post Title”
// postRouter.get('/api/posts', async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const title = req.query.title; 
//     try {
//       let query = {};
//       if (title) {
//         query = { title: title};
//       }
  
//       const posts = await PostModel.find(query)
//         .skip((page - 1) * limit)
//         .limit(limit);
  
//         res.status(200).send(posts)
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

postRouter.get("/api/products/:post_id", async(req,res)=>{
    const {post_id} = req.params
    try {
        const posts = await PostModel.find({_id:post_id})
        res.status(200).send(posts)
    } catch (error) {
        console.log(error)
    }
})


// /api/posts?page=1&limit=5 
postRouter.get('/api/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
  
    try {
      const posts = await PostModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
        res.status(200).send(posts)
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});


postRouter.post("/api/posts", auth, async(req,res)=>{
    try {
        const newpost = new PostModel(req.body)
        await newpost.save()
        res.status(200).send({msg:"Post created", Post: req.body})
    } catch (error) {
        console.log(error)
    }
})

postRouter.patch("/api/posts/:post_id",auth, async(req,res)=>{
    let {id} = req.params
    try {
        await PostModel.findByIdAndUpdate({_id: id}, req.body)
        res.status(200).send({msg: "Product Updated"})
    } catch (error) {
        console.log(error)
    }
})

postRouter.delete("/api/posts/:post_id",auth, async(req,res)=>{
    let {id} = req.params
    try {
        await PostModel.findByIdAndDelete({_id: id}, req.body)
        res.status(200).send({msg: "Product Deleted"})
    } catch (error) {
        console.log(error)
    }
})


postRouter.post('/api/posts/:post_id/like', auth, async (req, res) => {
    const postId = req.params.post_id;
    const userId = req.headers.userid
  
    try {
      const post = await PostModel.findById(postId);
      console.log(post)
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      if (post.like.includes(userId)) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }

      post.like.push(userId);
      await post.save();
  
      res.status(200).json({ message: 'Post liked successfully', post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

//comments
postRouter.post('/api/posts/:post_id/comment', auth, async (req, res) => {
    const postId = req.params.post_id;
    const userId = req.headers.userid
    const { comment } = req.body;
  
    try {
      const post = await PostModel.findById(postId);
      console.log(post)
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({userId,comment});
      await post.save();
  
      res.status(200).json({ message: 'Comment added successfully', post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = {
    postRouter
}