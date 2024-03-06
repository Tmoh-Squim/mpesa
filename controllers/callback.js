import stkModel from "../model/record.js"

export const Callback = async(req,res)=>{
    try {
        console.log(req.body);
        
        const {phone,amount} = req.body;

        const newRecord={
            phone:phone,
            amount:amount
        }
        const record = await  stkModel.create(newRecord)

        res.send({
            success:true,
            record
        })
    } catch (error) {
        console.log(error)
    }
}