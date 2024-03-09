import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js"
// initialise exxpress
const app = express()

// express middleware that convert request body to JSON.
app.use(express.json())
app.use(cors([
    "http://localhost:5500"
]))
//configure database
connectDB()
// import routes
//import lipaNaMpesaRoutes from "./routes/routes.lipanampesa.js"
//app.use('/api',lipaNaMpesaRoutes)
app.get("/",(req,res)=>{
res.send({
    message:"Server run nicely! ready for stk push request"
})
})
const port = process.env.PORT
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})



