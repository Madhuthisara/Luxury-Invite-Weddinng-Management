import { motion } from 'framer-motion';

interface Wedding {
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    location: string;
    blank_card_url?: string;
    name_y_position?: number;
    name_color?: string;
    name_font_size?: number;
}

interface InvitationReplicaProps {
    wedding: Wedding;
    guestName: string;
}

export const InvitationReplica = ({ wedding, guestName }: InvitationReplicaProps) => {
    // Parsing the date dynamically for the elegant physical card grid
    const eventDate = new Date(wedding.wedding_date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dayNum = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
    const monthName = eventDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const yearNum = eventDate.getFullYear();

    const getOrdinalSuffix = (num: number) => {
        const j = num % 10, k = num % 100;
        if (j === 1 && k !== 11) return 'ST';
        if (j === 2 && k !== 12) return 'ND';
        if (j === 3 && k !== 13) return 'RD';
        return 'TH';
    };

    const ordinalSuffix = getOrdinalSuffix(eventDate.getDate());
    const timeFormatted = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="relative"
        >
            {wedding.blank_card_url ? (
                <div className="relative w-full aspect-[3/4] overflow-hidden shadow-2xl border border-[#B8935A]/20 bg-stone-100">
                    <img
                        src={wedding.blank_card_url}
                        alt="Official Invitation"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div
                        className="absolute left-0 text-center w-full px-8 pointer-events-none select-none transition-all duration-700"
                        style={{
                            top: `${wedding.name_y_position || 40}%`,
                            color: wedding.name_color || '#B8935A',
                            fontSize: `${wedding.name_font_size || 28}px`,
                            fontFamily: "'Playfair Display', serif",
                            lineHeight: 1.2
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            {guestName}
                        </motion.span>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-[#B8935A]/15 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center relative overflow-hidden bg-[radial-gradient(#ffffff_40%,#fbf9f6_100%)]">
                    <div className="flex justify-center mb-6">
                        <div className="relative h-20 w-20 flex items-center justify-center border-2 border-dashed border-[#B8935A]/30 rounded-full p-2">
                            <span className="font-serif-card text-3xl text-[#B8935A] tracking-tighter">
                                {wedding.groom_name.charAt(0)}{wedding.bride_name.charAt(0)}
                            </span>
                            <div className="absolute inset-0 border border-[#B8935A]/10 rounded-full scale-95" />
                        </div>
                    </div>

                    <div className="space-y-1 mb-6">
                        <p className="text-[10px] tracking-widest text-[#B8935A] uppercase font-semibold">MR. &amp; MRS. DODAMPE GAMAGE</p>
                        <p className="text-[9px] italic text-stone-400 uppercase">TOGETHER WITH</p>
                        <p className="text-[10px] tracking-widest text-[#B8935A] uppercase font-semibold">MR. &amp; MRS. RANWELLA</p>
                        <p className="text-[9px] tracking-widest text-stone-400 font-medium uppercase mt-2">
                            REQUEST THE HONOUR OF THE PRESENCE OF
                        </p>
                    </div>

                    <div className="border-t border-dashed border-stone-100 my-4" />

                    <div className="my-5 py-3">
                        <span className="text-[9px] uppercase tracking-widest text-[#B8935A] block">SPECIALLY INVITED</span>
                        <p className="text-2xl font-serif-card font-semibold text-stone-800 italic mt-1.5 px-4 inline-block border-b border-stone-200 pb-1">
                            {guestName}
                        </p>
                    </div>

                    <p className="text-[9px] tracking-[0.2em] text-stone-400 font-semibold uppercase mb-4">
                        TO CELEBRATE THE MARRIAGE OF THEIR CHILDREN
                    </p>

                    <div className="my-6">
                        <h2 className="text-5xl md:text-6xl font-cursive text-[#B8935A] tracking-wider py-1 drop-shadow-sm">
                            {wedding.groom_name}
                        </h2>
                        <span className="font-serif-card text-lg text-stone-400 block my-1">and</span>
                        <h2 className="text-5xl md:text-6xl font-cursive text-[#B8935A] tracking-wider py-1 drop-shadow-sm">
                            {wedding.bride_name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 items-center max-w-xs mx-auto border-y border-[#B8935A]/30 py-4 my-8">
                        <div className="text-center">
                            <span className="text-[10px] font-serif-card tracking-widest text-stone-500 block uppercase font-semibold">
                                {dayName}
                            </span>
                        </div>
                        <div className="text-center border-x border-[#B8935A]/30 px-2">
                            <span className="text-3xl font-serif-card text-[#B8935A] font-medium block leading-none">
                                {dayNum}
                            </span>
                            <span className="text-[8px] tracking-widest text-stone-400 block mt-1 uppercase font-bold">
                                {ordinalSuffix}
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-serif-card tracking-widest text-stone-500 block uppercase font-semibold">
                                {monthName}
                            </span>
                            <span className="text-[8px] tracking-wider text-stone-400 block uppercase font-semibold">
                                {yearNum}
                            </span>
                        </div>
                    </div>

                    <p className="text-[10px] tracking-widest text-stone-500 font-semibold uppercase mb-6">
                        (PORUWA CEREMONY {timeFormatted})
                    </p>

                    <div className="space-y-1 mb-8">
                        <span className="text-[9px] italic text-stone-400 uppercase tracking-widest">AT</span>
                        <p className="text-sm font-serif-card text-stone-800 font-semibold uppercase tracking-widest">
                            {wedding.location}
                        </p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                            Empire Ballroom, Unawatuna
                        </p>
                    </div>

                    <div className="border-t border-stone-100 pt-6 mt-6">
                        <p className="text-[9px] tracking-widest text-stone-400 uppercase">
                            RSVP ON OR BEFORE 01ST OF AUGUST 2026
                        </p>
                        <p className="text-[9px] tracking-wider text-[#B8935A] font-medium uppercase mt-1">
                            {wedding.groom_name} - 0740977978 | {wedding.bride_name} - 0775079144
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
