import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const body = await req.json();

        const orderId = body.paymentRequestId;
        const paymentStatus = body.paymentStatus || body.result?.resultStatus;
        const notifyType = body.notifyType;
        const paymentId = body.paymentId || body.transactionId || 'UNKNOWN_PROOF_ID';

        let courseId = null, email = null, name = null;
        if (body.passThroughInfo) {
            try {
                const parsedInfo = JSON.parse(body.passThroughInfo);
                courseId = parsedInfo.courseId;
                email = parsedInfo.customerEmail;
                name = parsedInfo.customerName;
            } catch (e) {
                console.error("Failed to parse passThroughInfo");
            }
        }

        console.log('--- ANTOM WEBHOOK RECEIVED ---');
        console.log(`Order ID: ${orderId}, Course ID: ${courseId}, User Email: ${email}`);

        const isPaymentSuccessful = paymentStatus === 'SUCCESS' || paymentStatus === 'S' || notifyType === 'CAPTURE_RESULT';

        if (isPaymentSuccessful) {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://edu-hub-server-4gwz.onrender.com';
            try {
                const payload = {
                    orderId,
                    courseId,
                    userEmail: email,
                    userName: name,
                    proofId: paymentId,
                    gateway: 'Antom'
                };

                const response = await axios.post(`${backendUrl}/api/orders/confirm-antom-payment`, payload);

                if (response.status === 200 || response.status === 201) {
                    console.log('Successfully forwarded enrollment data to Node.js backend!');
                }
            } catch (backendError) {
                console.error('Error forwarding data to Node.js backend:', backendError.message);
            }
        }

        return NextResponse.json({
            result: {
                resultStatus: "S"
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Webhook Processing Error:', error);
        return NextResponse.json({ result: 'FAIL', message: error.message }, { status: 500 });
    }
}