import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const body = await req.json();

        console.log('ANTOM WEBHOOK RECEIVED');
        console.log(JSON.stringify(body, null, 2));

        const orderId = body.paymentRequestId;
        const paymentStatus = body.paymentStatus || body.paymentResult?.resultStatus || body.result?.resultStatus;
        const notifyType = body.notifyType;
        const paymentId = body.paymentId || body.transactionId || body.paymentResult?.paymentId || 'UNKNOWN_PROOF_ID';

        let courseId = null, email = null, name = null;

        if (body.passThroughInfo) {
            try {
                const parsedInfo = typeof body.passThroughInfo === 'string'
                    ? JSON.parse(body.passThroughInfo)
                    : body.passThroughInfo;

                courseId = parsedInfo.courseId;
                email = parsedInfo.customerEmail;
                name = parsedInfo.customerName;
            } catch (error) {
                console.error("Failed to parse passThroughInfo:", error.message);
            }
        }

        console.log(`Extracted Data -> Order ID: ${orderId}, Course ID: ${courseId}, User Email: ${email}, Payment ID: ${paymentId}`);

        const isPaymentSuccessful = paymentStatus === 'SUCCESS' || paymentStatus === 'S' || notifyType === 'PAYMENT_RESULT';

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

                console.log('Sending payload to Node backend:', payload);

                const response = await axios.post(`${backendUrl}/api/orders/confirm-antom-payment`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000
                });

                if (response.status === 200 || response.status === 201) {
                    console.log('Successfully forwarded enrollment data to backend.');
                }
            } catch (backendError) {
                console.error('Error forwarding data to backend:',
                    backendError.response?.data || backendError.message
                );
            }
        } else {
            console.log(`Payment status is not successful. Current Status: ${paymentStatus}`);
        }

        return NextResponse.json({
            result: {
                resultStatus: "S"
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Webhook Processing Error:', error);
        return NextResponse.json({
            result: { resultStatus: "F" },
            message: error.message
        }, { status: 500 });
    }
}