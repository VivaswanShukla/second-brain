import express from "express";
import { UserModel } from "./db.js";
import jwt from "jsonwebtoken";
const app = express();

const JWT_SECRET = "atmkbfjg";
const PORT = 3000;
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {

    // ToDo: Implement zod validation and hash password

    const username = req.body.username;
    const password = req.body.password;

        try{
            await UserModel.create({
                username: username,
                password: password
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

app.post("/api/v1/content", (req, res) => {

})

app.get("/api/v1/content", (req, res) => {
    
})

app.delete("/api/v1/content", (req, res) => {
    
})

app.listen(PORT, () => {
    console.log("Server Started");
});