import mongoose from 'mongoose'
import userModel from './user.model.js'

const chatSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      
    },
    title: {
      type: String,
      required: true,
      default:'new chat',
    }
  },
  {
    timestamps: true
  }
)

const chatModel = mongoose.model('Chats' , chatSchema );

export default chatModel;
