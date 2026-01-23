"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TemplateConfig, TemplateElement, TemplatePage } from '@/lib/templates';
import { cn, formatDate } from '@/lib/utils';
import { RSVPForm } from './RSVPForm';
import { MapPin } from 'lucide-react';
import { LaravelInvitationResponse } from '@/hooks/useInvitation';

interface DynamicTemplateRendererProps {
    page: TemplatePage;
    config: TemplateConfig;
    eventData: LaravelInvitationResponse;
    containerWidth: number;
}

export function DynamicTemplateRenderer({
    page,
    config,
    eventData,
    containerWidth,
}: DynamicTemplateRendererProps) {
    const scale = containerWidth / 500;

    const renderElement = (element: TemplateElement) => {
        const commonStyles: React.CSSProperties = {
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: 'translate(-50%, -50%)',
            width: element.style.width ? `${element.style.width}%` : 'auto',
            zIndex: 10,
        };

        if (element.type === 'text') {
            let content = element.content || '';

            // Dynamic Mapping
            switch (element.id) {
                case 'title': content = eventData.title; break;
                case 'host': content = eventData.host || eventData.title; break;
                case 'date': content = formatDate(eventData.event_date); break;
                case 'location':
                    const loc = eventData.location || (eventData.locations && eventData.locations[0]);
                    content = loc ? `${loc.name}\n${loc.address}` : '';
                    break;
                case 'dress_code': content = eventData.dress_code || ''; break;
                case 'hashtag': content = eventData.custom_data?.hashtag || ''; break;
            }

            return (
                <div
                    key={element.id}
                    style={{
                        ...commonStyles,
                        fontSize: `${(element.style.fontSize || 16) * scale}px`,
                        fontFamily: element.style.fontFamily,
                        fontWeight: element.style.fontWeight,
                        color: element.style.color,
                        textAlign: element.style.textAlign,
                        letterSpacing: element.style.letterSpacing,
                        textTransform: element.style.textTransform,
                        fontStyle: element.style.italic ? 'italic' : 'normal',
                        whiteSpace: 'pre-line',
                    }}
                >
                    {content}
                </div>
            );
        }

        if (element.type === 'image') {
            let src = element.content || '';
            if (element.id === 'groom_photo') src = eventData.custom_data?.groom_photo || src;
            if (element.id === 'bride_photo') src = eventData.custom_data?.bride_photo || src;

            return (
                <div key={element.id} style={{ ...commonStyles, aspectRatio: '1/1', overflow: 'hidden' }} className="rounded-full border-2 border-white/20 shadow-xl">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
            );
        }

        if (element.type === 'qrcode') {
            const qrSize = (element.style.width || 100) * scale * 2;
            return (
                <div key={element.id} style={commonStyles}>
                    <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                        <QRCodeSVG
                            value={`https://votre-app.com/pass/${eventData.template_id}`} // Example
                            size={qrSize}
                            level="H"
                            fgColor="#1a1a1a"
                        />
                    </div>
                </div>
            );
        }

        if (element.type === 'rsvp-form') {
            const isLight = config.bgColor === '#ffffff' || config.bgColor === '#fffafb' || config.bgColor === '#f4e0c8' || config.bgColor === '#f0f4f8';
            return (
                <div key={element.id} style={commonStyles} className="w-full px-4">
                    <div className={cn(
                        "backdrop-blur-md p-6 border rounded-2xl shadow-xl",
                        isLight ? "bg-black/5 border-black/10 text-black" : "bg-white/5 border-white/10 text-white"
                    )}>
                        <RSVPForm
                            variant={isLight ? 'light' : 'dark'}
                            onSubmit={(data) => console.log('RSVP:', data)}
                        />
                    </div>
                </div>
            );
        }

        if (element.type === 'map') {
            const loc = eventData.location || (eventData.locations && eventData.locations[0]);
            if (!loc) return null;

            return (
                <div key={element.id} style={commonStyles} className="w-full px-4">
                    <div
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank')}
                        className="aspect-video bg-neutral-800 rounded-xl overflow-hidden relative cursor-pointer group border border-white/10"
                    >
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=48.8688,2.3392&zoom=14&size=600x300&scale=2&maptype=roadmap&format=png&visual_refresh=true')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 group-hover:bg-black/10 transition-colors">
                            <MapPin size={32} className="mb-2 text-red-500" />
                            <span className="text-xs uppercase tracking-widest font-serif">Ouvrir dans Maps</span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className="relative overflow-hidden w-full h-full"
            style={{
                backgroundColor: config.bgColor,
            }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${page.bgUrl || config.bgUrl || 'none'})`,
                    opacity: (page.bgUrl || config.bgUrl) ? 1 : 0
                }}
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute inset-0 z-10 p-8 md:p-20 flex flex-col">
                {page.elements.map(renderElement)}
            </div>
            <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css2?family=${config.fonts.join('&family=')}&display=swap`}
            />
        </div>
    );
}
