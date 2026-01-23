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

    // Logic to select template: 
    // 1. Check URL query string (?style=...) 
    // 2. If not, check data.template_id from Laravel API
    // 3. Fallback to 'royal'
    const urlStyle = searchParams.get('style');
    const apiStyle = data ? TEMPLATE_ID_MAP[data.template_id] : null;
    const styleKey = urlStyle || apiStyle || 'royal';

    const currentTemplate: TemplateConfig = TEMPLATE_STYLES[styleKey] || TEMPLATE_STYLES.royal;

    useEffect(() => {
        const handleResize = () => {
            const width = Math.min(window.innerWidth - 32, 500);
            setContainerWidth(width);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <InvitationSkeleton />;
    if (error || !data) return (
        <div className="min-h-screen flex flex-col items-center justify-center font-serif text-white p-6 text-center">
            <h2 className="text-3xl mb-4">Oups...</h2>
            <p className="text-neutral-500 italic mb-8">{error || "Invitation introuvable"}</p>
            <a href="/" className="text-[10px] uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all">
                Retour à l'accueil
            </a>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
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

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ffffff10_0%,transparent_50%)]" />
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
