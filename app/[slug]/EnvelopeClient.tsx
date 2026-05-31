// app/[slug]/EnvelopeClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MailOpen } from 'lucide-react';

interface EnvelopeClientProps {
    wedding: any;
    to: string;
}

export default function EnvelopeClient({ wedding, to }: EnvelopeClientProps) {
    const router = useRouter();

    const handleOpen = () => {
        router.push(`/${wedding.slug}/invite?to=${encodeURIComponent(to)}`);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gold-50 relative overflow-hidden">
            <div className="absolute inset-4 border border-gold-500/10 pointer-events-none z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="z-10 w-full max-w-md bg-white border border-gold-500/10 p-8 rounded-3xl shadow-xl text-center"
            >
                <span className="font-serif text-gold-500 tracking-widest text-xs uppercase block mb-3">
                    You are cordially invited
                </span>
                <h2 className="font-serif text-3xl font-semibold text-charcoal tracking-wide">
                    Save The Date
                </h2>
                <div className="w-12 h-[1px] bg-gold-500/40 mx-auto my-5" />

                {to && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="my-6"
                    >
                        <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest">Specially Invited</p>
                        <p className="text-2xl font-serif italic text-charcoal mt-1">Dear {to},</p>
                    </motion.div>
                )}

                <button
                    onClick={handleOpen}
                    className="w-full py-4 bg-charcoal hover:bg-stone-800 text-white rounded-xl text-xs font-serif tracking-widest transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                    <MailOpen className="h-4 w-4" /> OPEN INVITATION
                </button>
            </motion.div>
        </main>
    );
}
