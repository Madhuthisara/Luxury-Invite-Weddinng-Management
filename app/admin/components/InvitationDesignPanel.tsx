// components/InvitationDesignPanel.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, Slider, Input } from "antd";
import { Upload, Save, MousePointer2, Type, Palette, Layout, Eye, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvitationDesignPanelProps {
    editForm: {
        name_color: string;
        name_y_position: number;
        name_font_size: number;
        blank_card_url?: string;
    };
    setEditForm: (form: any) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpdateWedding: () => void;
    uploading: boolean;
    updateLoading: boolean;
}

export const InvitationDesignPanel = ({
    editForm,
    setEditForm,
    handleFileUpload,
    handleUpdateWedding,
    uploading,
    updateLoading
}: InvitationDesignPanelProps) => {
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // ── DRAG TO POSITION LOGIC (Y-AXIS) ──
    const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !previewContainerRef.current) return;

        const containerRect = previewContainerRef.current.getBoundingClientRect();
        const relativeY = e.clientY - containerRect.top;
        let percentageY = Math.round((relativeY / containerRect.height) * 100);

        if (percentageY < 0) percentageY = 0;
        if (percentageY > 100) percentageY = 100;

        setEditForm((prev: any) => ({ ...prev, name_y_position: percentageY }));
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', stopDragging);
        } else {
            window.removeEventListener('mouseup', stopDragging);
        }
        return () => window.removeEventListener('mouseup', stopDragging);
    }, [isDragging]);

    // Direct Input Change handler
    const handleFontSizeInputChange = (value: number) => {
        let cleanSize = value;
        if (cleanSize < 12) cleanSize = 12;
        if (cleanSize > 72) cleanSize = 72;
        setEditForm((prev: any) => ({ ...prev, name_font_size: cleanSize }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* ── CONTROLS SIDE ── */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-200/60 shadow-xl space-y-8">
                <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                    <div className="p-2 bg-gold-50 rounded-xl border border-gold-100">
                        <Layout className="size-4 text-gold-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-serif font-bold text-stone-800">Card Composition</h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Fine-tune dynamic guest typography</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Vertical Position Control */}
                    <div className="space-y-2 bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-stone-600 uppercase">
                                <MousePointer2 className="size-3.5 text-gold-500" />
                                Vertical Position (Y-Axis)
                            </span>
                            <span className="text-[10px] font-mono font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-100">
                                {editForm.name_y_position}%
                            </span>
                        </div>
                        <Slider
                            step={1}
                            max={100}
                            min={0}
                            aria-label="Vertical Position"
                            value={editForm.name_y_position}
                            onChange={(val: number) => setEditForm({ ...editForm, name_y_position: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Font Size Control Layer */}
                    <div className="space-y-3 bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-stone-600 uppercase">
                                <Type className="size-3.5 text-stone-400" />
                                Typography Scale (Font Size)
                            </span>

                            {/* Direct Type-in Input field */}
                            <div className="w-24 relative flex items-center">
                                <Input
                                    size='large'
                                    type="number"
                                    min={12}
                                    max={72}
                                    value={editForm.name_font_size.toString()}
                                    onChange={(e) => handleFontSizeInputChange(parseInt(e.target.value) || 12)}
                                    className="font-mono font-bold text-center pr-6 border border-stone-200 rounded-xl"
                                />
                                {/* TypeScript-safe positioning for custom text badge inside container */}
                                <span className="absolute right-3 text-[9px] font-bold text-stone-400 pointer-events-none">PX</span>
                            </div>
                        </div>
                        <Slider
                            step={1}
                            max={72}
                            min={12}
                            aria-label="Font Size Slider"
                            value={editForm.name_font_size}
                            onChange={(val: number) => setEditForm({ ...editForm, name_font_size: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Color Picker Input */}
                    <div className="space-y-2 bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                        <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-stone-600 uppercase mb-1">
                            <Palette className="size-3.5 text-gold-500" />
                            Signature Text Color
                        </span>
                        <div className="relative flex items-center group">
                            <div className="absolute left-4 z-20 size-7 rounded-lg border border-stone-200 shadow-xs shrink-0 overflow-hidden cursor-pointer">
                                <input
                                    type="color"
                                    value={editForm.name_color}
                                    onChange={(e) => setEditForm({ ...editForm, name_color: e.target.value })}
                                    className="absolute inset-0 scale-150 cursor-pointer w-full h-full p-0 border-0 bg-transparent"
                                />
                                <div className="w-full h-full pointer-events-none" style={{ backgroundColor: editForm.name_color }} />
                            </div>
                            <Input
                                placeholder="#B8935A"
                                size='large'
                                value={editForm.name_color}
                                onChange={(e) => setEditForm({ ...editForm, name_color: e.target.value })}
                                className="w-full font-mono font-bold tracking-widest text-sm pl-14 border border-stone-200 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Upload Template */}
                    <div className="space-y-2">
                        <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-stone-600 uppercase">
                            <Upload className="size-3.5 text-stone-400" />
                            Blank Card Template
                        </span>
                        <label className="relative block w-full group cursor-pointer">
                            <div className="w-full h-24 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50 hover:bg-gold-50/20 hover:border-gold-500/30 transition-all flex flex-col items-center justify-center gap-1">
                                <Upload className={cn("size-5 text-stone-400 transition-transform group-hover:-translate-y-0.5", uploading && "animate-bounce text-gold-500")} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {uploading ? 'Uploading Asset...' : 'Click to upload blank image'}
                                </span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>

                        {editForm.blank_card_url && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 w-fit text-[9px] font-bold uppercase tracking-wider">
                                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Cloud Template Link Active
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleUpdateWedding}
                    disabled={updateLoading}
                    size='large'
                    className="w-full font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer border-none text-white"
                    style={{ background: '#B8935A', boxShadow: '0 12px 24px -8px rgba(184,147,90,0.35)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#a6824e')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#B8935A')}
                >
                    {updateLoading ? (
                        <>
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving Layout Settings...
                        </>
                    ) : (
                        <>
                            Persist Design Layout
                        </>
                    )}
                </Button>
            </div>

            {/* ── PORTRAIT PREVIEW SIDE ── */}
            <div className="space-y-4 lg:sticky lg:top-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-100">
                        <Eye className="size-4 text-stone-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-serif font-bold text-stone-800">Visual Workspace</h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">Drag text to reposition • Proportional scaling enabled</p>
                    </div>
                </div>

                <div
                    ref={previewContainerRef}
                    onMouseMove={handleContainerMouseMove}
                    className="relative desert-preview aspect-[3/4.2] w-full max-w-sm mx-auto overflow-hidden shadow-2xl border-8 border-white bg-stone-50 flex items-center justify-center select-none @container"
                >
                    {editForm.blank_card_url ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={editForm.blank_card_url}
                                alt="Blank Card Base"
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />

                            {/* Proportional Scaling Overlay Element using container query width (cqw) */}
                            <div
                                onMouseDown={() => setIsDragging(true)}
                                className={cn(
                                    "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 font-serif font-semibold cursor-grab active:cursor-grabbing group/name active:scale-[1.01] transition-transform duration-75 select-none border border-transparent hover:border-gold-500/40 hover:bg-gold-500/5 py-1.5 rounded-lg touch-none",
                                    isDragging && "cursor-grabbing border-gold-500/60 bg-gold-500/10"
                                )}
                                style={{
                                    top: `${editForm.name_y_position}%`,
                                    color: editForm.name_color,
                                    fontSize: `${(editForm.name_font_size / 340) * 100}cqw`,
                                    textShadow: `0 1px 4px ${editForm.name_color}15`
                                }}
                            >
                                <div className="relative inline-block">
                                    Mr. & Mrs. Wijesinghe
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] font-sans px-2 py-0.5 rounded opacity-0 group-hover/name:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md uppercase tracking-widest whitespace-nowrap font-bold pointer-events-none">
                                        <Move className="size-2.5 text-gold-400" /> Drag to Move
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 space-y-2">
                            <p className="text-xs font-serif italic text-stone-400">No layout template uploaded yet.</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Upload a blank design to activate canvas.</p>
                        </div>
                    )}


                </div>
            </div>

        </div>
    );
};