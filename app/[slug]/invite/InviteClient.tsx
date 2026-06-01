// app/[slug]/invite/InviteClient.tsx
'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform
} from 'framer-motion';
import {
    CalendarDays, MapPin, Check, X, Users, Volume2, VolumeX,
    Heart, Clock, Shirt, MessageSquare, Quote, ChevronDown,
} from 'lucide-react';
import EnvelopeClient from '../EnvelopeClient';
import { Card, Radio, Input, Button, Form, ConfigProvider } from 'antd';
import { toast } from 'sonner';

interface InviteClientProps {
    wedding: any;
}

const PetalsLayer = memo(() => {
    const petals = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            size: Math.random() * 25 + 15,
            left: Math.random() * 100,
            duration: Math.random() * 8 + 10,
            delay: Math.random() * 15,
            xDrift1: Math.random() * 80 - 40,
            xDrift2: Math.random() * 80 - 40,
            rotateMax: Math.random() * 360 + 180,
            blur: Math.random() > 0.5 ? 'blur(1px)' : 'none'
        }));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 2 }}

            className="fixed inset-0 pointer-events-none overflow-hidden z-[1]"
        >
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute"
                    style={{
                        width: `${petal.size}px`,
                        height: `${petal.size}px`,
                        left: `${petal.left}%`,
                        top: '-50px',
                        backgroundImage: 'url("/rose.png")',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        filter: petal.blur,
                        opacity: 0.5
                    }}
                    animate={{
                        y: ['0vh', '400vh'],
                        x: [0, petal.xDrift1, petal.xDrift2],
                        rotate: [0, petal.rotateMax],
                        opacity: [0.5, 0.8, 0.8, 0.5]
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        delay: petal.delay,
                        ease: "linear",
                        times: [0.5, 0.6, 0.9, 1]
                    }}
                />
            ))}
        </motion.div>
    );
});
PetalsLayer.displayName = 'PetalsLayer';


