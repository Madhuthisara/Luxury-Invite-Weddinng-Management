'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, Button, Tabs, Modal, Drawer } from "antd";

// Sub-components
import { LoginScreen } from './components/LoginScreen';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsPanel } from './components/StatsPanel';
import { GuestTable } from './components/GuestTable';
import { AddGuestForm } from './components/AddGuestForm';
import { WeddingDetailsForm } from './components/WeddingDetailsForm';
import { InvitationDesignPanel } from './components/InvitationDesignPanel';
import { ShareModal } from './components/ShareModal';
import { toast } from 'sonner';
import { ExclamationCircleFilled } from '@ant-design/icons';

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
    const [maxAttendees, setMaxAttendees] = useState(1);

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

    // Full View State
    const [isRegistryFullView, setIsRegistryFullView] = useState(false);

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
            wedding_date: data.wedding_date ? data.wedding_date : '',
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
                .order('id', { ascending: false });

            if (fetchErr) throw fetchErr;
            setGuestsList(data || []);
        } catch (err) {
            toast.error('Error fetching guests.');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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
            toast.success('Logged in successfully!');
        } catch (err: any) {
            toast.error('Invalid passcode. Please try again.');
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

    const handleUpdateWedding = async (overrideForm?: any) => {
        if (!wedding?.id) return;

        setUpdateLoading(true);
        setUpdateSuccess('');

        const formToSave = overrideForm || editForm;

        try {
            const { data, error: updateErr } = await supabase
                .from('weddings')
                .update({
                    groom_name: formToSave.groom_name,
                    bride_name: formToSave.bride_name,
                    wedding_date: formToSave.wedding_date ? new Date(formToSave.wedding_date).toISOString() : null,
                    location: formToSave.location,
                    location_map_link: formToSave.location_map_link,
                    passcode: formToSave.passcode,
                    blank_card_url: formToSave.blank_card_url,
                    name_y_position: Number(formToSave.name_y_position) || 40,
                    name_color: formToSave.name_color,
                    name_font_size: Number(formToSave.name_font_size) || 28,
                    bg_music_url: formToSave.bg_music_url || null
                })
                .eq('id', wedding.id)
                .select();

            if (updateErr) throw updateErr;

            if (data && data.length > 0) {
                setWedding(data[0]);
                sessionStorage.setItem('logged_wedding', JSON.stringify(data[0]));
                setUpdateSuccess('Synced 🎉');
                setTimeout(() => setUpdateSuccess(''), 3000);
                toast.success('Updated successfully!');
            }
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setUpdateLoading(false);
        }
    };


    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newGuestName.trim() || !wedding) return;


        const toastId = toast.loading('Adding guest...');

        try {
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

            if (insertError) throw insertError;

            setNewGuestName('');
            setMaxAttendees(1);

            await fetchDashboardData(wedding.id);

            toast.success('Guest added successfully!', { id: toastId });

        } catch (error) {
            console.error("Add guest error:", error);
            toast.error('Failed to add guest. Please try again.', { id: toastId });
        }
    };

    const handleDeleteGuest = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this guest?',
            icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
            content: 'This action cannot be undone and the guest will be removed permanently.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,

            onOk: async () => {
                try {
                    const { error: deleteError } = await supabase
                        .from('guests')
                        .delete()
                        .eq('id', id);

                    if (deleteError) throw deleteError;

                    await fetchDashboardData(wedding.id);
                    toast.success('Guest deleted successfully!');

                } catch (error) {
                    console.error("Delete error:", error);
                    toast.error('Failed to delete guest. Please try again.');
                }
            },
            onCancel() { },
        });
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
        toast.success('Invitation link copied to clipboard!');
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
                .from('wedding-assets-new')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('wedding-assets-new')
                .getPublicUrl(filePath);

            setEditForm({ ...editForm, blank_card_url: publicUrl });
            toast.success('File uploaded successfully!');
        } catch (err) {
            console.error('Error uploading:', err);
            toast.error('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !wedding) return;
        setUploading(true);

        try {
            const file = e.target.files[0];
            const fileName = `${wedding.id}.mp3`;
            const filePath = `music/${fileName}`;

            await deleteMusicFile(`music/${fileName}`);

            const { error: uploadError } = await supabase.storage
                .from('wedding-assets-new')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    contentType: 'audio/mpeg'
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('wedding-assets-new')
                .getPublicUrl(filePath);

            setEditForm(prev => ({ ...prev, bg_music_url: publicUrl }));
            toast.success('Audio uploaded successfully!');
        } catch (err) {
            toast.error('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const deleteMusicFile = async (currentUrl: string) => {
        if (!currentUrl) return;

        const fileName = currentUrl.split('/').pop()?.split('?')[0];

        if (fileName) {
            const { error } = await supabase.storage
                .from('wedding-assets-new')
                .remove([`music/${fileName}`]);

            if (error) toast.error("Storage delete error:");
            toast.success('Audio deleted successfully!');
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
                        <DashboardHeader
                            handleLogout={handleLogout}
                            onNavClick={(name) => {
                                if (name === 'Registry') setIsRegistryFullView(true);
                            }}
                        />

                        {/* Content Area */}
                        {!isRegistryFullView ? (
                            <>
                                {/* Metrics */}
                                {wedding && (
                                    <StatsPanel
                                        stats={{
                                            total: guestsList.reduce((sum, g) => sum + (g.max_attendees || 0), 0),
                                            families: guestsList.length,
                                            invited: guestsList.reduce((sum, g) => sum + (g.max_attendees || 0), 0),
                                            sent: guestsList.filter(g => g.status === 'sent').length,
                                            opened: guestsList.filter(g => g.status === 'opened').length,
                                            yes: guestsList.reduce((sum, g) => sum + (g.attendees_count || 0), 0),
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
                                                    label: <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Registry</span>,
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
                                                <div className="lg:col-span-2 flex flex-col gap-4">
                                                    <GuestTable
                                                        guestsList={guestsList.slice(0, 5)}
                                                        handleShareLink={handleShareLink}
                                                        handleCopyLink={handleCopyLink}
                                                        handleDeleteGuest={handleDeleteGuest}
                                                        handleUpdateStatus={handleUpdateStatus}
                                                        onRefresh={() => fetchDashboardData(wedding.id)}
                                                    />
                                                    <div className="flex justify-center">
                                                        <Button
                                                            type="link"
                                                            onClick={() => setIsRegistryFullView(true)}
                                                            className="text-gold-600 font-bold uppercase tracking-widest text-[10px] hover:text-gold-700"
                                                        >
                                                            View Full Registry →
                                                        </Button>
                                                    </div>
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
                                                    handleUpdateWedding={() => handleUpdateWedding()}
                                                    updateLoading={updateLoading}
                                                    updateSuccess={!!updateSuccess}
                                                    handleAudioUpload={handleAudioUpload}
                                                    uploading={uploading}
                                                    deleteMusicFile={deleteMusicFile}
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
                            </>
                        ) : (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <Button
                                        onClick={() => setIsRegistryFullView(false)}
                                        type="text"
                                        className="font-bold text-stone-500 hover:text-stone-800 uppercase tracking-widest text-[10px] flex items-center gap-2"
                                    >
                                        ← Back to Dashboard
                                    </Button>
                                </div>
                                <GuestTable
                                    guestsList={guestsList}
                                    handleShareLink={handleShareLink}
                                    handleCopyLink={handleCopyLink}
                                    handleDeleteGuest={handleDeleteGuest}
                                    handleUpdateStatus={handleUpdateStatus}
                                    onRefresh={() => fetchDashboardData(wedding.id)}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                guest={selectedGuestForShare}
                generateInviteLink={(guestId) => {
                    if (typeof window === 'undefined') return '';
                    return `${window.location.origin}/${wedding?.slug}?g=${guestId}`;
                }}
                handleCopy={handleCopyLink}
            />


        </main>
    );
}
