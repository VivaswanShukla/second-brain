import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { UserModel } from "./db.js";
import { ContentModel } from "./db.js";
import { userMiddleware } from "./middleware.js";

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

app.listen(PORT, () => {
    console.log("Server Started");
});