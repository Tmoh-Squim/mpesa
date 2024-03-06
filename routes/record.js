import express from "express"
import {Callback} from "../controllers/callback.js"
const router = express();
router.post('/record',Callback)

export default router;