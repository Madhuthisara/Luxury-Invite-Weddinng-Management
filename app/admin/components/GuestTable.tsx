'use client';

import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Dropdown, message, Modal, InputNumber, Select } from "antd";
import type { MenuProps } from 'antd';
import { Users, MoreVertical, Heart, Clock, Mail, Eye, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface Guest {
    id: string;
    name: string;
    status: string;
    max_attendees: number;
    attendees_count: number;
    blessing?: string;
}

interface GuestTableProps {
    guestsList: Guest[];
    handleShareLink: (guest: Guest) => void;
    handleCopyLink: (guest: Guest) => void;
    handleDeleteGuest: (id: string) => void;
    handleUpdateStatus: (id: string, status: string, attendeesCount?: number) => void;
    onRefresh?: () => void;
}

const statusColorMap: Record<string, string> = {
    invited: "default",
    sent: "processing",
    opened: "processing",
    yes: "success",
    no: "error",
};

const STATUS_CONFIG: Record<string, { label: string; icon: any }> = {
    invited: { label: 'Invited', icon: Clock },
    sent: { label: 'Sent', icon: Mail },
    opened: { label: 'Opened', icon: Eye },
    yes: { label: 'Attending', icon: CheckCircle2 },
    no: { label: 'Declined', icon: XCircle },
};

export const GuestTable = ({ guestsList, handleShareLink, handleCopyLink, handleDeleteGuest, handleUpdateStatus, onRefresh }: GuestTableProps) => {
    const [data, setData] = useState<Guest[]>(guestsList);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [attendeeCount, setAttendeeCount] = useState<number>(1);

    useEffect(() => {
        setData(guestsList);
    }, [guestsList]);

    const handleStatusAction = (guest: Guest, newStatus: string) => {
        if (newStatus === 'yes') {
            setSelectedGuest(guest);
            setAttendeeCount(guest.attendees_count || 1);
            setIsModalOpen(true);
        } else {
            handleUpdateStatus(guest.id, newStatus);
        }
    }

    const confirmUpdate = () => {
        if (selectedGuest && attendeeCount <= selectedGuest.max_attendees) {
            handleUpdateStatus(selectedGuest.id, 'yes', attendeeCount);
            setData(prevData => prevData.map((g) =>
                g.id === selectedGuest.id
                    ? { ...g, status: 'yes', attendees_count: attendeeCount }
                    : g
            ));

            message.success(`Updated attendance for ${selectedGuest.name}`);
            setIsModalOpen(false);
        } else {
            message.error("Selected count exceeds the limit!");
        }
    };

    const columns = [
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">#</span>,
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => (
                <span className="text-stone-400 font-mono text-xs">{index + 1}</span>
            )
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">GUEST NAME</span>,
            dataIndex: 'name',
            key: 'name',
            render: (text: string, guest: Guest) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-stone-800 capitalize">{text}</span>
                    {guest.blessing && (
                        <span className="text-[10px] text-amber-700/70 italic flex items-center gap-1 mt-0.5">
                            <Heart className="size-2.5 fill-current" /> {guest.blessing}
                        </span>
                    )}
                </div>
            )
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">STATUS</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    color={statusColorMap[status] || "default"}
                    className="capitalize px-3 py-1 rounded-full m-0 font-medium"
                >
                    {STATUS_CONFIG[status]?.label || status}
                </Tag>
            )
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">SIZE</span>,
            key: 'size',
            render: (_: any, guest: Guest) => (
                <span className="text-stone-600 text-sm font-medium">
                    {guest.attendees_count} / {guest.max_attendees}
                </span>
            )
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">UPDATE STATUS</span>,
            key: 'update_status',
            render: (_: any, guest: Guest) => (
                <Select
                    value={guest.status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusAction(guest, value)}
                    options={Object.entries(STATUS_CONFIG).map(([key, config]) => ({
                        value: key,
                        label: config.label,
                    }))}
                />
            )
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">ACTIONS</span>,
            key: 'actions',
            align: 'right' as const,
            render: (_: any, guest: Guest) => {
                const items: MenuProps['items'] = [
                    { key: 'share', label: 'Share', onClick: () => handleShareLink(guest) },
                    { key: 'copy', label: 'Copy Link', onClick: () => handleCopyLink(guest) },
                    { key: 'delete', label: <span className="text-rose-500">Remove</span>, onClick: () => handleDeleteGuest(guest.id) }
                ];

                return (
                    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                        <Button type="text" shape="circle" icon={<MoreVertical className="size-4 text-stone-400" />} />
                    </Dropdown>
                );
            }
        }
    ];

    const totalInvitedCount = guestsList.reduce((sum, g) => sum + (g.max_attendees || 0), 0);

    return (<>
        <div className="shadow-2xl shadow-stone-900/5 rounded-xl border border-stone-100 overflow-hidden bg-white/90 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-4 pb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-stone-900 text-[#B8935A] rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-stone-800">Guest Registry</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Manage digital invitations</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <Tag color="cyan" className="bg-stone-100 border-none text-stone-600 font-bold px-4 py-1 rounded-full">{guestsList.length} Families</Tag>
                        <Tag color="blue" className="bg-stone-100 border-none text-stone-600 font-bold px-4 py-1 rounded-full">{totalInvitedCount} Invited</Tag>
                    </div>
                    {onRefresh && (
                        <Button
                            type="text"
                            shape="circle"
                            icon={<RefreshCw className="size-4 text-stone-400" />}
                            onClick={onRefresh}
                            className="hover:rotate-180 transition-all duration-500"
                        />
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-0 overflow-x-auto">
                <Table columns={columns as any} dataSource={data} rowKey="id" pagination={false} className="w-full" />
            </div>
        </div>

        <Modal
            title="Confirm Attendance"
            open={isModalOpen}
            onOk={confirmUpdate}
            onCancel={() => setIsModalOpen(false)}
            okText="Confirm"
        >
            <div className="mb-4">
                <p>How many people will be attending with <strong>{selectedGuest?.name}</strong>?</p>
                <p className="text-xs text-stone-400 mt-1">
                    Max allowed for this invitation: <strong>{selectedGuest?.max_attendees}</strong>
                </p>
            </div>

            <InputNumber
                min={1}
                max={selectedGuest?.max_attendees || 1}
                value={attendeeCount}
                onChange={(val) => setAttendeeCount(val || 1)}
                className="w-full"
            />

            {attendeeCount >= (selectedGuest?.max_attendees || 0) && (
                <p className="text-[10px] text-rose-500 mt-2">
                    You have reached the maximum allowed for this invitation.
                </p>
            )}
        </Modal>
    </>
    );
};