'use client';

import React from 'react';
import { Card } from "antd";
import { Users, Mail, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// StatCard Component - Optimized
const StatCard = ({ label, value, icon: Icon, color, percentage }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Card className="border border-stone-200/60 shadow-lg shadow-stone-900/5 bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden group">
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className={cn(
                        "size-12 rounded-2xl flex items-center justify-center transition-colors",
                        color === 'accent' ? "bg-blue-50 text-blue-600" :
                            color === 'success' ? "bg-emerald-50 text-emerald-600" :
                                color === 'danger' ? "bg-rose-50 text-rose-500" :
                                    color === 'warning' ? "bg-amber-50 text-amber-600" :
                                        "bg-stone-100 text-stone-500"
                    )}>
                        <Icon className="size-6" />
                    </div>
                    <span className="text-3xl font-serif text-stone-800 font-medium">{value ?? 0}</span>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">{label}</h3>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={cn("h-full rounded-full",
                                color === 'accent' ? "bg-blue-500" :
                                    color === 'success' ? "bg-emerald-500" :
                                        color === 'danger' ? "bg-rose-500" :
                                            color === 'warning' ? "bg-amber-500" :
                                                "bg-stone-400"
                            )}
                        />
                    </div>
                    <p className="text-[9px] text-stone-300 mt-1 font-medium">{percentage}% of total guests</p>
                </div>
            </div>
        </Card>
    </motion.div>
);

export const StatsPanel = ({ stats }: any) => {
    const total = stats.total || 0;

    const data = [
        { label: "Invited", value: stats.invited ?? 0, icon: Clock, color: "default" },
        { label: "Sent", value: stats.sent ?? 0, icon: Mail, color: "accent" },
        { label: "Opened", value: stats.opened ?? 0, icon: Eye, color: "warning" },
        { label: "Attending", value: stats.yes ?? 0, icon: CheckCircle2, color: "success" },
        { label: "Declined", value: stats.no ?? 0, icon: XCircle, color: "danger" },
    ];

    return (
        <div className="space-y-3 w-full">
            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Guest Overview</p>
                <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    {total} Total Guests
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {data.map((item, idx) => (
                    <StatCard
                        key={idx}
                        {...item}
                        percentage={total ? Math.round((item.value / total) * 100) : 0}
                    />
                ))}
            </div>
        </div>
    );
};