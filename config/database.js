import mongoose from 'mongoose'

export const connect = async()=>{
await mongoose.connect('mongodb://127.0.0.1:27017/SERVICES4U')
      .then(()=>{
        console.log("database connected successfully");
      })
}