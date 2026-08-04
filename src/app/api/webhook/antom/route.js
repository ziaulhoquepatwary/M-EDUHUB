import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const body = await req.json();
        const { searchParams } = new URL(req.url);

        const orderId = searchParams.get('orderId');
        const courseId = searchParams.get('courseId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');

        const paymentStatus = body.paymentStatus || body.result?.resultStatus;
        const notifyType = body.notifyType;
        const paymentId = body.paymentId || body.transactionId || 'UNKNOWN_PROOF_ID';

        console.log(' ANTOM WEBHOOK RECEIVED ');
        console.log(JSON.stringify(body, null, 2));
        console.log(`Order ID: ${orderId}`);
        console.log(`Course ID: ${courseId}`);
        console.log(`User Email: ${email}`);
        console.log(`Proof ID: ${paymentId}`);

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

        // Acknowledge receipt to Antom to prevent duplicate webhook triggers
        return NextResponse.json({ result: 'SUCCESS' }, { status: 200 });

    } catch (error) {
        console.error('Webhook Processing Error:', error);
        return NextResponse.json({ result: 'FAIL', message: error.message }, { status: 500 });
    }
}