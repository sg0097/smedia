const Post = require("../models/post");
const User = require("../models/User");


exports.createPost = async (req,res) => {
    try{
        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url",
            },
            owner: req.user._id,
        };
        const post = await Post.create(newPostData);
        
        const user = await User.findById(req.user._id);

        user.posts.push(post._id);

        await user.save();
        res.status(201).json({
            success:true,
            post:post,
        });

    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

exports.deletePost = async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        }
        await post.remove();

        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();
        res.status(200).json({
            success:true,
            message:"post deleted",
        });
    } 
    catch (error){
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};


exports.likeAndUnlikePost = async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
         
        if(!post){
            return res.status(404).json({
             success: false,
             message: "post not found"   
            })
        }

        if(post.likes.includes(req.user._id)){
            const index=post.likes.indexOf(req.user._id);

            post.likes.splice(index,1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post unliked",
            });
        }
        
        else{
        post.likes.push(req.user._id);
        await post.save();
        return res.status(200).json({
            success: true,
            message: "post liked",
        });
        }

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message,
        })
    }
};



exports.getpostoffollowing = async(req,res) => {
    try{
       const user = await User.findById(req.user._id).populate("following","posts");

       res.status(200).json({
        success: true,
        following: user.following,
       });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
           });
    }
};
exports.addcomment = async (req,res) => {
    try{
       const post =await Post.findById(req.params.id);
       if(!post){
        return res.status(404).json({
       success: false,
       message:"Post not found",
        });
       }
       

       let commentindex=-1;
      
       post.comments.forEach((item,index) => {
       if(item.user.toString() === req.user._id.toString()){
         commentindex = index;
       }
       });
       
       if(commentindex !== -1){
       post.comments[commentindex].comment=req.body.comment;

       await post.save();
       return res.status(200).json({
        success:true,
        message: "comment updated",
    }); 
       }
       else{
        post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
        }); 
        await post.save();
        return res.status(200).json({
            success:true,
            message: "comment added",
        });  
     
    }


}



    catch(error){

    }
};
