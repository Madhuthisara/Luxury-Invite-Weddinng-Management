import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: string;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#1C1816] text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden"
        >
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full border border-stone-800/40" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-amber-500 font-semibold block text-center mb-6">
                COUNTING DOWN TO THE VOWS
            </span>
            <div className="grid grid-cols-4 gap-3 relative z-10 max-w-sm mx-auto">
                {[
                    { val: timeLeft.days, label: 'Days' },
                    { val: timeLeft.hours, label: 'Hours' },
                    { val: timeLeft.minutes, label: 'Mins' },
                    { val: timeLeft.seconds, label: 'Secs' }
                ].map(({ val, label }) => (
                    <div key={label} className="text-center bg-stone-900/60 border border-stone-800 p-3 rounded-2xl">
                        <span className="text-2xl md:text-3xl font-serif-card text-amber-400 font-medium block">
                            {val}
                        </span>
                        <span className="text-[8px] text-stone-400 uppercase tracking-widest block mt-1 font-semibold">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
