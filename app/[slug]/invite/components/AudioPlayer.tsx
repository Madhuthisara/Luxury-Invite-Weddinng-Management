import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
    toggleMusic: () => void;
}

export const AudioPlayer = ({ isPlaying, toggleMusic }: AudioPlayerProps) => {
    return (
        <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-white border border-stone-200/50 shadow-xl z-50 cursor-pointer overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-[#B8935A]/15"
        >
            <div className={`absolute inset-1 rounded-full bg-[#1C1816] border border-stone-800 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                <div className="h-3.5 w-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-stone-900" />
                </div>
            </div>
            {isPlaying ? (
                <Volume2 className="h-4 w-4 text-white relative z-10 animate-pulse" />
            ) : (
                <VolumeX className="h-4 w-4 text-stone-400 relative z-10" />
            )}
        </button>
    );
};
