import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, X, Users, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface RSVPFormProps {
    weddingId: string;
    guest: any;
}

export const RSVPForm = ({ weddingId, guest }: RSVPFormProps) => {
    const [attending, setAttending] = useState<'yes' | 'no' | ''>('');
    const [guestsCount, setGuestsCount] = useState(1);
    const [blessingInput, setBlessingInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleRSVPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attending || !guest) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('guests')
                .update({
                    status: attending,
                    attendees_count: attending === 'yes' ? guestsCount : 0,
                    blessing: blessingInput.trim() || null,
                    last_seen: new Date().toISOString()
                })
                .eq('id', guest.id);

            if (error) throw error;

            setSubmitted(true);
            if (attending === 'yes') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.8 },
                    colors: ['#D4AF37', '#2B231F', '#FAF7F2', '#EAD9C2']
                });
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl relative overflow-hidden"
        >
            {submitted ? (
                <div className="text-center space-y-4 py-8 relative z-10">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 fill-current animate-pulse" />
                    </div>
                    <h4 className="text-xl font-serif font-semibold text-stone-800">Response Sent!</h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                        Thank you for your response. We truly appreciate it! 🤍
                    </p>
                </div>
            ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-6 relative z-10">
                    <div className="text-center space-y-2">
                        <h3 className="font-serif text-xl text-stone-800">Will you attend?</h3>
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Please confirm your RSVP</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setAttending('yes')}
                            className={`flex-1 py-4 text-[10px] font-bold tracking-widest rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${attending === 'yes'
                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-black/10'
                                : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                                }`}
                        >
                            <Check className="h-4 w-4" /> YES, I'LL BE THERE
                        </button>
                        <button
                            type="button"
                            onClick={() => setAttending('no')}
                            className={`flex-1 py-4 text-[10px] font-bold tracking-widest rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${attending === 'no'
                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-black/10'
                                : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                                }`}
                        >
                            <X className="h-4 w-4" /> NO, I CAN'T COME
                        </button>
                    </div>

                    <AnimatePresence>
                        {attending === 'yes' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="text-[10px] uppercase text-stone-400 font-bold flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5" /> Number of Attendees (Max {guest.max_attendees})
                                </label>
                                <select
                                    value={guestsCount}
                                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                                    className="w-full bg-stone-50 border border-stone-200 h-12 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-stone-900/10"
                                >
                                    {Array.from({ length: guest.max_attendees }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
                                    ))}
                                </select>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {attending !== '' && (
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-stone-400 font-bold flex items-center gap-2">
                                <MessageSquare className="h-3.5 w-3.5" /> Send your blessings to the couple
                            </label>
                            <textarea
                                placeholder="Wishing you a lifetime of love and happiness..."
                                value={blessingInput}
                                onChange={(e) => setBlessingInput(e.target.value)}
                                rows={3}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900/10 placeholder:text-stone-300 font-medium"
                            />
                        </div>
                    )}

                    {attending !== '' && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-stone-950 text-white text-[10px] font-bold tracking-[0.2em] rounded-xl hover:bg-stone-800 transition shadow-xl shadow-black/10 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'SUBMITTING...' : 'CONFIRM RSVP'}
                        </button>
                    )}
                </form>
            )}
        </motion.div>
    );
};
