// components/Countdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { TimeLeft } from '@/types/wedding';

interface CountdownProps {
    targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
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
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto my-6 bg-gold-100/50 p-4 rounded-2xl border border-gold-500/5">
            {Object.entries(timeLeft).map(([key, val]) => (
                <div key={key} className="text-center">
                    <span className="text-2xl font-serif font-semibold text-charcoal block">
                        {val}
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-widest">
                        {key}
                    </span>
                </div>
            ))}
        </div>
    );
}
