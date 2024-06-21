import axios from 'axios';
import 'dotenv/config';

export const accessToken = async (req, res, next) => {
    try {
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const auth = Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

        const response = await axios.get(url, {
            headers: {
                "Authorization": "Basic " + auth
            }
        });

        if (response.data && response.data.access_token) {
            req.safaricom_access_token = response.data.access_token;
            next();
        } else {
            res.status(401).send({
                "message": 'Failed to retrieve access token',
                "error": response.data
            });
        }
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            // Request was made but no response received
            console.error("Error request data:", error.request);
        } else {
            // Something else happened while setting up the request
            console.error("Error message:", error.message);
        }

        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error": error.message
        });
    }
};
