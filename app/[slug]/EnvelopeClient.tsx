'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
    wedding: any;
    recipientName: string;
    onOpen: () => void;
}

export default function EnvelopeClient({ wedding, recipientName, onOpen }: EnvelopeProps) {
    // Generate some random positions for particles
    const particles = Array.from({ length: 15 });
    console.log(recipientName);
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4 overflow-hidden relative">
            {/* Elegant Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#B8935A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Floating Gold Particles (Background) */}
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
                        y: [0, -100, 0],
                        opacity: [0, 0.5, 0],
                        scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)', transition: { duration: 0.8 } }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Elegant Top Header */}
                <div className="text-center mb-10">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] md:text-xs text-[#B8935A] tracking-[0.5em] uppercase font-bold block mb-8"
                    >
                        Wedding Invitation
                    </motion.span>
                    <h1 className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                        <span className="font-cursive text-5xl md:text-7xl text-[#B8935A] italic">
                            {wedding.groom_name}
                        </span>

                        <span className="font-serif italic text-xl md:text-3xl text-stone-400 my-2 md:my-0 font-light">
                            &
                        </span>

                        <span className="font-cursive text-5xl md:text-7xl text-[#B8935A] italic">
                            {wedding.bride_name}
                        </span>
                    </h1>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-stone-400 font-serif italic mb-8 text-sm md:text-base animate-pulse"
                >
                    Dear {recipientName || "Guest"}, please scroll over or tap to open your invitation
                </motion.p>

                {/* The Envelope Component */}
                <motion.div
                    whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-[320px] h-[220px] md:w-[450px] md:h-[300px] cursor-pointer group perspe-1000"
                    onClick={onOpen}
                >
                    {/* Shadow Layer */}
                    <div className="absolute inset-0 bg-stone-900/10 blur-2xl rounded-xl translate-y-8 group-hover:translate-y-12 transition-transform duration-500" />

                    {/* Back Wing (The container) */}
                    <div className="absolute inset-0 bg-[#E8DCC4] rounded-xl shadow-inner border border-stone-200/50" />

                    {/* The Invitation Card (Peek out) */}
                    <motion.div
                        initial={{ y: -10 }}
                        whileHover={{ y: -45 }}
                        className="absolute inset-x-6 top-4 bottom-4 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-6 border border-stone-100 z-10 transition-transform duration-500"
                    >
                        <span className="text-[8px] md:text-[10px] text-[#B8935A] tracking-[0.3em] font-bold uppercase mb-2">
                            Together with their families
                        </span>

                        <div className="text-center space-y-1 mb-4">
                            <h3 className="text-xl md:text-3xl font-serif text-stone-800">
                                {recipientName || "Wedding Journey"}
                            </h3>
                        </div>

                        <div className="w-12 h-[1px] bg-[#B8935A]/30 mb-4" />

                        <p className="text-[9px] md:text-[10px] text-stone-500 italic text-center max-w-[80%] leading-relaxed">
                            We cordially invite you to join us in celebrating our special day
                        </p>

                        <div className="mt-4">
                            <p className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                                Specially Invited:
                            </p>
                            <p className="text-xs md:text-sm font-serif italic text-[#B8935A] mt-1">
                                {recipientName || "Family & Friends"}
                            </p>
                        </div>
                    </motion.div>

                    {/* Side Wings & Bottom Wing (Visual Polish) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4C3A3] via-transparent to-transparent rounded-xl opacity-50 z-20" />
                    <div className="absolute inset-0 flex z-30">
                        <div className="h-full w-full bg-[#EAD9C2] clip-path-envelope-bottom"
                            style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }} />
                    </div>

                    {/* Top Flap (Animated) */}
                    <motion.div
                        className="absolute inset-x-0 top-0 h-1/2 bg-[#D9C8AC] shadow-md origin-top z-40 border-t border-white/20"
                        style={{ clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)' }}
                        whileHover={{ rotateX: -40 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Wax Seal */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                        <div className="size-12 md:size-16 bg-[#8B0000] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(139,0,0,0.4)] border-2 border-[#A52A2A] relative">
                            <Heart className="size-6 text-white/90 fill-white/20" />
                            <div className="absolute inset-0 rounded-full border border-white/10" />
                        </div>
                    </motion.div>

                    {/* Instruction Tag */}
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-16 left-0 right-0 text-center z-50"
                    >
                        <p className="text-[10px] text-[#B8935A] tracking-[0.4em] uppercase font-bold">Tap to Open</p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    );
}