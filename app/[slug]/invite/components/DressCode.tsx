import { motion } from 'framer-motion';

export const DressCode = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
        >
            <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8935A] font-semibold block">DRESS CODE</span>
                <h3 className="text-3xl font-serif-card text-[#2B231F]">Premium Traditional</h3>
                <div className="w-12 h-[1px] bg-[#B8935A]/30 mx-auto mt-2" />
            </div>

            <div className="flex justify-center gap-12">
                <div className="space-y-4">
                    <div className="h-16 w-16 bg-white border border-[#B8935A]/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <span className="text-2xl">🧥</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Gentlemen</p>
                        <p className="text-xs text-stone-400 italic">Formal Suits / Sherwani</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-16 w-16 bg-white border border-[#B8935A]/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <span className="text-2xl">👗</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Ladies</p>
                        <p className="text-xs text-stone-400 italic">Elegant Saree / Lehenga</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