export default function InviteClient({ wedding }: InviteClientProps) {
    const [guest, setGuest] = useState<any>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    // RSVP Form States
    const [attending, setAttending] = useState<'yes' | 'no' | ''>('');
    const [guestsCount, setGuestsCount] = useState(1);
    const [blessingInput, setBlessingInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { scrollY, scrollYProgress } = useScroll();

    const heroScale = useTransform(
        scrollY,
        [0, 500],
        [1, 0.92]
    );

    const heroOpacity = useTransform(
        scrollY,
        [0, 500],
        [1, 0]
    );

    const particlesY = useTransform(
        scrollY,
        [0, 1500],
        [0, 300]
    );

    // Live Wishes Feed
    const [recentBlessings, setRecentBlessings] = useState<any[]>([]);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setIsMounted(true);
        fetchBlessings();
    }, [wedding.id]);

    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            if (!isPlaying) {
                toggleMusic();
            }
        }, 1000);

        return () => clearTimeout(autoPlayTimer);
    }, []);

    const fetchBlessings = async () => {
        try {
            const { data, error } = await supabase
                .from('rsvps')
                .select('guest_name, blessing, status')
                .eq('wedding_id', wedding.id)
                .not('blessing', 'is', null)
                .neq('blessing', '')
                .order('submitted_at', { ascending: false })
                .limit(6);

            if (!error && data) {
                setRecentBlessings(data);
            }
        } catch (err) {
            toast.error("Failed to fetch blessings.");
        }
    };

    // Extract query params and initialize guest logic on load
    useEffect(() => {
        const initializeGuest = async () => {
            if (typeof window === 'undefined') return;

            const params = new URLSearchParams(window.location.search);
            const guestId = params.get('g');
            console.log("Initializing guest for wedding:", wedding.slug, "Guest ID:", guestId);

            if (guestId) {
                const { data, error: fetchError } = await supabase
                    .from('guests')
                    .select('*')
                    .eq('id', guestId)
                    .single();

                if (fetchError) {
                    toast.error("Error fetching guest.");
                    setGuest({ id: 'generic', name: 'Family & Friends', max_attendees: 5, type: 'unregistered' });
                } else if (data) {
                    setGuest({
                        id: data.id,
                        name: data.name,
                        max_attendees: data.max_attendees || 2,
                        type: 'registered'
                    });

                    if (data.status === 'invited' || data.status === 'sent') {
                        await supabase
                            .from('guests')
                            .update({ status: 'opened', last_seen: new Date().toISOString() })
                            .eq('id', data.id);
                    }
                } else {
                    setGuest({ id: 'generic', name: 'Family & Friends', max_attendees: 5, type: 'unregistered' });
                }
            } else {
                setGuest({
                    id: 'generic',
                    name: 'Family & Friends',
                    max_attendees: 5,
                    type: 'unregistered'
                });
            }
        };

        initializeGuest().catch(err => {
            toast.error("Failed to load invitation details.");
        });
    }, [wedding.id]);

    // Audio setup
    useEffect(() => {
        if (wedding && wedding.bg_music_url && wedding.bg_music_url.trim() !== '') {
            const sound = new Audio(wedding.bg_music_url);
            sound.loop = true;
            setAudio(sound);

            sound.play()
                .then(() => setIsPlaying(true))
                .catch(() => console.log('Autoplay blocked. User tap is required.'));

            return () => {
                sound.pause();
                sound.src = '';
            };
        }
    }, [wedding?.bg_music_url]);

    // Countdown timer ticker
    useEffect(() => {
        if (!wedding?.wedding_date) return;
        const target = new Date(wedding.wedding_date).getTime();
        if (isNaN(target)) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
            } else {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [wedding.wedding_date]);

    const handleOpenInvitation = () => {
        setIsOpened(true);


        // Try playing music on user interaction
        if (audio && !isPlaying) {
            audio.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio play failed:", e));
        }
    };

    const toggleMusic = async () => {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Autoplay blocked:", err);

            }
        }
    };

    const handleRSVPSubmit = async () => {
        if (!attending) {
            toast.error('Please select an option before submitting!');
            return;
        }
        if (!guest) return;

        setLoading(true);

        try {
            if (guest.type === 'registered') {
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
            } else {
                const { error } = await supabase
                    .from('rsvps')
                    .insert([
                        {
                            wedding_id: wedding.id,
                            guest_name: guest.name,
                            status: attending,
                            attendees_count: attending === 'yes' ? guestsCount : 0,
                            blessing: blessingInput.trim() || null
                        }
                    ]);

                if (error) throw error;
            }

            setSubmitted(true);
            fetchBlessings();
            toast.success('Response updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Error updating response. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    // Card Date rendering setup
    const eventDate = new Date(wedding.wedding_date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dayNum = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
    const monthName = eventDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();

    const getOrdinalSuffix = (num: number) => {
        const j = num % 10, k = num % 100;
        if (j === 1 && k !== 11) return 'ST';
        if (j === 2 && k !== 12) return 'ND';
        if (j === 3 && k !== 13) return 'RD';
        return 'TH';
    };
    const ordinalSuffix = getOrdinalSuffix(eventDate.getDate());

    const getEmbedUrl = () => {
        if (!wedding?.location_map_link) return '';
        const link = wedding.location_map_link;
        if (link.includes('embed')) {
            if (link.startsWith('<iframe')) {
                const match = link.match(/src="([^"]+)"/);
                return match ? match[1] : link;
            }
            return link;
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(wedding.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4">
                <p className="text-stone-800 font-serif text-xl mb-4 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#B8935A] text-white rounded-lg font-bold"
                >
                    RETRY
                </button>
            </div>
        );
    }

    if (!guest) {
        return (
            <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center text-stone-400 font-serif animate-pulse">
                <div className="text-center">
                    <Heart className="h-8 w-8 mx-auto mb-4 opacity-20" />
                    <p className="tracking-[0.2em] text-xs uppercase">Preparing Invitation</p>
                </div>
            </div>
        );
    }

    const SectionReveal = ({
        children
    }: {
        children: React.ReactNode
    }) => (
        <motion.div
            initial={{
                opacity: 0,
                y: 80,
                scale: 0.96,
                filter: 'blur(10px)'
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)'
            }}
            viewport={{
                once: true,
                amount: 0.2
            }}
            transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
            }}
        >
            {children}
        </motion.div>
    );

    const blessingContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const blessingItem = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.92
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1
        }
    };

    return (
        <>
            <ConfigProvider theme={{ token: { fontFamily: 'inherit', colorPrimary: '#B8935A' } }}>
                <AnimatePresence mode="wait">
                    {!isOpened ? (
                        <motion.div
                            key="envelope"
                            exit={{ opacity: 0 }} // Envelope එක fade out වෙන්න
                            transition={{ duration: 0.5 }}
                        >
                            <EnvelopeClient
                                key="envelope"
                                wedding={wedding}
                                recipientName={guest?.name}
                                onOpen={handleOpenInvitation}
                            /></motion.div>
                    ) : (
                        <motion.div
                            key="invitation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }} // තත්පර 0.8ක් ඇතුලත smooth ලෝඩ් වෙනවා
                            className="min-h-screen bg-[#FAF6F0] relative selection:bg-[#B8935A]/10 selection:text-[#B8935A]"
                        >
                            {/* Dynamic Background Magic Particles Layer (Pink/Red Tones) */}
                            <PetalsLayer />
                            <motion.div
                                className="fixed left-0 top-0 w-[3px] h-screen bg-[#B8935A] origin-top z-[999]"
                                style={{
                                    scaleY: scrollYProgress
                                }}
                            />
                            {/* ── STYLE INJECTIONS ── */}
                            <style dangerouslySetInnerHTML={{
                                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                .font-cursive { font-family: 'Great Vibes', cursive; }
                .font-serif-card { font-family: 'Playfair Display', serif; }
                `
                            }} />

                            {/* Decorative frame lines */}
                            <div className="absolute inset-4 md:inset-6 border border-[#B8935A]/10 pointer-events-none z-0" />
                            <div className="absolute inset-5 md:inset-7 border border-[#B8935A]/5 pointer-events-none z-0" />



                            {/* ── SECTION 1: CINEMATIC HERO COVER (PREMIUM ULTRA-LUXURY WITH LIVE PARTICLES) ── */}
                            <motion.section
                                style={{
                                    scale: heroScale,
                                    opacity: heroOpacity
                                }} className="min-h-screen flex flex-col justify-between items-center p-5 relative z-10 text-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(250,247,242,0.6)_0%,rgba(245,240,232,1)_100%)]">

                                {/* Top Spacing Matrix */}
                                <div className="h-4" />

                                {/* Main Cinematic Typography Body */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-8 lg:w-[600px] w-full max-w-[600px] relative z-10 p-4 md:p-8 rounded-[2.5rem] border border-white/20 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]"
                                >
                                    {/* Intro Subtitle with Tracking Reveal */}
                                    <motion.div
                                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                                        animate={{ opacity: 1, letterSpacing: "0.35em" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <span className="text-[11px] md:text-[12px] uppercase font-bold tracking-[0.35em] text-[#B8935A]">
                                            TOGETHER WITH THEIR FAMILIES
                                        </span>
                                        {/* Minimalist Top Ornament */}
                                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B8935A]/50 to-transparent" />
                                    </motion.div>

                                    {/* The Royal Couple Moniker Container */}
                                    <div className="space-y-2">
                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="text-5xl md:text-7xl font-serif-card text-stone-900 font-extralight tracking-wide leading-[1.2]"
                                        >
                                            <span className="block hover:text-[#B8935A] transition-colors duration-500 cursor-default font-normal tracking-normal">
                                                {wedding.groom_name}
                                            </span>

                                            {/* Luxury Intertwined Ampersand Motif */}
                                            <motion.span
                                                animate={{ scale: [0.97, 1.03, 0.97] }}
                                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                                className="font-cursive text-6xl md:text-7xl text-[#B8935A] block my-3 italic drop-shadow-[0_2px_4px_rgba(184,147,90,0.1)]"
                                            >
                                                &amp;
                                            </motion.span>

                                            <span className="block hover:text-[#B8935A] transition-colors duration-500 cursor-default font-normal tracking-normal">
                                                {wedding.bride_name}
                                            </span>
                                        </motion.h1>
                                    </div>

                                    {/* Invitation Message & Bottom Divider Line */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                        className="flex flex-col items-center gap-4 pt-4"
                                    >
                                        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#B8935A]/30 to-transparent" />
                                        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold block">
                                            REQUEST THE HONOR OF YOUR PRESENCE
                                        </span>
                                        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#B8935A]/30 to-transparent" />
                                    </motion.div>

                                    {/* Premium Translucent Floating Guest Card Box */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-white/70 border border-white/40 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(184,147,90,0.12)] max-w-lg mx-auto backdrop-blur-md relative group hover:border-[#B8935A]/30 hover:shadow-[0_30px_60px_-15px_rgba(184,147,90,0.18)] transition-all duration-700 bg-gradient-to-b from-white/90 to-white/60"
                                    >
                                        {/* Box Internal Micro Corner Accents */}
                                        <div className="absolute top-4 left-4 size-2.5 border-t border-l border-[#B8935A]/40 rounded-tl transition-all duration-500 group-hover:top-3 group-hover:left-3" />
                                        <div className="absolute top-4 right-4 size-2.5 border-t border-r border-[#B8935A]/40 rounded-tr transition-all duration-500 group-hover:top-3 group-hover:right-3" />
                                        <div className="absolute bottom-4 left-4 size-2.5 border-b border-l border-[#B8935A]/40 rounded-bl transition-all duration-500 group-hover:bottom-3 group-hover:left-3" />
                                        <div className="absolute bottom-4 right-4 size-2.5 border-b border-r border-[#B8935A]/40 rounded-br transition-all duration-500 group-hover:bottom-3 group-hover:right-3" />

                                        <p className="text-xl md:text-2xl font-serif-card text-stone-900 font-medium italic tracking-wide">
                                            Dear <span className="text-[#9e7c46] not-italic font-semibold tracking-normal block mt-1 drop-shadow-xs">{guest.name}</span>
                                        </p>
                                        <div className="h-[1px] w-12 bg-[#B8935A]/20 mx-auto my-5" />
                                        <p className="text-[10px] md:text-xs text-stone-400 tracking-widest uppercase font-bold">
                                            We invite you to celebrate our wedding journey
                                        </p>
                                    </motion.div>
                                </motion.div>

                                {/* Royal Scroll Helper Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                    className="flex flex-col items-center gap-2 cursor-pointer group/scroll z-10"
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <span className="text-[12px] uppercase tracking-[0.3em] text-stone-400 font-bold group-hover/scroll:text-[#B8935A] transition-colors duration-300">Scroll to open</span>
                                    <motion.div
                                        animate={{ y: [0, 6, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                    >
                                        <ChevronDown className="h-6 w-6 text-[#B8935A] group-hover/scroll:scale-110 transition-transform" />
                                    </motion.div>
                                </motion.div>
                            </motion.section>

                            {/* ── MAIN CONTENT CONTAINER (Responsive layout change: width 75% on large screens, full on mobile) ── */}
                            <div className="w-full xl:max-w-[75%] lg:max-w-[85%] md:max-w-[90%] mx-auto px-4 md:px-6 relative z-10 space-y-16">

                                {/* ── SECTION 2: GRID WORKSPACE (INVITATION CANVAS & RSVP PORTAL) ── */}

                                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12  items-center justify-center w-full h-auto">
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 80,
                                            rotateX: 15,
                                            scale: 0.95
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                            rotateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1.3,
                                            ease: [0.16, 1, 0.3, 1]
                                        }}
                                        style={{
                                            transformPerspective: 1200
                                        }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        className="bg-white w-full max-w-[720px] flex flex-col items-center justify-center p-6 md:p-12 text-center relative overflow-hidden bg-transparent rounded-2xl"
                                    >
                                        {/* Header Content */}
                                        <div className="space-y-1 mb-6">
                                            <p className="text-[10px] tracking-widest text-[#B8935A] uppercase font-semibold">TOGETHER WITH THEIR FAMILIES</p>
                                            <p className="text-[9px] tracking-widest text-stone-400 font-medium uppercase mt-2">
                                                REQUEST THE HONOUR OF THE PRESENCE OF
                                            </p>
                                        </div>

                                        {/* Image Canvas View Mode - Responsive Width */}
                                        {wedding.blank_card_url ? (
                                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-transparent @container">
                                                <img src={wedding.blank_card_url} alt="Blank Card template" className="w-full h-full object-cover pointer-events-none" />
                                                <div
                                                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%] select-none font-semibold"
                                                    style={{
                                                        top: `${wedding.name_y_position}%`,
                                                        color: wedding.name_color,
                                                        fontSize: `${(wedding.name_font_size / 340) * 100}cqw`,
                                                        fontFamily: 'Playfair Display, serif',
                                                        textShadow: `0 1px 4px ${wedding.name_color}15`
                                                    }}
                                                >
                                                    {guest.name}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Fallback Pure Embedded Text Layout Mode */
                                            <div className="space-y-6 py-6 w-full">
                                                <div className="py-2">
                                                    <span className="text-[9px] uppercase tracking-widest text-[#B8935A] block">SPECIALLY INVITED</span>
                                                    <p className="text-2xl font-serif-card font-semibold text-stone-800 italic mt-1 px-4 inline-block border-b border-stone-200 pb-1">
                                                        {guest.name}
                                                    </p>
                                                </div>

                                                <h2 className="text-4xl md:text-5xl font-cursive text-[#B8935A] tracking-wider py-1">
                                                    {wedding.groom_name}
                                                </h2>
                                                <span className="font-serif-card text-sm text-stone-400 block my-1">and</span>
                                                <h2 className="text-4xl md:text-5xl font-cursive text-[#B8935A] tracking-wider py-1">
                                                    {wedding.bride_name}
                                                </h2>

                                                {/* Date Segmented Grid */}
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
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[9px] italic text-stone-400 uppercase tracking-widest">AT</span>
                                                    <p className="text-sm font-serif-card text-stone-800 font-semibold uppercase tracking-widest">
                                                        {wedding.location}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                </div>


                                {/* ── SECTION 3: BOTTOM DECORATIVE META ROW (Grid layout for Countdown & Attire) ── */}
                                <div className="grid grid-cols-1  gap-6 w-full">

                                    {/* ── 3. LIVE COUNTDOWN TIMER & ADD TO CALENDAR ── */}
                                    <div className="space-y-4">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            className="flex flex-col items-center bg-[#1C1816] text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center"
                                        >
                                            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full border border-stone-800/40" />
                                            <span className="text-[9px] uppercase tracking-[0.35em] text-amber-500 font-semibold block text-center mb-6">
                                                COUNTING DOWN TO THE VOWS
                                            </span>
                                            <div className="grid grid-cols-4 gap-3 relative z-10 max-w-sm mx-auto w-full mb-8">
                                                {[
                                                    { val: timeLeft.days, label: 'Days' },
                                                    { val: timeLeft.hours, label: 'Hours' },
                                                    { val: timeLeft.minutes, label: 'Mins' },
                                                    { val: timeLeft.seconds, label: 'Secs' }
                                                ].map(({ val, label }) => (
                                                    <div key={label} className="text-center bg-stone-900/60 border border-stone-800 p-3 rounded-2xl">
                                                        <AnimatePresence mode="wait">
                                                            <motion.span
                                                                key={val}
                                                                initial={{
                                                                    rotateX: -90,
                                                                    opacity: 0
                                                                }}
                                                                animate={{
                                                                    rotateX: 0,
                                                                    opacity: 1
                                                                }}
                                                                exit={{
                                                                    rotateX: 90,
                                                                    opacity: 0
                                                                }}
                                                                transition={{
                                                                    duration: 0.35
                                                                }}
                                                                className="text-2xl md:text-3xl font-serif-card text-amber-400 font-medium block"
                                                            >
                                                                {val}
                                                            </motion.span>
                                                        </AnimatePresence>
                                                        <span className="text-[8px] text-stone-400 uppercase tracking-widest block mt-1 font-semibold">
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add to Calendar Button */}
                                            <a
                                                href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${wedding.groom_name} & ${wedding.bride_name} Wedding`)}&dates=${new Date(wedding.wedding_date).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(wedding.wedding_date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=Join us for our wedding celebration!&location=${encodeURIComponent(wedding.location)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[50%] py-3 bg-[#B8935A] hover:bg-[#a6824e] text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
                                            >
                                                <CalendarDays className="h-4 w-4" /> Save the Date
                                            </a>
                                        </motion.div>
                                    </div>


                                    {/* ── LOCATION & MAPS SECTION ── */}
                                    <section className="py-12 px-4 bg-[#FBF9F6] w-full">
                                        <div className="max-w-6xl mx-auto w-full">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-stretch"
                                            >

                                                <div className="flex-1 space-y-6 text-center md:text-left flex flex-col justify-center">
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm uppercase tracking-[0.25em] text-[#B8935A] font-bold">
                                                            The Venue
                                                        </h3>
                                                        <h2 className="text-3xl md:text-4xl font-serif-card text-[#2B231F]">
                                                            {wedding.location_name || "Wedding Venue"}
                                                        </h2>
                                                        <p className="text-stone-500 font-medium leading-relaxed">
                                                            {wedding.location}
                                                        </p>
                                                    </div>

                                                    <p className="text-sm text-stone-400 italic">
                                                        "We look forward to celebrating this joyous occasion with you."
                                                    </p>

                                                    {wedding.location_map_link && (
                                                        <div className="pt-2">
                                                            <a
                                                                href={wedding.location_map_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 bg-[#B8935A] hover:bg-[#9e7c46] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                Open in Map
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Google Maps Embed Side - Responsive Wrapper */}
                                                <motion.div
                                                    initial={{
                                                        x: 80,
                                                        opacity: 0
                                                    }}
                                                    whileInView={{
                                                        x: 0,
                                                        opacity: 1
                                                    }}
                                                    transition={{
                                                        duration: 1
                                                    }}
                                                    viewport={{ once: true }} className="w-full md:w-1/2 h-[300px] md:h-auto min-h-[300px] rounded-2xl overflow-hidden shadow-inner border border-stone-100 relative">
                                                    {wedding.location_map_link ? (
                                                        <iframe
                                                            src={getEmbedUrl()}
                                                            width="100%"
                                                            height="100%"
                                                            style={{ border: 0, minHeight: '300px' }}
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            className="w-full h-full transition-all duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest">
                                                            Map not available
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </section>

                                </div>

                                {/* ── COLUMN RIGHT: INTERACTIVE RSVP FORM PORTAL (Takes 5 cols on Desktop) ── */}
                                <motion.div
                                    id="rsvp"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="w-full mb-10"
                                >
                                    <Card
                                        className="rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-stone-100 overflow-hidden"
                                        styles={{ body: { padding: '2rem' } }}
                                    >
                                        <div className="text-center mb-8">
                                            <h3 className="font-serif text-2xl text-stone-800">Will you be there?</h3>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-2 font-bold">Please confirm your presence</p>
                                        </div>

                                        <Form layout="vertical" onFinish={handleRSVPSubmit} className="space-y-2 flex flex-col items-center w-full">
                                            <div className="w-full flex justify-between gap-3 md:gap-4">
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    onClick={() => setAttending('yes')}
                                                    className={`flex-1 w-1/2 flex items-center justify-center rounded-xl border transition-all duration-300 font-bold tracking-widest text-[10px] !text-xs !md:text-sm cursor-pointer
            ${attending === 'yes'
                                                            ? 'bg-[#B8935A] text-white border-[#B8935A] shadow-md shadow-[#B8935A]/20'
                                                            : 'bg-white text-stone-500 border-stone-200 hover:border-[#B8935A] hover:text-[#B8935A]'}`}
                                                >
                                                    <span className='!text-[12px] !md:text-sm'>YES, ATTENDING</span>
                                                </Button>

                                                <Button
                                                    size="large"
                                                    onClick={() => setAttending('no')}
                                                    className={`flex-1 w-1/2 flex items-center justify-center rounded-xl border transition-all duration-300 font-bold tracking-widest text-[10px] !text-xs !md:text-sm cursor-pointer
            ${attending === 'no'
                                                            ? 'bg-red-500 text-red-500 border-red-500 shadow-md shadow-red-500/20'
                                                            : 'bg-white text-red-500 border-red-500 hover:border-red-500 hover:text-red-500'}`}
                                                >
                                                    <span className='!text-[12px] !md:text-sm'>
                                                        SORRY, CAN'T ATTEND
                                                    </span>
                                                </Button>
                                            </div>

                                            {attending === 'yes' && (

                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="w-full">

                                                    <Form.Item className="w-full mb-0" label={<span className="text-[12px] !md:text-sm font-bold uppercase tracking-widest text-stone-400">Number of Guests</span>}>
                                                        <Input
                                                            type="number"
                                                            size="large"
                                                            min={1}
                                                            max={guest.max_attendees}
                                                            value={guestsCount}
                                                            onChange={(e) => setGuestsCount(Number(e.target.value))}
                                                            className="w-full"
                                                        />
                                                    </Form.Item>
                                                </motion.div>
                                            )}


                                            <Form.Item className="w-full" label={<span className="text-[12px] !md:text-sm font-bold uppercase tracking-widest text-stone-400 flex w-full">Your Wishes</span>}>
                                                <Input.TextArea
                                                    placeholder="Write something special for the couple..."
                                                    size='large'
                                                    value={blessingInput}
                                                    onChange={(e) => setBlessingInput(e.target.value)}
                                                    rows={2}
                                                    className="w-full"
                                                />
                                            </Form.Item>

                                            <Button
                                                type="primary"
                                                size='large'
                                                htmlType="submit"
                                                loading={loading}
                                                className="w-full !bg-stone-900 !rounded-xl font-bold tracking-widest uppercase hover:!bg-stone-800"
                                            >
                                                <span className='!text-[12px] !md:text-sm'>
                                                    Confirm RSVP
                                                </span>
                                            </Button>
                                        </Form>
                                    </Card>
                                </motion.div>

                            </div>
                        </motion.div>
                    )
                    }
                </AnimatePresence >

                {/* ── SECTION: PREMIUM ANIMATED VINYL MUSIC WIDGET (Persistent) ── */}
                {
                    isOpened && wedding.bg_music_url && (
                        <button
                            onClick={toggleMusic}
                            className="fixed top-6 right-6 h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-white shadow-[0_0_20px_rgba(184,147,90,0.3)] z-[999] cursor-pointer overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(184,147,90,0.5)] group"
                        >
                            {/* Animated Background Ring */}
                            <div className={`absolute inset-0 rounded-full border-2 border-[#B8935A]/60 opacity-70 ${isPlaying ? 'animate-ping' : ''}`} />

                            {/* Rotating Vinyl Disk */}
                            <div
                                className={`absolute inset-1.5 rounded-full bg-stone-950 flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                            >
                                {/* Vinyl Texture grooves */}
                                <div className="absolute inset-1 rounded-full border border-stone-800/50" />
                                <div className="absolute inset-2.5 rounded-full border border-stone-800/30" />

                                {/* Center Label */}
                                <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center shadow-inner">
                                    <div className="h-1.5 w-1.5 bg-stone-950 rounded-full" />
                                </div>
                            </div>

                            {isPlaying ? (
                                <Volume2 className="h-5 w-5 text-white relative z-10 drop-shadow-md" />
                            ) : (
                                <VolumeX className="h-5 w-5 text-[#B8935A] relative z-10 drop-shadow-md" />
                            )}
                        </button>
                    )
                }
            </ConfigProvider>
        </>
    );
}