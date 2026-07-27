'use client';

import { ShoppingCart } from 'lucide-react';

export default function EnrollButton({ price, courseId }) {
    const handleEnroll = () => {
        // Handle enrollment logic (e.g., redirect to checkout or add to cart)
        console.log(`Enrolling in course: ${courseId} for $${price}`);
    };

    return (
        <button
            onClick={handleEnroll}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#04cccc] to-[#15a3a3] hover:opacity-95 text-white font-bold text-base transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer"
        >
            <ShoppingCart className="w-5 h-5" />
            <span>Enroll In Course</span>
        </button>
    );
}