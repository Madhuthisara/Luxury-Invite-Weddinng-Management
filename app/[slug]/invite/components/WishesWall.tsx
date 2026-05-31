import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Blessing {
    guest_name: string;
    blessing: string;
    status: string;
}

interface WishesWallProps {
    blessings: Blessing[];
}

export const WishesWall = ({ blessings }: WishesWallProps) => {
    if (blessings.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-5"
        >
            <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold">Wishes Wall</span>
                <h3 className="text-2xl font-serif-card text-[#2B231F] mt-1">Live Blessings from Loved Ones</h3>
                <div className="w-10 h-[1px] bg-[#B8935A]/30 mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blessings.map((bl, idx) => (
                    <div
                        key={idx}
                        className="bg-white/80 border border-[#B8935A]/5 p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between"
                    >
                        <Quote className="absolute right-3 top-3 h-10 w-10 text-[#B8935A]/5 rotate-180 pointer-events-none" />
                        <p className="text-stone-600 text-[11px] leading-relaxed italic z-10">"{bl.blessing}"</p>
                        <div className="border-t border-stone-50 pt-3 mt-3 flex items-center justify-between">
                            <span className="font-serif-card text-[10px] font-semibold text-[#2B231F]">{bl.guest_name}</span>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-emerald-600">
                                {bl.status === 'yes' ? '✓ Attending' : '✓ Wishes Sent'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
