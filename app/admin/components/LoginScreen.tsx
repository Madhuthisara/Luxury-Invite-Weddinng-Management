'use client';

import { motion } from 'framer-motion';
import {
    Button,
    Card,
    Input
} from "antd";
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginScreenProps {
    passcode: string;
    setPasscode: (val: string) => void;
    handleLogin: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
}

export const LoginScreen = ({ passcode, setPasscode, handleLogin, loading, error }: LoginScreenProps) => {
    return (
        <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4"
        >
            <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl border-none bg-white/90 backdrop-blur-xl relative overflow-hidden [&>.ant-card-body]:p-0">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                <div className="flex flex-col items-center justify-center gap-2 pt-12 pb-8">
                    <div className="size-16 bg-stone-50 text-gold-500 rounded-3xl flex items-center justify-center border border-stone-100 shadow-sm mb-2 group hover:scale-110 transition-transform duration-500">
                        <Lock className="size-6" />
                    </div>
                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-serif tracking-tight text-stone-800 m-0">Admin Entrance</h2>
                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] m-0">Authorized Personnel Only</p>
                    </div>
                </div>

                <div className="px-10 pb-12">
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2 flex flex-col items-center">
                            <label className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">Input Passcode</label>
                            <Input
                                type="password"
                                placeholder="••••••"
                                value={passcode}
                                onChange={(e: any) => setPasscode(e.target.value)}
                                className="w-full h-16 bg-stone-50/50 border-stone-100 focus:bg-white focus:border-gold-500/20 transition-all rounded-2xl text-center text-xl tracking-[0.5em] font-mono outline-none hover:border-gold-500/20"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-[10px] text-rose-500 font-bold uppercase tracking-widest text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            htmlType="submit"
                            size='large'
                            className={cn(
                                "w-full bg-stone-900 text-white font-bold text-[10px] tracking-[0.3em] uppercase transition-all shadow-2xl shadow-stone-900/20 rounded-2xl flex items-center justify-center gap-2 border-none",
                                loading && "pointer-events-none"
                            )}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    AUTHENTICATING
                                </div>
                            ) : (
                                "REQUEST ACCESS"
                            )}
                        </Button>
                    </form>

                    <div className="mt-12 flex flex-col items-center gap-4">
                        <div className="w-12 h-px bg-stone-100" />
                        <p className="text-[10px] text-stone-300 font-medium uppercase tracking-[0.2em] m-0">
                            Privacy Secured
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
