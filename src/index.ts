import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { LinkModel, UserModel } from "./db.js";
import { ContentModel } from "./db.js";
import { userMiddleware } from "./middleware.js";
import { random } from "./utils.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {

    // ToDo: Implement zod validation and hash password

    const {username,password} = req.body;

        try{
            await UserModel.create({
                username,
                password
            })
            res.json({
                message: "User Signed Up"
            })
        }
        catch(e){
            res.status(403).json({
                message: "Username not available"
            })
        }
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await UserModel.findOne({
        username,
        password
    })

    if(foundUser){
        const token = jwt.sign({
            id: foundUser._id
        }, JWT_SECRET)
        res.json({
            token:token
        })
    }
    else{
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { type, link, title } = req.body;

    await ContentModel.create({
        type,
        link,
        title,
        // @ts-ignore
        userId: req.userId,
        tag: []
    })
    res.json({
        message: "Content Created"
    })

})

app.get("/api/v1/content",userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId
    }).populate("userId", "username")
    res.json({
        content
    })
})


app.delete("/api/v1/content",userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId =  req.userId
    const {contentId} = req.body;
    console.log("🚀 ~ contentId:", contentId)

    await ContentModel.deleteOne({
        _id: contentId,
        userId
    })
    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware, async (req, res) => {
    const { share } = req.body;
    if(share){
        const existingLink = await LinkModel.findOne({
            // @ts-ignore
            userId: req.userId
        })
        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash =  random(10);
        await LinkModel.create({
            // @ts-ignore
            userId: req.userId,
            hash
    })
    res.json({
        message: hash
    })
    }else{
        await LinkModel.deleteOne({
            // @ts-ignore
            userId: req.userId
        })
        res.json({
            message: "Deleted shareable link"
        })
    }
})

app.get("/api/v1/brain/:sharableLink", async (req, res) => {
    const hash = req.params.sharableLink;

    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message: "Wrong Link/ROute"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if(!user){
        res.status(411).json({
            message: "User does not exist"
        })
        return;
    }

    res.json({
        username:user.username,
        content:content
    })
})

app.listen(PORT, () => {
    console.log("Server Started");
});