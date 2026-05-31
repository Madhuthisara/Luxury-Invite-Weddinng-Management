'use client';

import React from 'react';
import { Button, Tooltip } from "antd";
import Link from 'next/link';
import { LogOut, LayoutDashboard, Settings, BarChart3, HelpCircle, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
    handleLogout: () => void;
}

export const DashboardHeader = ({ handleLogout }: DashboardHeaderProps) => {
    // Nav items mapping for cleaner code
    const navItems = [
        { name: 'Registry', icon: UserCircle },
        { name: 'Analytics', icon: BarChart3 },
        { name: 'Support', icon: HelpCircle },
    ];

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 z-50 px-6 md:px-10 flex items-center justify-between max-w-7xl mx-auto"
        >
            {/* Logo Area */}
            <div className="flex items-center gap-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="size-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-md"
                >
                    <LayoutDashboard className="size-5 text-[#B8935A]" />
                </motion.div>
                <div className="hidden sm:block">
                    <h1 className="font-serif text-lg text-stone-800 leading-tight">Luxury Invite</h1>
                    <span className="text-[9px] uppercase font-bold text-[#B8935A] tracking-[0.2em]">Management Portal</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 h-full">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href="#"
                        className="group relative px-5 h-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors"
                    >
                        <item.icon className="size-3.5" />
                        {item.name}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8935A] origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                        />
                    </Link>
                ))}
            </nav>

            {/* Actions Area */}
            <div className="flex items-center gap-3">
                <div className="h-6 w-[1px] bg-stone-200" />

                <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all border-none h-10 px-4"
                >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                </Button>
            </div>
        </motion.header>
    );
};