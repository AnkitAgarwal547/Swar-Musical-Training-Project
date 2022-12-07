const express = require("express");
const moment = require('moment-timezone');
const { CouponReedeem } = require("../models/CouponReedeem.js");

const utility = require("../utility.js");

const router = express.Router();

router.post('/', async (request, response) => {
    console.log('Webhook called');
    try {

        const payload = request.rawBody;
        const sig = request.headers['stripe-signature'];

        let event;
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('payment status', session.payment_status, session.metadata.paymentId);
            if (session.payment_status == 'paid') {


                const paymentObj = await Payment.findOne({_id:session.metadata.paymentId });
                console.log('paymentobj', paymentObj);
                const updateDoc = await Payment.findOneAndUpdate(
                    { _id: session.metadata.paymentId },
                    {
                        $push: { pgResponse: JSON.stringify(session) },
                        paidAt:  utility.getUTCDateTime(),
                        status:'paid'
                    },
                    { new: true }
                );
                
                let nextDueDate = null;
                console.log('payment total amt', paymentObj.totalAmt, paymentObj.totalAmt.toFixed(2));
                totalAmt = Number(Number(totalAmt) + Number(paymentObj.totalAmt)).toFixed(2);
                console.log('totalAmt added', totalAmt, 'total amt found', totalAmt);
                if("isSubscribed" in  userObj){
                    if(userObj.isSubscribed){
                        updateUser.packageId  = paymentObj.packageId;
                        updateUser.totalAmtPaid  = totalAmt;
                        updateUser.lastPaidDate  = utility.getUTCDateTime();
                        updateUser.nextDueDate  = nextDueDate; 
                    }else{
                        updateUser.isSubscribed = true;
                        updateUser.packageId  = paymentObj.packageId;
                        updateUser.totalAmtPaid  = totalAmt ;
                        updateUser.lastPaidDate  = utility.getUTCDateTime();
                        updateUser.nextDueDate  = nextDueDate; 
                        updateUser.subscribedOn  = utility.getUTCDateTime();
                    }
                }else{
                    updateUser.isSubscribed = true;
                    updateUser.packageId  = paymentObj.packageId;
                    updateUser.totalAmtPaid  = totalAmt ;
                    updateUser.lastPaidDate  = utility.getUTCDateTime();
                    updateUser.nextDueDate  = nextDueDate; 
                    updateUser.subscribedOn  = utility.getUTCDateTime();
                }

                console.log('updateUsrObJ', updateUser);

                const updatedUser  = await User.findOneAndUpdate(
                    { _id: paymentObj.userId },
                    updateUser,
                    { new: true }
                );
                console.log('updateduser', updatedUser);
            }
        }
        response.status(200);

    } catch (e) {
        console.log('stripe/webhook', e.stack);
        return res.status(500).send(e.stack);
    }
});

module.exports = router;