'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface EnvelopeProps {
    wedding: any;
    recipientName: string;
    onOpen: () => void;
}

export default function EnvelopeClient({ wedding, recipientName, onOpen }: EnvelopeProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const particles = Array.from({ length: 15 });

    const handleOpen = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        // Call onOpen slightly earlier to overlap with the exit animation
        setTimeout(() => {
            onOpen();
        }, 1200);
    };

    console.log(wedding);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6F0] p-4 overflow-hidden relative">
            {/* Elegant Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#B8935A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Floating Gold Particles */}
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-[#B8935A]/20 pointer-events-none"
                    style={{
                        width: Math.random() * 6 + 2,
                        height: Math.random() * 6 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                        duration: Math.random() * 3 + 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Elegant Top Header */}
            <div className="text-center w-full max-w-3xl mx-auto px-4 mb-8 md:mb-16 select-none">
                {/* Top Badge
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={isAnimating ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-[10px] md:text-xs text-gold-500 tracking-[0.4em] md:tracking-[0.6em] uppercase font-bold block mb-4 md:mb-6"
                >
                    Wedding Invitation
                </motion.span> */}

                {/* Names Display Area */}
                <div className="flex flex-col items-center justify-center py-2 md:py-4">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-priestacy text-stone-800 tracking-wide leading-[1.3] md:leading-[1.4] drop-shadow-sm flex flex-col md:flex-row items-center justify-center gap-1 md:gap-6">
                        <span className="block">{wedding?.bride_name}</span>
                        <span className="text-gold-500  block text-2xl text-2xl sm:text-3xl md:text-7xl my-1 md:my-0 md:translate-y-[-4px]"> &</span>
                        <span className="block">{wedding?.groom_name}</span>
                    </h1>
                </div>

                {/* Divider Line */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={isAnimating ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 0.2 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-24 md:w-36 h-[1px] bg-gold-500 mx-auto my-5 md:my-7"
                />

                {/* Guest Invitation Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isAnimating ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-[11px] md:text-xs text-stone-500 uppercase tracking-[0.25em] md:tracking-[0.35em] font-medium max-w-md mx-auto leading-relaxed px-2"
                >
                    Dear <span className="text-stone-800 font-bold block md:inline my-0.5 md:my-0">{recipientName || "Guest"}</span>,
                    <span className="block md:inline md:ml-1">please scroll over or tap to open your invitation</span>
                </motion.p>
            </div>

            {/* Main Envelope Container */}
            <motion.div
                className="relative w-[320px] md:w-[560px] h-[200px] md:h-[320px] cursor-pointer mt-5"
                onClick={handleOpen}
                animate={isAnimating ? { y: 150 } : { y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
            >

                {/* 1. Inner Card (Cinematic Full Screen Zoom Effect) */}
                <motion.div
                    className="z-10 absolute inset-2 bg-white rounded-lg shadow-md flex items-center justify-center border border-[#B8935A]/20 overflow-hidden origin-center"
                    initial={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
                    animate={isAnimating ? {
                        y: [0, -350, 0],
                        rotate: [0, 90, 90],
                        scale: [1, 1.1, 20],
                        opacity: [1, 1, 0]
                    } : {}}
                    transition={{
                        duration: 1.8,
                        delay: 0.2,
                        ease: [0.45, 0, 0.55, 1],
                        times: [0, 0.3, 1]
                    }}
                >
                    {wedding?.blank_card_url ? (
                        <img
                            src={wedding.blank_card_url}
                            alt="Wedding Invitation Card"
                            className="w-full h-full object-contain -rotate-90 scale-[1.4] md:scale-[1.2]"
                        />
                    ) : (
                        <div className="text-center opacity-30 p-4">
                            <div className="w-12 h-12 rounded-full border border-[#B8935A] mx-auto mb-2" />
                            <div className="w-24 h-2 bg-stone-300 mx-auto rounded mb-2" />
                            <div className="w-16 h-2 bg-stone-300 mx-auto rounded" />
                        </div>
                    )}
                </motion.div>

                {/* 2. Envelope Back */}
                <div className="absolute inset-0 bg-[#D4C19C] rounded-lg shadow-2xl z-0 -z-10" />

                {/* 3. Envelope Bottom & Side Flaps */}
                <div className="absolute inset-0 bg-[#E5D3B3] rounded-lg z-20 shadow-inner" style={{ clipPath: 'polygon(0% 100%, 50% 45%, 100% 100%, 100% 100%, 0% 100%)' }} />
                <div className="absolute inset-0 bg-[#DFCCAB] rounded-lg z-20" style={{ clipPath: 'polygon(0% 0%, 50% 45%, 0% 100%)' }} />
                <div className="absolute inset-0 bg-[#DFCCAB] rounded-lg z-20" style={{ clipPath: 'polygon(100% 0%, 50% 45%, 100% 100%)' }} />

                {/* 4. Top Flap */}
                <motion.div
                    className="absolute inset-0 bg-[#E5D3B3] origin-top rounded-t-lg z-30 shadow-[0_5px_15px_rgba(0,0,0,0.1)] border-b border-white/20"
                    style={{ clipPath: 'polygon(0% 0%, 50% 60%, 100% 0%)' }}
                    animate={isAnimating ? { rotateX: -180, zIndex: 0 } : { rotateX: 0 }}
                    whileHover={!isAnimating ? { rotateX: -20 } : {}}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* 5. Wax Seal */}
                <motion.div
                    className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                    animate={isAnimating ? {
                        y: [0, -50, 500],
                        rotate: [0, -15, 90],
                        opacity: [1, 1, 0],
                        scale: [1, 1.1, 0.8]
                    } : { y: 0, rotate: 0, opacity: 1, scale: 1 }}
                    whileHover={!isAnimating ? { scale: 1.2, rotate: 10 } : {}}
                    transition={{ duration: 1, ease: "easeIn" }}
                >
                    <div className="size-12 md:size-16 bg-[#8B0000] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(139,0,0,0.4)] border-2 border-[#A52A2A] relative">
                        <Heart className="size-6 text-white/90 fill-white/20" />
                        <div className="absolute inset-0 rounded-full border border-white/10" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Instruction Tag */}
            <AnimatePresence>
                {!isAnimating && (
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-12 left-0 right-0 text-center z-50 pointer-events-none"
                    >
                        <p className="text-[10px] text-[#B8935A] uppercase tracking-[0.3em] font-bold">
                            Tap to open
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}