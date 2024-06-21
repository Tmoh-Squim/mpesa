import axios from 'axios';
import 'dotenv/config';

const getAccessToken = async () => {
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": "Basic " + auth,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        return response.data.access_token;
    } catch (error) {
        if (error.response && error.response.status === 503) {
            console.log("Service unavailable, retrying...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            return getAccessToken();
        } else {
            throw error;
        }
    }
};

export const accessToken = async (req, res, next) => {
    try {
        const token = await getAccessToken();
        if (token) {
            req.safaricom_access_token = token;
            next();
        } else {
            res.status(401).send({
                "message": 'Failed to retrieve access token'
            });
        }
    } catch (error) {
        console.error("Access token error ", error);
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error": error.message
        });
    }
};
