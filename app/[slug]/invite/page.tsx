// app/[slug]/invite/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import InviteClient from './InviteClient';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ to?: string }>;
}

export default async function DynamicInvitePage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const to = resolvedSearchParams.to || 'Family & Friends';

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
