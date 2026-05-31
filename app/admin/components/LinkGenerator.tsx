import { Link as LinkIcon, Send } from 'lucide-react';

interface LinkGeneratorProps {
    guestNameInput: string;
    setGuestNameInput: (val: string) => void;
    handleGenerateLink: () => void;
    generatedLink: string;
}

export const LinkGenerator = ({
    guestNameInput,
    setGuestNameInput,
    handleGenerateLink,
    generatedLink
}: LinkGeneratorProps) => {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="font-serif text-xl text-charcoal">Personalized WhatsApp Link Builder</h3>
                <p className="text-xs text-stone-400 mt-1">
                    Type a guest name to generate a personalised invitation URL.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-sans text-stone-400 uppercase tracking-widest font-semibold">
                    Guest Name
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g. Saman and Family"
                        value={guestNameInput}
                        onChange={(e) => setGuestNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateLink()}
                        className="flex-1 h-11 bg-stone-50 border border-stone-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                    <button
                        onClick={handleGenerateLink}
                        className="h-11 px-6 bg-charcoal hover:bg-stone-800 text-white font-serif text-xs tracking-widest rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <LinkIcon className="h-3.5 w-3.5" /> BUILD
                    </button>
                </div>
            </div>

            {generatedLink && (
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
                    <div>
                        <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest font-semibold">
                            Generated Invitation URL
                        </p>
                        <p className="text-xs font-mono bg-white p-3 rounded-lg border border-stone-200 text-gold-600 font-medium overflow-x-auto mt-2 select-all">
                            {generatedLink}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(generatedLink);
                                alert('Link copied!');
                            }}
                            className="h-10 px-5 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl text-xs font-semibold text-charcoal transition cursor-pointer"
                        >
                            📋 Copy Link
                        </button>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                                `A new chapter begins, written with love, laughter, and togetherness ✨\n\nDear ${guestNameInput},\nWe invite you to witness the day our two paths become one.\n\nOpen your digital invitation here:\n${generatedLink}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <Send className="h-3.5 w-3.5" /> Share via WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
