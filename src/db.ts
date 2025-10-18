import mongoose, {model, Schema} from "mongoose";
mongoose.connect("mongodb://localhost:27017/SecondBrain")

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
})

export const UserModel = model('User', UserSchema);

const ContentPostSchema = new Schema({
    type: String,
    link: String,
    title: String,
    tags:[{
        type: mongoose.Types.ObjectId,
        ref: 'Tag'
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

export const ContentModel = model('Content', ContentPostSchema);