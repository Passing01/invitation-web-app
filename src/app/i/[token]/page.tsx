"use client";

import React, { useState, use, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInvitation, TEMPLATE_ID_MAP } from '@/hooks/useInvitation';
import { EnvelopeWrapper } from '@/components/invitation/EnvelopeWrapper';
import { MultiPageInvitation } from '@/components/invitation/MultiPageInvitation';
import { AudioPlayer } from '@/components/invitation/AudioPlayer';
import { InvitationSkeleton } from '@/components/invitation/InvitationSkeleton';
import { TEMPLATE_STYLES, TemplateConfig } from '@/lib/templates';

function InvitationContent({ token }: { token: string }) {
    const searchParams = useSearchParams();
    const { data, loading, error } = useInvitation(token);
    const [containerWidth, setContainerWidth] = useState(500);

    // Dynamic Style Extraction
    const urlStyle = searchParams.get('style');
    const apiStyleId = data?.template_id;

    // Resolve which template key to use (priority: URL > API > Default)
    let styleKey: string = 'royal';

    if (urlStyle) {
        styleKey = urlStyle;
    } else if (apiStyleId) {
        styleKey = TEMPLATE_ID_MAP[apiStyleId] || apiStyleId.toString();
    }

    // Secondary check: if the key is a number, find the slug
    if (!TEMPLATE_STYLES[styleKey]) {
        const found = Object.values(TEMPLATE_STYLES).find(t => t.numericId.toString() === styleKey || t.id === styleKey);
        if (found) styleKey = found.id;
    }

    const currentTemplate: TemplateConfig = TEMPLATE_STYLES[styleKey] || TEMPLATE_STYLES.royal;

    useEffect(() => {
        const handleResize = () => {
            const width = Math.min(window.innerWidth, 2000); // Take full width but scale elements
            setContainerWidth(width);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <InvitationSkeleton />;

    if (error || !data) return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center font-serif text-white p-12 text-center">
            <h2 className="text-4xl mb-6 tracking-tight">Oups...</h2>
            <p className="text-neutral-500 italic mb-10 max-w-md">{error || "Invitation introuvable"}</p>
            <a href="/" className="text-[10px] uppercase tracking-[0.4em] border border-white/10 px-10 py-5 hover:bg-white hover:text-black hover:border-white transition-all duration-500">
                Retour à la galerie
            </a>
        </div>
    );

    return (
        <main className="min-h-[100dvh] bg-[#0a0a0a] overflow-hidden">
            <AudioPlayer url={data.musicUrl} />

            <EnvelopeWrapper
                host={data.host || data.title}
                themeColor={currentTemplate.accentColor}
            >
                <MultiPageInvitation
                    config={currentTemplate}
                    eventData={data}
                    containerWidth={containerWidth}
                />
            </EnvelopeWrapper>

            {/* Subtle background texture */}
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ffffff05_0%,transparent_70%)]" />
            </div>
        </main>
    );
}

export default function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);

    return (
        <Suspense fallback={<InvitationSkeleton />}>
            <InvitationContent token={token} />
        </Suspense>
    );
}
