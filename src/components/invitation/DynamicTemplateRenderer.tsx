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

            // Dynamic Mapping based on event_type
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

                // Wedding specific
                case 'names':
                case 'couple_names':
                    if (eventData.event_type === 'wedding') {
                        content = `${eventData.groom_name || 'Groom'} & ${eventData.bride_name || 'Bride'}`;
                    } else if (eventData.event_type === 'birthday') {
                        content = eventData.celebrant_name || '';
                    } else if (eventData.event_type === 'corporate') {
                        content = eventData.company_name || '';
                    }
                    break;
                case 'groom_name': content = eventData.groom_name || ''; break;
                case 'bride_name': content = eventData.bride_name || ''; break;

                // Birthday specific
                case 'celebrant_name': content = eventData.celebrant_name || ''; break;
                case 'age': content = eventData.age ? `${eventData.age} Ans` : ''; break;

                // Corporate specific
                case 'company_name': content = eventData.company_name || ''; break;
                case 'agenda':
                    if (Array.isArray(eventData.agenda)) {
                        content = eventData.agenda.join('\n');
                    } else {
                        content = eventData.agenda || '';
                    }
                    break;
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
            const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400';
            const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400';

            let src = element.content || FALLBACK_PHOTO;

            // Mapping dynamic images based on ID and Event Type
            if (eventData.event_type === 'wedding') {
                if (element.id === 'photo' || element.id === 'couple_photo') {
                    // Two photos côte à côte if it's a wedding and we have both
                    return (
                        <div key={element.id} style={{ ...commonStyles, width: '90%', left: '50%' }} className="flex justify-center gap-4">
                            <div className="w-[45%] aspect-[3/4] rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-neutral-900">
                                <img src={eventData.groom_photo_url || FALLBACK_PHOTO} alt="Groom" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-[45%] aspect-[3/4] rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-neutral-900">
                                <img src={eventData.bride_photo_url || FALLBACK_PHOTO} alt="Bride" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    );
                }
                if (element.id === 'groom_photo') src = eventData.groom_photo_url || FALLBACK_PHOTO;
                if (element.id === 'bride_photo') src = eventData.bride_photo_url || FALLBACK_PHOTO;
            } else if (eventData.event_type === 'birthday') {
                if (element.id === 'photo' || element.id === 'celebrant_photo') {
                    src = eventData.celebrant_photo_url || FALLBACK_PHOTO;
                }
            } else if (eventData.event_type === 'corporate') {
                if (element.id === 'logo' || element.id === 'company_logo') {
                    src = eventData.company_logo_url || FALLBACK_LOGO;
                }
            }

            return (
                <div key={element.id} style={{ ...commonStyles, aspectRatio: eventData.event_type === 'corporate' ? 'auto' : '1/1', overflow: 'hidden' }} className={cn(
                    "border-2 border-white/20 shadow-xl bg-neutral-900",
                    eventData.event_type === 'corporate' ? "rounded-lg" : "rounded-full"
                )}>
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
                            eventData={eventData}
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
