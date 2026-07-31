'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

function CheckoutContent() {
    const searchParams = useSearchParams();

    const initialTitle = searchParams.get('title') || 'Course Enrollment';
    const initialPrice = searchParams.get('price') || '0';
    const initialImage = searchParams.get('image') || '';
    const courseId = searchParams.get('id') || '';

    const [customPrice, setCustomPrice] = useState(initialPrice);
    const [isLoading, setIsLoading] = useState(false);

    const handleProceedToPayment = async () => {
        if (!customPrice || Number(customPrice) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/antom-pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    title: initialTitle,
                    amount: Number(customPrice),
                    currency: 'USD',
                }),
            });

            const data = await response.json();

            if (data.success && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                alert(data.message || 'Failed to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Something went wrong during payment processing.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
            <div className="max-w-4xl w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* Course Summary Section */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <span className="inline-block px-3 py-1 bg-[#04cccc]/10 text-[#04cccc] text-xs font-semibold rounded-full mb-4 border border-[#04cccc]/20">
                            Course Checkout
                        </span>

                        {initialImage && (
                            <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-slate-800">
                                <img
                                    src={initialImage}
                                    alt={initialTitle}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {initialTitle}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            Complete your payment details to get instant access to the full course content.
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-[#04cccc]" />
                            <span>Lifetime Access Included</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <ShieldCheck className="w-4 h-4 text-[#04cccc]" />
                            <span>Encrypted & Secure Antom Gateway</span>
                        </div>
                    </div>
                </div>

                {/* Custom Payment Form Section */}
                <div className="p-8 flex flex-col justify-between bg-white/50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#04cccc]" />
                            Payment Summary
                        </h2>

                        <div className="mb-6">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                Payable Amount (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500 dark:text-slate-400">
                                    $
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3.5 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#04cccc] dark:focus:border-[#04cccc] transition-colors"
                                    placeholder="Enter custom price"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                You can adjust the payable amount if required.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>${customPrice || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Gateway Fee</span>
                                <span className="text-emerald-500 dark:text-emerald-400">Free</span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                                <span>Total Payable</span>
                                <span className="text-[#04cccc]">${customPrice || 0}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleProceedToPayment}
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#04cccc] to-[#15a3a3] hover:opacity-90 text-white font-bold text-base transition-all shadow-lg shadow-[#04cccc]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span>Redirecting to Antom...</span>
                        ) : (
                            <span>Proceed to Payment</span>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}