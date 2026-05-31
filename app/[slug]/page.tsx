// app/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import EnvelopeClient from './EnvelopeClient';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ to?: string }>;
}

export default async function DynamicEnvelopePage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const to = resolvedSearchParams.to || '';

    // Get Wedding details by slug from Supabase
    const { data: wedding, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error || !wedding) {
        notFound(); // Redirects to Next.js default 404 page if no wedding slug exists
    }

    return <EnvelopeClient wedding={wedding} to={to} />;
}
