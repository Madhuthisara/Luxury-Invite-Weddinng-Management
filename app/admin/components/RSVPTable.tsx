'use client';

import React from 'react';
import { Table, Tag } from "antd";
import { Heart, CheckCircle2, Clock } from 'lucide-react';

interface RSVP {
    id: string;
    guest_name: string;
    is_attending: boolean;
    attendees_count: number;
    blessing: string;
    created_at: string;
}

interface RSVPTableProps {
    rsvps: RSVP[];
}

export const RSVPTable = ({ rsvps }: RSVPTableProps) => {

    const columns = [
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">GUEST NAME</span>,
            dataIndex: 'guest_name',
            key: 'guest_name',
            render: (text: string) => <span className="font-semibold text-sm text-stone-800">{text}</span>,
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">ATTENDING</span>,
            key: 'is_attending',
            render: (_: any, record: RSVP) => (
                <div className="flex justify-center">
                    <Tag
                        color={record.is_attending ? "success" : "error"}
                        className="capitalize border-none gap-1 flex items-center w-fit mx-auto px-2 py-1 rounded-full m-0"
                    >
                        {record.is_attending ? (
                            <div className="flex items-center gap-1 text-white font-bold">
                                <CheckCircle2 className="size-3" /> Yes
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-white font-bold">
                                <Clock className="size-3" /> No
                            </div>
                        )}
                    </Tag>
                </div>
            ),
            align: 'center' as const,
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">COUNT</span>,
            dataIndex: 'attendees_count',
            key: 'attendees_count',
            align: 'center' as const,
            render: (count: number) => <span className="font-serif font-bold text-stone-500">{count}</span>,
        },
        {
            title: <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">BLESSING</span>,
            dataIndex: 'blessing',
            key: 'blessing',
            render: (blessing: string) => blessing ? (
                <div className="flex items-center gap-2 text-xs text-stone-500 italic">
                    <Heart className="size-3 text-emerald-500 fill-current opacity-50" />
                    <span className="max-w-[200px] truncate">"{blessing}"</span>
                </div>
            ) : (
                <span className="text-[9px] text-stone-300 uppercase font-black tracking-widest">No message</span>
            ),
        }
    ];

    return (
        <div className="w-full overflow-x-auto bg-white/80 backdrop-blur-md rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-900/5 p-4">
            <Table
                columns={columns}
                dataSource={rsvps}
                pagination={false}
                rowKey="id"
                className="w-full"
            />
        </div>
    );
};