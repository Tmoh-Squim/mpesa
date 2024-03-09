import express from 'express'
const router = express.Router()
import {
    initiateSTKPush,
    stkPushCallback,
    confirmPayment


} from "../controllers/controllers.lipanampesa.js";
//God bless me

import {accessToken} from "../middlewares/middlewares.generateAccessToken.js";

router.route('/stkPush').post(accessToken,initiateSTKPush)
router.route('/stkPushCallback').post(stkPushCallback)
router.route("/token").get(accessToken)
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment)

export default router