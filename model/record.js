import mongoose from "mongoose"

const recordSchema= mongoose.Schema({
    Phone:{
        type:String,
        required:true

    },
    Amount:{
        type:String,
        required:true
    },
    CheckoutRequestID:{
        type:String,
        required:true
    },
    MpesaReceiptNumber:{
        type:String,
        required:true
    }
},{timestamps:true})



export default mongoose.model('record',recordSchema)