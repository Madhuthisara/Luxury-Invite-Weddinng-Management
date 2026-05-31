'use client';

import React from 'react';
import {
    Input,
    Button,
    Card,
    Select
} from "antd";
import { UserPlus, Plus, Users } from 'lucide-react';

interface AddGuestFormProps {
    newGuestName: string;
    setNewGuestName: (val: string) => void;
    maxAttendees: number;
    setMaxAttendees: (val: number) => void;
    handleAddGuest: (e: React.FormEvent) => void;
}

export const AddGuestForm = ({
    newGuestName,
    setNewGuestName,
    maxAttendees,
    setMaxAttendees,
    handleAddGuest
}: AddGuestFormProps) => {
    return (
        <Card className="shadow-2xl shadow-stone-900/5 rounded-[2.5rem] border border-stone-100 bg-white/80 backdrop-blur-md h-fit [&>.ant-card-body]:p-0 overflow-hidden">
            <div className="flex gap-3 p-4">
                <div className="flex flex-col">
                    <p className="text-tiny text-stone-400 uppercase tracking-widest font-bold text-left m-0">Register new guests</p>
                </div>
            </div>
            <div className="px-4">
                <form onSubmit={handleAddGuest} className="space-y-6">
                    <div className="space-y-1.5 flex flex-col items-start w-full">
                        <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase ml-1">Guest Name</label>
                        <Input
                            size='large'
                            placeholder="e.g. The Perera Family"
                            value={newGuestName}
                            onChange={(e) => setNewGuestName(e.target.value)}
                            className="w-full border-stone-100 rounded-2xl px-4 bg-stone-50/30 text-stone-800 font-medium focus:outline-none focus:border-gold-500/50 transition-all hover:border-gold-500/30"
                        />
                    </div>

                    <div className="space-y-1.5 flex flex-col items-start w-full">
                        <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase ml-1">Max Attendees</label>
                        <Select
                            size='large'
                            className="w-full [&>.ant-select-selector]:rounded-2xl [&>.ant-select-selector]:border-stone-100 [&>.ant-select-selector]:bg-stone-50/30 [&>.ant-select-selector]:!h-14 [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
                            value={maxAttendees}
                            onChange={(val) => setMaxAttendees(val)}
                            suffixIcon={<Users className="size-4 text-stone-300" />}
                            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
                                value: num,
                                label: `${num} ${num === 1 ? 'Person' : 'People'}`,
                                className: "font-medium text-stone-600 rounded-xl"
                            }))}
                            classNames={{ popup: { root: "rounded-2xl shadow-2xl border border-stone-100 p-2" } }}
                        />
                    </div>

                    <Button
                        htmlType="submit"
                        size='large'
                        className="w-full font-bold text-[10px] tracking-[0.25em] uppercase transition-all shadow-xl rounded-2xl flex items-center justify-center gap-2 border-none text-white"
                        style={{ background: '#B8935A', boxShadow: '0 12px 24px -8px rgba(184,147,90,0.35)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#a6824e')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#B8935A')}
                    >
                        <Plus className="size-4" />
                        ADD TO REGISTRY
                    </Button>
                </form>

                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest text-center mt-4 flex items-center justify-center gap-2 m-0">
                    <span className="h-px w-8 bg-stone-100" />
                    Guest Management
                    <span className="h-px w-8 bg-stone-100" />
                </p>
            </div>
        </Card>
    );
};
