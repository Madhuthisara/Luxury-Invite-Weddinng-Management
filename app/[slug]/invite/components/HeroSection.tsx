import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
    groomName: string;
    brideName: string;
    guestName: string;
}

export const HeroSection = ({ groomName, brideName, guestName }: HeroSectionProps) => {
    return (
        <section className="min-h-screen flex flex-col justify-between items-center px-4 py-16 relative z-10 text-center">
            <div /> {/* Top spacer */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="space-y-8 max-w-lg"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8935A] font-semibold block">TOGETHER WITH THEIR FAMILIES</span>

                <h1 className="text-4xl md:text-5xl font-serif-card text-[#2B231F] font-light tracking-wide leading-tight">
                    {groomName}
                    <span className="font-cursive text-5xl text-[#B8935A] block my-2">&amp;</span>
                    {brideName}
                </h1>

                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">REQUEST THE HONOR OF YOUR PRESENCE</span>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-white/80 border border-[#B8935A]/15 rounded-2xl p-6 shadow-sm max-w-sm mx-auto backdrop-blur-sm"
                >
                    <p className="text-lg md:text-xl font-serif-card text-stone-800 font-medium italic">
                        Dear {guestName},
                    </p>
                    <p className="text-xs text-stone-400 mt-2 tracking-wide">
                        We invite you to celebrate our wedding.
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-1.5 cursor-pointer opacity-60 hover:opacity-100 transition-all"
                onClick={() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
            >
                <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-medium">Scroll to open</span>
                <ChevronDown className="h-4 w-4 text-[#B8935A]" />
            </motion.div>
        </section>
    );
};
