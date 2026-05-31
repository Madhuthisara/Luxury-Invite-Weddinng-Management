// app/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import InviteClient from './invite/InviteClient';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ g?: string }>;
}

export default async function DynamicInvitationPage({ params, searchParams }: PageProps) {
    const { slug } = await params;

    // Get Wedding details by slug from Supabase
    const { data: wedding, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error || !wedding) {
        notFound();
    }

    return <InviteClient wedding={wedding} />;
}
