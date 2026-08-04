import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');
        const courseId = searchParams.get('courseId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');


        const paymentStatus = body.paymentStatus || body.result?.resultStatus;
        const paymentId = body.paymentId || body.transactionId || 'UNKNOWN_PROOF_ID';

        console.log('\n✅ ======== ANTOM WEBHOOK RECEIVED ======== ✅');
        console.log('Order ID:', orderId);
        console.log('Course ID:', courseId);
        console.log('User Email:', email);
        console.log('User Name:', name);
        console.log('Antom Success Proof ID:', paymentId);
        console.log('Full Antom Payload:', JSON.stringify(body, null, 2));
        console.log('============================================\n');

        if (paymentStatus === 'SUCCESS' || paymentStatus === 'S') {
            console.log('Ready to send data to Node.js backend!');
        }

        return NextResponse.json({ result: 'SUCCESS' }, { status: 200 });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ result: 'FAIL', message: error.message }, { status: 500 });
    }
}