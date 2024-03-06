import request from "request";
import 'dotenv/config';
import { getTimestamp } from "../Utils/utils.timestamp.js";
import ngrok from '@ngrok/ngrok';
import axios from "axios"
// @desc initiate stk push
// @method POST
//completed
// @route /stkPush
export const initiateSTKPush = async (req, res) => {
    try {
        console.log("Request body", req.body);
        const { amount, phone, Order_ID } = req.body;
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = "Bearer " + req.safaricom_access_token;
        const timestamp = getTimestamp();
        const password = new Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');
        let callback_url;

        // Retry logic for ngrok tunnel creation
        let retryCount = 0;
        let maxRetries = 10;
        let ngrokConnected = false;

        while (!ngrokConnected && retryCount < maxRetries) {
            try {
                 await ngrok.connect({
                    addr: 8080,
                    authtoken: process.env.NGROK_AUTH_TOKEN
                })
                .then((listener)=>{
                    callback_url= `${listener.url()}`;
                    console.log(`Ingress established at: ${listener.url()}`)
                })
                ngrokConnected = true;                
            } catch (ngrokError) {
                console.error("Error while trying to start ngrok tunnel:", ngrokError);
                retryCount++;
                console.log(`Retrying... Attempt ${retryCount}`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            }
        }

        if (!ngrokConnected) {
            throw new Error("Failed to start ngrok tunnel after multiple retries.");
        }

        console.log("callback ", callback_url);

        // Use axios or fetch instead of request
        const response = await axios.post(url, {
            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: process.env.BUSINESS_SHORT_CODE,
            PhoneNumber: phone,
            CallBackURL: `${callback_url}`,
            AccountReference: "squim's e-commerce shop",
            TransactionDesc: "Paid online"
        }, {
            headers: {
                "Authorization": auth
            }
        });

        res.status(200).json(response.data);
    } catch (e) {
        console.error("Error while trying to create LipaNaMpesa details", e.message);
        res.status(503).json({
            message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error: e.message
        });
    }
};

export const stkPushCallback = async (req, res) => {
    try {
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = req.body.Body.stkCallback;

        const meta = Object.values(await CallbackMetadata.Item);
        const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber').Value.toString();
        const Amount = meta.find(o => o.Name === 'Amount').Value.toString();
        const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber').Value.toString();
        const Order_ID = meta.find(o => o.Name === 'Order_ID').Value.toString();
        const TransactionDate = meta.find(o => o.Name === 'TransactionDate').Value.toString();

        console.log("-".repeat(20), " OUTPUT IN THE CALLBACK ", "-".repeat(20));
        console.log(`
            Order_ID : ${Order_ID},
            MerchantRequestID : ${MerchantRequestID},
            CheckoutRequestID: ${CheckoutRequestID},
            ResultCode: ${ResultCode},
            ResultDesc: ${ResultDesc},
            PhoneNumber : ${PhoneNumber},
            Amount: ${Amount}, 
            MpesaReceiptNumber: ${MpesaReceiptNumber},
            TransactionDate : ${TransactionDate}
        `);

        res.json(true);
    } catch (e) {
        console.error("Error while trying to update LipaNaMpesa details from the callback", e);
        res.status(503).send({
            message: "Something went wrong with the callback",
            error: e.message
        });
    }
};


export const confirmPayment = async (req, res) => {
    console.log('Confirm Payment Function Called');
    try {
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
        const auth = "Bearer " + req.safaricom_access_token;

        const timestamp = getTimestamp();
        //shortcode + passkey + timestamp
        const password = new Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');

        const response = await axios.post(url, {
            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: req.params.CheckoutRequestID,
        }, {
            headers: {
                "Authorization": auth
            }
        });
        console.log(response.data);

        res.status(200).json(response.data);
        
    } catch (e) {
        console.error("Error while trying to create LipaNaMpesa details", e);
        res.status(503).send({
            message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error: e
        });
    }
};
