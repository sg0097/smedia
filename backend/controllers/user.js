const User = require("../models/User");

exports.register = async (req,res) => {
    try{
        const{name,email,password} = req.body;

        let user = await User.findOne({email});
        if(user){
            return res
              .status(400)
              .json({success: false,manage: "User already exists"});

        }
        user = await User.create({
            name,
            email,
            password,
            avatar: {public_id:"sample_id",url: "sampleurl"},
    });
       

    const token = await user.generateToken();
    const options ={
        expires:new Date(Date.now()+90*24*60*60*1000),
        httpOnly:true,
    }
    res.status(201).cookie("token",token,options).json({
        success: true,
        user,
        token,
    });
    } 
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
exports.login = async (req,res) => {
    try {
        const { email, password} =req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }
        const isMatch = await user.matchPassword(password);
        

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }
        const token = await user.generateToken();
        const options ={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
        }
        res.status(200).cookie("token",token,options).json({
            success: true,
            user,
            token,
        });
    }
    catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
    }
}
exports.followUser = async (req,res) => {
    try{
        const usertoFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);


        if(!usertoFollow){
            return res.status(404).json({
                success:false,
                message: "user not found"
            });
        }
        if(loggedInUser.following.includes(usertoFollow._id)){


            const indexfollowing = loggedInUser.following.indexOf(usertoFollow._id);
            loggedInUser.following.splice(indexfollowing,1);

            const indexfollowers = loggedInUser.following.indexOf(usertoFollow._id);
            usertoFollow.followers.splice(indexfollowers,1);

            await loggedInUser.save();
            await usertoFollow.save();

            res.status(200).json({
                success:true,
                message: "User unfollowed",
              }); 

        }

        else{
        loggedInUser.following.push(usertoFollow._id);
        usertoFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await usertoFollow.save();
        res.status(200).json({
            success:true,
            message: "User followed",
          }); 
        }
         
    }
    catch(error){
        res.status(500).json({
          success:false,
          message: error.message,
        });  
        }
        
    };
