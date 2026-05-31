'use client';

import React from 'react';
import { Modal, Button } from "antd";
import { Share2, Send, Copy, X, Mail } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    guest: { name: string; id: string; phone?: string; email?: string } | null;
    generateInviteLink: (id: string | null) => string;
    handleCopy: (guest: any) => void;
}

export const ShareModal = ({
    isOpen,
    onClose,
    guest,
    generateInviteLink,
    handleCopy
}: ShareModalProps) => {
    const inviteLink = generateInviteLink(guest?.id || null);
    const messageText = `Hi ${guest?.name}! We'd love for you to join us at our wedding. Here is your digital invitation: ${inviteLink}`;

    const shareViaWhatsApp = () => {
        const phone = guest?.phone || "";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
        window.open(url, '_blank');
    };

    const shareViaEmail = () => {
        const subject = "Our Wedding Invitation";
        const body = encodeURIComponent(messageText);
        window.location.href = `mailto:${guest?.email || ''}?subject=${subject}&body=${body}`;
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            className="w-full max-w-sm rounded-[2.5rem]"
        >
            <div className="relative bg-white/90 w-full  overflow-hidden">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Share2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-lg font-serif text-stone-800 m-0">Share Invite</p>
                            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest m-0">Choose method</p>
                        </div>
                    </div>
                    <Button type="text" onClick={onClose} className="rounded-full p-2"><X className="size-4" /></Button>
                </div>

                <div className="p-8 pt-2 space-y-4">
                    {/* Copy Link Button */}
                    <Button onClick={() => handleCopy(guest)} className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                        <Copy className="size-4" /> Copy Link
                    </Button>

                    {/* WhatsApp Button */}
                    <Button onClick={shareViaWhatsApp} className="w-full h-14 bg-[#25D366] text-white border-none rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-[#1ebd5d] transition-all">
                        <Send className="size-4" /> WhatsApp
                    </Button>

                    {/* Email Button */}
                    <Button onClick={shareViaEmail} className="w-full h-14 bg-stone-800 text-white border-none rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-900 transition-all">
                        <Mail className="size-4" /> Send Email
                    </Button>
                </div>
            </div>
        </Modal>
    );
};