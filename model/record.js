import mongoose from "mongoose"

const recordSchema= mongoose.Schema({
    phone:{
        type:String,

    },
    amount:{
        type:String
    }
},{timestamps:true})

export default mongoose.model('record',recordSchema)