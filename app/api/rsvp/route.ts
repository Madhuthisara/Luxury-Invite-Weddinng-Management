// app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { weddingId, name, status, count } = await request.json();

        if (!weddingId || !name || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert response to database
        const { data, error } = await supabase
            .from('rsvps')
            .insert([
                {
                    wedding_id: weddingId,
                    guest_name: name,
                    status: status,
                    attendees_count: status === 'yes' ? count : 0,
                },
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('RSVP API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
