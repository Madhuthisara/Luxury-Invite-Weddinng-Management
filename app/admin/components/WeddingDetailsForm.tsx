'use client';

import React from 'react';
import {
    Input,
    Button,
    DatePicker
} from "antd";
import { Save, Calendar, MapPin, Clock, Info, CheckCircle2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface WeddingDetailsFormProps {
    editForm: {
        groom_name: string;
        bride_name: string;
        wedding_date: string;
        location: string;
        location_map_link: string;
        passcode: string;
        bg_music_url: string;
    };
    setEditForm: (form: any) => void;
    handleUpdateWedding: (overrideForm?: any) => void;
    updateLoading: boolean;
    updateSuccess: boolean;
    handleAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    deleteMusicFile: (currentUrl: string) => void;
}

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-1.5 flex flex-col items-start w-full">
        <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase ml-1">{label}</label>
        {children}
    </div>
);

const StyledInput = (props: any) => (
    <Input
        {...props}
        size='large'
        className={cn(
            "w-full border border-stone-100 rounded-2xl px-4 bg-stone-50/10 text-stone-800 font-medium focus:outline-none focus:border-gold-500/50 transition-all",
            props.className
        )}
    />
);

export const WeddingDetailsForm = ({
    editForm,
    setEditForm,
    handleUpdateWedding,
    updateLoading,
    updateSuccess,
    handleAudioUpload,
    uploading,
    deleteMusicFile,
}: WeddingDetailsFormProps) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Couple Details */}
                <div className="space-y-6">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 pl-1 border-l-2 border-gold-500/30 ml-1 text-left">The Happy Couple</p>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField label="Bride's Name">
                            <StyledInput
                                placeholder="Full name"
                                size='large'
                                value={editForm.bride_name}
                                onChange={(e: any) => setEditForm({ ...editForm, bride_name: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Groom's Name">
                            <StyledInput
                                size='large'
                                placeholder="Full name"
                                value={editForm.groom_name}
                                onChange={(e: any) => setEditForm({ ...editForm, groom_name: e.target.value })}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-6">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 pl-1 border-l-2 border-gold-500/30 ml-1 text-left">Event Timing</p>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField label="Wedding Date & Time">
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Select date and time"
                                size='large'
                                className="w-full rounded-2xl border border-stone-100 bg-stone-50/10"
                                value={editForm.wedding_date ? dayjs(editForm.wedding_date) : null}
                                onChange={(date) => {
                                    setEditForm({
                                        ...editForm,
                                        wedding_date: date ? date.toISOString() : ''
                                    });
                                }}
                            />
                        </FormField>
                        <FormField label="Admin Passcode">
                            <div className="relative w-full">
                                <StyledInput
                                    type="text"
                                    size='large'
                                    placeholder="Enter secure passcode"
                                    value={editForm.passcode}
                                    onChange={(e: any) => setEditForm({ ...editForm, passcode: e.target.value })}
                                    className="pl-12"
                                />

                            </div>
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Venue Details */}
            <div className="space-y-6">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 pl-1 border-l-2 border-gold-500/30 ml-1 text-left">Location Venue</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Venue Name / Location">
                        <div className="relative w-full">
                            <StyledInput
                                placeholder="e.g. Grand Ballroom"
                                value={editForm.location}
                                onChange={(e: any) => setEditForm({ ...editForm, location: e.target.value })}
                                className="pl-12"
                            />

                        </div>
                    </FormField>
                    <FormField label="Google Maps Link">
                        <StyledInput
                            placeholder="Map link"
                            value={editForm.location_map_link}
                            onChange={(e: any) => setEditForm({ ...editForm, location_map_link: e.target.value })}
                        />
                    </FormField>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 pl-1 border-l-2 border-gold-500/30 ml-1 text-left">Music Settings</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Background Music">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <StyledInput
                                    value={editForm.bg_music_url}
                                    readOnly
                                    placeholder="Upload MP3 file..."
                                    className="pl-12"
                                />
                            </div>

                            <input
                                type="file"
                                id="audio-upload"
                                className="hidden"
                                accept="audio/mp3"
                                onChange={handleAudioUpload}
                            />
                            <Button
                                onClick={() => document.getElementById('audio-upload')?.click()}
                                size='large'
                                loading={uploading}
                                className="rounded-2xl px-6 font-bold text-[10px] uppercase bg-stone-900 text-white border-none"
                            >
                                {uploading ? 'UPLOADING...' : 'UPLOAD'}
                            </Button>

                            {editForm.bg_music_url && (
                                <Button
                                    onClick={async () => {
                                        deleteMusicFile(editForm.bg_music_url);
                                        const updatedForm = { ...editForm, bg_music_url: '' };
                                        setEditForm(updatedForm);
                                        handleUpdateWedding(updatedForm);
                                    }}
                                    size='large'
                                    className="rounded-2xl px-6 font-bold text-[10px] uppercase bg-red-50 !text-red-600 border-none hover:bg-red-100 transition-colors"
                                >
                                    REMOVE
                                </Button>
                            )}
                        </div>
                    </FormField>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-50">
                <div className="hidden sm:flex items-center gap-3 text-stone-400">
                    <Info className="size-4 text-gold-400" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">Changes sync instantly with live invites</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <AnimatePresence mode="wait">
                        {updateSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
                            >
                                <CheckCircle2 className="size-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Synced</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        onClick={handleUpdateWedding}
                        className={cn(
                            "h-14 px-10 font-bold text-[10px] tracking-[0.25em] uppercase transition-all shadow-xl rounded-2xl flex items-center justify-center gap-2 border-none text-white",
                            updateLoading && "opacity-50 pointer-events-none"
                        )}
                        size='large'
                        style={{ background: '#B8935A', boxShadow: '0 12px 24px -8px rgba(184,147,90,0.35)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#a6824e')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#B8935A')}
                    >
                        {updateLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                SAVING
                            </div>
                        ) : (
                            <>
                                PUBLISH
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
