import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mtradershklimited.com';

    const resultCode = searchParams.get('resultCode');
    const paymentRequestId = searchParams.get('paymentRequestId') || '';

    if (resultCode === 'SUCCESS') {
        return NextResponse.redirect(`${appUrl}/payment-success?orderId=${paymentRequestId}`);
    }

    return NextResponse.redirect(`${appUrl}/payment-failed?orderId=${paymentRequestId}`);
}