'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, Button, Tabs } from "antd";

// Sub-components
import { LoginScreen } from './components/LoginScreen';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsPanel } from './components/StatsPanel';
import { GuestTable } from './components/GuestTable';
import { AddGuestForm } from './components/AddGuestForm';
import { WeddingDetailsForm } from './components/WeddingDetailsForm';
import { InvitationDesignPanel } from './components/InvitationDesignPanel';
import { ShareModal } from './components/ShareModal';

export default function AdminDashboardPage() {
    const [passcode, setPasscode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Dynamic Wedding & Guest State
    const [wedding, setWedding] = useState<any>(null);
    const [guestsList, setGuestsList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'design'>('overview');

    // Guest Management State
    const [newGuestName, setNewGuestName] = useState('');
    const [maxAttendees, setMaxAttendees] = useState(2);

    // Editing Wedding Details & Design State
    const [editForm, setEditForm] = useState({
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        location: '',
        location_map_link: '',
        bg_music_url: '',
        passcode: '',
        blank_card_url: '',
        name_y_position: 40,
        name_color: '#B8935A',
        name_font_size: 28
    });
    const [uploading, setUploading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState('');

    // Share Modal State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedGuestForShare, setSelectedGuestForShare] = useState<any>(null);

    // Check session on load
    useEffect(() => {
        const savedWedding = sessionStorage.getItem('logged_wedding');
        if (savedWedding) {
            const parsed = JSON.parse(savedWedding);
            setWedding(parsed);
            setIsLoggedIn(true);
            fetchDashboardData(parsed.id);
            populateEditForm(parsed);
        }
    }, []);

    const populateEditForm = (data: any) => {
        setEditForm({
            groom_name: data.groom_name || '',
            bride_name: data.bride_name || '',
            wedding_date: data.wedding_date ? new Date(data.wedding_date).toISOString().slice(0, 16) : '',
            location: data.location || '',
            location_map_link: data.location_map_link || '',
            bg_music_url: data.bg_music_url || '',
            passcode: data.passcode || '',
            blank_card_url: data.blank_card_url || '',
            name_y_position: data.name_y_position || 40,
            name_color: data.name_color || '#B8935A',
            name_font_size: data.name_font_size || 28
        });
    };

    const fetchDashboardData = async (weddingId: string) => {
        try {
            const { data, error: fetchErr } = await supabase
                .from('guests')
                .select('*')
                .eq('wedding_id', weddingId)
                .order('name', { ascending: true });

            if (fetchErr) throw fetchErr;
            setGuestsList(data || []);
        } catch (err) {
            console.error('Error fetching guests:', err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: loginErr } = await supabase
                .from('weddings')
                .select('*')
                .eq('passcode', passcode)
                .single();

            if (loginErr || !data) {
                throw new Error('Invalid passcode. Please try again.');
            }

            setWedding(data);
            sessionStorage.setItem('logged_wedding', JSON.stringify(data));
            setIsLoggedIn(true);
            await fetchDashboardData(data.id);
            populateEditForm(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('logged_wedding');
        setIsLoggedIn(false);
        setWedding(null);
        setPasscode('');
    };

    const handleUpdateWedding = async () => {
        if (!wedding) return;
        setUpdateLoading(true);
        setUpdateSuccess('');

        try {
            const { data, error: updateErr } = await supabase
                .from('weddings')
                .update({
                    groom_name: editForm.groom_name,
                    bride_name: editForm.bride_name,
                    wedding_date: new Date(editForm.wedding_date).toISOString(),
                    location: editForm.location,
                    location_map_link: editForm.location_map_link,
                    bg_music_url: editForm.bg_music_url,
                    passcode: editForm.passcode,
                    blank_card_url: editForm.blank_card_url,
                    name_y_position: editForm.name_y_position,
                    name_color: editForm.name_color,
                    name_font_size: editForm.name_font_size
                })
                .eq('id', wedding.id)
                .select()
                .single();

            if (updateErr) throw updateErr;

            setWedding(data);
            sessionStorage.setItem('logged_wedding', JSON.stringify(data));
            setUpdateSuccess('Settings updated successfully! 🎉');
            setTimeout(() => setUpdateSuccess(''), 3000);
        } catch (err: any) {
            console.error(err);
            alert('Failed to update details.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGuestName.trim() || !wedding) return;

        const { error: insertError } = await supabase
            .from('guests')
            .insert([
                {
                    wedding_id: wedding.id,
                    name: newGuestName.trim(),
                    max_attendees: maxAttendees,
                    status: 'invited'
                }
            ]);

        if (!insertError) {
            setNewGuestName('');
            setMaxAttendees(2);
            await fetchDashboardData(wedding.id);
        } else {
            console.error(insertError);
            alert('Failed to add guest. Please try again.');
        }
    };

    const handleDeleteGuest = async (id: string) => {
        if (!confirm('Are you sure you want to remove this guest?')) return;
        const { error: deleteError } = await supabase
            .from('guests')
            .delete()
            .eq('id', id);

        if (!deleteError) {
            await fetchDashboardData(wedding.id);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string, attendeesCount?: number) => {
        const updatePayload: any = { status: newStatus };
        if (attendeesCount !== undefined) {
            updatePayload.attendees_count = attendeesCount;
        }

        const { error: updateError } = await supabase
            .from('guests')
            .update(updatePayload)
            .eq('id', id);

        if (!updateError) {
            await fetchDashboardData(wedding.id);
        }
    };

    const handleCopyLink = (guest: any) => {
        if (!wedding) return;
        const link = `${window.location.origin}/${wedding.slug}/invite?g=${guest.id}`;
        navigator.clipboard.writeText(link);
        setUpdateSuccess(`Invitation link for ${guest.name} copied! 📋`);
        setTimeout(() => setUpdateSuccess(''), 3000);
    };

    const handleShareLink = (guest: any) => {
        setSelectedGuestForShare(guest);
        setIsShareModalOpen(true);

        if (guest.status === 'invited') {
            handleUpdateStatus(guest.id, 'sent');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !wedding) return;
        setUploading(true);

        try {
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${wedding.id}-${Math.random()}.${fileExt}`;
            const filePath = `templates/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('wedding-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('wedding-assets')
                .getPublicUrl(filePath);

            setEditForm({ ...editForm, blank_card_url: publicUrl });
        } catch (err) {
            console.error('Error uploading:', err);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCFB] text-stone-900 selection:bg-gold-200/30">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-gold-50/50 blur-[120px] rounded-full rotate-12" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-stone-100 blur-[120px] rounded-full -rotate-12" />
            </div>

            <AnimatePresence mode="wait">
                {!isLoggedIn ? (
                    <LoginScreen
                        passcode={passcode}
                        setPasscode={setPasscode}
                        handleLogin={handleLogin}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-10"
                    >
                        {/* Header */}
                        <DashboardHeader handleLogout={handleLogout} />

                        {/* Metrics */}
                        {wedding && (
                            <StatsPanel
                                stats={{
                                    total: guestsList.length,
                                    invited: guestsList.filter(g => g.status === 'invited').length,
                                    sent: guestsList.filter(g => g.status === 'sent').length,
                                    opened: guestsList.filter(g => g.status === 'opened').length,
                                    yes: guestsList.filter(g => g.status === 'yes').length,
                                    no: guestsList.filter(g => g.status === 'no').length
                                }}
                            />
                        )}

                        {/* Tabs & Content */}
                        <div className="w-full flex flex-col items-start">
                            <div className="w-full">
                                <Tabs
                                    activeKey={activeTab}
                                    onChange={(key) => setActiveTab(key as 'overview' | 'edit' | 'design')}
                                    className="mb-8"
                                    items={[
                                        {
                                            key: 'overview',
                                            label: <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Guest List</span>,
                                        },
                                        {
                                            key: 'edit',
                                            label: <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Wedding Info</span>,
                                        },
                                        {
                                            key: 'design',
                                            label: <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Design Editor</span>,
                                        },
                                    ]}
                                />
                            </div>
                            {activeTab === 'overview' && (
                                <div className="w-full mt-5 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <AddGuestForm
                                            newGuestName={newGuestName}
                                            setNewGuestName={setNewGuestName}
                                            maxAttendees={maxAttendees}
                                            setMaxAttendees={setMaxAttendees}
                                            handleAddGuest={handleAddGuest}
                                        />
                                        <div className="lg:col-span-2">
                                            <GuestTable
                                                guestsList={guestsList}
                                                handleShareLink={handleShareLink}
                                                handleCopyLink={handleCopyLink}
                                                handleDeleteGuest={handleDeleteGuest}
                                                handleUpdateStatus={handleUpdateStatus}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'edit' && (
                                <div className="w-full mt-5 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
                                    <Card className="shadow-2xl shadow-stone-900/5 rounded-[2.5rem] border border-stone-100 bg-white/80 backdrop-blur-md p-6 md:p-10 [&>.ant-card-body]:p-0">
                                        <WeddingDetailsForm
                                            editForm={editForm}
                                            setEditForm={setEditForm}
                                            handleUpdateWedding={handleUpdateWedding}
                                            updateLoading={updateLoading}
                                            updateSuccess={!!updateSuccess}
                                        />
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'design' && (
                                <div className="w-full mt-5 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
                                    <Card className="shadow-2xl shadow-stone-900/5 rounded-[2.5rem] border border-stone-100 bg-white/80 backdrop-blur-md p-6 md:p-10 [&>.ant-card-body]:p-0">
                                        <InvitationDesignPanel
                                            editForm={editForm}
                                            setEditForm={setEditForm}
                                            handleFileUpload={handleFileUpload}
                                            handleUpdateWedding={() => handleUpdateWedding()}
                                            uploading={uploading}
                                            updateLoading={updateLoading}
                                        />
                                    </Card>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                guest={selectedGuestForShare}
                generateInviteLink={(guestId) => {
                    if (typeof window === 'undefined') return '';
                    return `${window.location.origin}/${wedding?.slug}/invite?g=${guestId}`;
                }}
                handleCopy={handleCopyLink}
            />
        </main>
    );
}
