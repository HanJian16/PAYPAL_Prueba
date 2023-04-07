const axios = require('axios');
const { PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } = require('../config.js');

const createOrder = async (req, res) => {
    try{
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "100.00"
                    }
                }
            ],
            application_context: {
                brand_name: "myCompany.com",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: "http://localhost:3000/capture-order",
                cancel_url: "http://localhost:3000/cancel-order"
            }
        }
    
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials")
    
        const {data: {access_token}} = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth:{
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            }
        })
    
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    
        res.status(200).json(response.data);
    }catch(error){
        res.status(500).send('Algo fue mal');
    }
};

const captureOrder = async (req, res) => {

    const {token, PayerID} = req.query;

    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    });

    console.log(response.data)

    res.redirect('/payed.html');
};

const cancelOrder = (req, res) => {

    res.redirect('/')

};

module.exports = {
    createOrder,
    captureOrder,
    cancelOrder
}